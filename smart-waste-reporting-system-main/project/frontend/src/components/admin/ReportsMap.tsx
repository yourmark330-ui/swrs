import React, { useState } from 'react';
import { 
  Filter,
  MapPin,
  Calendar,
  Trash2,
  User,
  Clock
} from 'lucide-react';
import { mockReports } from '../../data/mockData';
import { WasteReport } from '../../types';

interface ReportsMapProps {
  reports: any[];
  onAssignWorker: (reportId: string, workerId: string) => void;
}

const ReportsMap: React.FC<ReportsMapProps> = ({ reports, onAssignWorker }) => {
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedReportForAssignment, setSelectedReportForAssignment] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    wasteType: 'all',
    severity: 'all'
  });

  const filteredReports = reports.filter(report => {
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    if (filters.wasteType !== 'all' && report.wasteType !== filters.wasteType) return false;
    if (filters.severity !== 'all') {
      const severityThreshold = parseFloat(filters.severity);
      if (report.severity < severityThreshold) return false;
    }
    return true;
  });

  const availableWorkers = [
    { id: '1', name: 'Amit Kumar', zone: 'Central Delhi', activeJobs: 2 },
    { id: '2', name: 'Suresh Yadav', zone: 'North Delhi', activeJobs: 1 },
    { id: '3', name: 'Ravi Gupta', zone: 'South Delhi', activeJobs: 3 },
    { id: '4', name: 'Priya Singh', zone: 'East Delhi', activeJobs: 1 },
    { id: '5', name: 'Rajesh Kumar', zone: 'West Delhi', activeJobs: 2 }
  ];

  const handleAssignWorker = (workerId: string) => {
    if (selectedReportForAssignment) {
      onAssignWorker(selectedReportForAssignment, workerId);
      setShowAssignModal(false);
      setSelectedReportForAssignment(null);
    }
  };

  const AssignWorkerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign Worker</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {availableWorkers.map((worker) => (
            <button
              key={worker.id}
              onClick={() => handleAssignWorker(worker.id)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{worker.name}</p>
                  <p className="text-sm text-gray-600">{worker.zone}</p>
                </div>
                <span className="text-sm text-gray-500">{worker.activeJobs} active jobs</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowAssignModal(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-orange-600 bg-orange-100';
      case 'Assigned': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'Medical': return 'text-red-600 bg-red-100';
      case 'E-Waste': return 'text-purple-600 bg-purple-100';
      case 'Plastic': return 'text-blue-600 bg-blue-100';
      case 'Organic': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Map View</h1>
          <p className="text-gray-600 mt-1">
            {filteredReports.length} reports found
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  value={filters.wasteType}
                  onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Organic">Organic</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Medical">Medical</option>
                  <option value="E-Waste">E-Waste</option>
                  <option value="Glass">Glass</option>
                  <option value="Metal">Metal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Severity
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="8.0">High (8.0+)</option>
                  <option value="6.0">Medium (6.0+)</option>
                  <option value="4.0">Low (4.0+)</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({ status: 'all', wasteType: 'all', severity: 'all' })}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Map and Reports */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mock Map */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactive Map</h2>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full gap-1 p-4">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="bg-green-200 rounded"></div>
                  ))}
                </div>
              </div>
              
              {/* Mock markers */}
              {filteredReports.slice(0, 8).map((report, index) => (
                <div
                  key={report.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-full ${
                    selectedReport?.id === report.id ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${20 + (index % 4) * 20}%`,
                    top: `${30 + Math.floor(index / 4) * 40}%`
                  }}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                    report.status === 'Pending' ? 'bg-orange-500' :
                    report.status === 'Assigned' ? 'bg-blue-500' :
                    report.status === 'In Progress' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                  </div>
                  {selectedReport?.id === report.id && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-3 w-64">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{report.location.address}</p>
                        <p className="text-gray-600 mt-1">{report.wasteType} - Severity: {report.severity}</p>
                        <p className="text-xs text-gray-500 mt-1">{report.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-center">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-gray-600">Interactive Map with Report Markers</p>
                <p className="text-sm text-gray-500 mt-1">Click on markers to view details</p>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Report Details</h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedReport?.id === report.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={report.imageUrl}
                      alt="Waste report"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">
                            {report.location.address}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {report.description}
                          </p>
                        </div>
                        
                        <div className="text-right ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWasteTypeColor(report.wasteType)}`}>
                          {report.wasteType}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Trash2 className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-4">
                    {report.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setSelectedReportForAssignment(report.id);
                          setShowAssignModal(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Assign Worker
                      </button>
                    )}
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                            Severity: {report.severity}/10
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {report.citizenName}
                          </span>
                        </div>
                        {report.assignedWorker && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {report.assignedWorker}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {showAssignModal && <AssignWorkerModal />}
    </div>
  );
};

export default ReportsMap;