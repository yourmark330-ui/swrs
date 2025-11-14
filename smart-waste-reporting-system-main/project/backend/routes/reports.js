const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const RewardLog = require('../models/RewardLog');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { 
  validateReportSubmission, 
  validateReportUpdate, 
  validateMongoId, 
  validatePagination,
  validateDateRange,
  validateLocationQuery
} = require('../middleware/validation');
const { parseLocationField } = require('../middleware/validation');

const router = express.Router();

// @desc    Submit a new waste report
// @route   POST /api/reports
// @access  Private (Citizens)
router.post('/', 
  protect, 
  uploadSingle('image'), 
  parseLocationField,
  validateReportSubmission, 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image is required'
        });
      }

      let {
        citizenName,
        citizenPhone,
        description,
        wasteType,
        severity,
        confidence,
        location
      } = req.body;

      // Parse location if sent as JSON string via multipart/form-data
      if (typeof location === 'string') {
        try {
          location = JSON.parse(location);
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid location payload' });
        }
      }

      // Parse location coordinates if they're strings
      let coordinates = location.coordinates;
      if (coordinates && typeof coordinates[0] === 'string') {
        coordinates = coordinates.map(coord => parseFloat(coord));
      }

      // Create report
      const report = await Report.create({
        citizenId: req.user.id,
        citizenName,
        citizenPhone,
        imagePath: req.file.path,
        imageUrl: req.file.url,
        description,
        wasteType,
        severity: parseFloat(severity),
        confidence: confidence ? parseFloat(confidence) : 0.5,
        location: {
          address: location.address,
          coordinates: coordinates,
          accuracy: location.accuracy,
          timestamp: location.timestamp ? new Date(location.timestamp) : new Date()
        }
      });

      // Award points for report submission
      const user = await User.findById(req.user.id);
      const reportPoints = 10;
      user.addRewardPoints(reportPoints, 'Waste report submission');
      
      // Check for achievements
      const userReportsCount = await Report.countDocuments({ citizenId: req.user.id });
      
      if (userReportsCount === 1) {
        user.addBadge('first_report', 'First Report', 'Submitted your first waste report');
        user.addAchievement('first_reporter', 'First Reporter', 'Submitted your first waste report', 5);
      } else if (userReportsCount === 10) {
        user.addBadge('eco_warrior', 'Eco Warrior', 'Submitted 10 waste reports');
        user.addAchievement('eco_warrior', 'Eco Warrior', 'Submitted 10 waste reports', 25);
      } else if (userReportsCount === 50) {
        user.addBadge('clean_city_hero', 'Clean City Hero', 'Submitted 50 waste reports');
        user.addAchievement('clean_city_hero', 'Clean City Hero', 'Submitted 50 waste reports', 100);
      }
      
      await user.save();

      // Log the reward
      await RewardLog.create({
        userId: req.user.id,
        action: 'report_submission',
        points: reportPoints,
        description: 'Points for submitting waste report',
        metadata: { reportId: report._id },
        balanceAfter: user.rewardPoints
      });

      // Populate the report with citizen info
      await report.populate('citizenId', 'name email phone');

      res.status(201).json({
        success: true,
        message: 'Report submitted successfully',
        data: {
          report,
          reward: {
            points: reportPoints,
            newBadges: user.badges.filter(badge => 
              ['first_report', 'eco_warrior', 'clean_city_hero'].includes(badge.badgeId) &&
              new Date() - badge.earnedAt < 1000 // Just earned
            )
          }
        }
      });
    } catch (error) {
      console.error('Report submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during report submission'
      });
    }
  }
);

// @desc    Get all reports (with filtering and pagination)
// @route   GET /api/reports
// @access  Private (Admin/Agent)
router.get('/', 
  protect, 
  authorize('admin', 'worker'), 
  validatePagination,
  validateDateRange,
  validateLocationQuery,
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        status,
        wasteType,
        severity,
        assignedAgentId,
        startDate,
        endDate,
        latitude,
        longitude,
        radius = 10
      } = req.query;

      // Build query
      let query = {};

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Filter by waste type
      if (wasteType) {
        query.wasteType = wasteType;
      }

      // Filter by severity
      if (severity) {
        query.severity = { $gte: parseFloat(severity) };
      }

      // Filter by assigned agent
      if (assignedAgentId) {
        query.assignedAgentId = assignedAgentId;
      }

      // Filter by date range
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Filter by location
      if (latitude && longitude) {
        query['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
          }
        };
      }

      // If worker, only show their assigned reports
      if (req.user.role === 'worker') {
        query.assignedAgentId = req.user.id;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort,
        populate: [
          { path: 'citizenId', select: 'name email phone' },
          { path: 'assignedAgentId', select: 'name email phone' }
        ]
      };

      const reports = await Report.paginate(query, options);

      res.json({
        success: true,
        data: reports
      });
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching reports'
      });
    }
  }
);

