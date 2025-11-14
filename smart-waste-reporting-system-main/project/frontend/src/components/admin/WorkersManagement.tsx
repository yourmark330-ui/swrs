import React, { useState } from 'react';
import { 
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { mockWorkers, mockReports } from '../../data/mockData';
import { Worker } from '../../types';

const WorkersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredWorkers = mockWorkers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkerStats = (workerId: string, workerName: string) => {
    const assignedTasks = mockReports.filter(r => r.assignedWorker === workerName);
    const completedTasks = assignedTasks.filter(r => r.status === 'Resolved');
    const pendingTasks = assignedTasks.filter(r => r.status === 'In Progress' || r.status === 'Assigned');
    
    return {
      total: assignedTasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      completionRate: assignedTasks.length > 0 ? Math.round((completedTasks.length / assignedTasks.length) * 100) : 0
    };
  };

  const AddWorkerForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Worker</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter worker name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+91-XXXXXXXXXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="worker@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Zone
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Central Delhi</option>
              <option>North Delhi</option>
              <option>South Delhi</option>
              <option>East Delhi</option>
              <option>West Delhi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter initial password"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Add Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1920px] mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workers Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your waste collection team
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Worker</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{mockWorkers.length}</p>
            <p className="text-sm text-gray-600">Total Workers</p>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {mockWorkers.reduce((acc, worker) => acc + worker.activeJobs, 0)}
            </p>
            <p className="text-sm text-gray-600">Active Jobs</p>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(mockWorkers.reduce((acc, worker) => acc + worker.activeJobs, 0) / mockWorkers.length)}
            </p>
            <p className="text-sm text-gray-600">Avg Jobs/Worker</p>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => {
          const stats = getWorkerStats(worker.id, worker.name);
          
          return (
            <div key={worker.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                      <p className="text-sm text-gray-600">{worker.zone}</p>
                    </div>
                  </div>
                  
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{worker.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{worker.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{worker.zone}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-semibold text-gray-900">{stats.completed}</span>
                      </div>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-gray-900">{stats.pending}</span>
                      </div>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    {stats.completionRate}% completion rate
                  </p>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Assign Task
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && <AddWorkerForm />}
    </div>
  );
};

export default WorkersManagement;