// @desc    Get user's own reports
// @route   GET /api/reports/my-reports
// @access  Private (Citizens)
router.get('/my-reports', protect, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [
        { path: 'assignedAgentId', select: 'name phone' }
      ]
    };

    const reports = await Report.paginate({ citizenId: req.user.id }, options);

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get user reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your reports'
    });
  }
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
router.get('/:id', protect, validateMongoId(), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('citizenId', 'name email phone')
      .populate('assignedAgentId', 'name email phone')
      .populate('validatedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user can access this report
    if (req.user.role === 'citizen' && report.citizenId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report'
      });
    }

    if (req.user.role === 'agent' && 
        (!report.assignedAgentId || report.assignedAgentId._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report'
      });
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report'
    });
  }
});

// @desc    Update report (assign agent, update status, etc.)
// @route   PUT /api/reports/:id
// @access  Private (Admin/Agent)
router.put('/:id', 
  protect, 
  authorize('admin', 'worker'), 
  validateMongoId(),
  validateReportUpdate,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Check if worker can only update their assigned reports
      if (req.user.role === 'worker' && 
          (!report.assignedAgentId || report.assignedAgentId.toString() !== req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this report'
        });
      }

      const { status, assignedAgentId, completionNotes, rejectionReason } = req.body;

      // Handle status updates
      if (status) {
        if (status === 'Assigned' && assignedAgentId && req.user.role === 'admin') {
          const agent = await User.findById(assignedAgentId);
          if (!agent || (agent.role !== 'agent' && agent.role !== 'worker')) {
            return res.status(400).json({
              success: false,
              message: 'Invalid agent ID'
            });
          }
          report.assignToAgent(assignedAgentId, agent.name);
        } else if (status === 'In Progress' && (req.user.role === 'agent' || req.user.role === 'worker')) {
          report.startWork();
        } else if (status === 'Resolved' && (req.user.role === 'agent' || req.user.role === 'worker')) {
          if (!completionNotes) {
            return res.status(400).json({
              success: false,
              message: 'Completion notes are required when resolving a report'
            });
          }
          report.completeWork(completionNotes);
        } else if (status === 'Rejected' && req.user.role === 'admin') {
          if (!rejectionReason) {
            return res.status(400).json({
              success: false,
              message: 'Rejection reason is required when rejecting a report'
            });
          }
          report.rejectReport(rejectionReason);
        } else {
          report.status = status;
        }
      }

      await report.save();

      // Award validation points if report is resolved
      if (status === 'Resolved') {
        const citizen = await User.findById(report.citizenId);
        if (citizen) {
          const validationPoints = 20;
          citizen.addRewardPoints(validationPoints, 'Report validated and resolved');
          await citizen.save();

          // Log the reward
          await RewardLog.create({
            userId: citizen._id,
            action: 'report_validation',
            points: validationPoints,
            description: 'Points for validated and resolved report',
            metadata: { reportId: report._id },
            balanceAfter: citizen.rewardPoints
          });
        }
      }

      await report.populate([
        { path: 'citizenId', select: 'name email phone' },
        { path: 'assignedAgentId', select: 'name email phone' }
      ]);

      res.json({
        success: true,
        message: 'Report updated successfully',
        data: { report }
      });
    } catch (error) {
      console.error('Update report error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating report'
      });
    }
  }
);

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), validateMongoId(), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting report'
    });
  }
});

// @desc    Get reports statistics
// @route   GET /api/reports/stats/overview
// @access  Private (Admin)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Report.aggregate([
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          pendingReports: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          assignedReports: {
            $sum: { $cond: [{ $eq: ['$status', 'Assigned'] }, 1, 0] }
          },
          inProgressReports: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          resolvedReports: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          },
          averageSeverity: { $avg: '$severity' },
          highPriorityReports: {
            $sum: { $cond: [{ $gte: ['$severity', 8] }, 1, 0] }
          }
        }
      }
    ]);

    const wasteTypeStats = await Report.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          averageSeverity: { $avg: '$severity' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const monthlyStats = await Report.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          reports: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalReports: 0,
          pendingReports: 0,
          assignedReports: 0,
          inProgressReports: 0,
          resolvedReports: 0,
          averageSeverity: 0,
          highPriorityReports: 0
        },
        wasteTypes: wasteTypeStats,
        monthlyTrends: monthlyStats
      }
    });
  } catch (error) {
    console.error('Get reports stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;