import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Calendar
} from 'lucide-react';
import { mockReports } from '../../data/mockData';

const StatusPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let results = [];
    
    if (searchType === 'id') {
      results = mockReports.filter(report => 
        report.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      results = mockReports.filter(report => 
        report.citizenPhone.includes(searchQuery)
      );
    }
    
    setSearchResults(results);
    setSearching(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-orange-600 bg-orange-100';
      case 'Assigned': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return Clock;
      case 'Assigned': return AlertTriangle;
      case 'In Progress': return AlertTriangle;
      case 'Resolved': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Check Report Status
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
            Track the progress of your waste reports
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 hover:shadow-lg transition-shadow duration-300 animate-slide-up animation-delay-300">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search By
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="id"
                    checked={searchType === 'id'}
                    onChange={(e) => setSearchType(e.target.value as 'id' | 'phone')}
                    className="mr-2"
                  />
                  Report ID
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="phone"
                    checked={searchType === 'phone'}
                    onChange={(e) => setSearchType(e.target.value as 'id' | 'phone')}
                    className="mr-2"
                  />
                  Phone Number
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'id' ? 'Report ID' : 'Phone Number'}
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'id' ? 'Enter report ID (e.g., 1, 2, 3)' : 'Enter phone number'}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || searching}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2 transition-all duration-300 group"
                >
                  {searching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span>{searching ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 animate-slide-up">
              Search Results ({searchResults.length})
            </h2>
            
            {searchResults.map((report) => {
              const StatusIcon = getStatusIcon(report.status);
              
              return (
                <div key={report.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in-up group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                          Report #{report.id}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted: {new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{report.citizenPhone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {report.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={report.imageUrl}
                          alt="Waste report"
                          className="w-full h-48 rounded-lg object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                            <p className="text-sm text-gray-600">{report.location.address}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Waste Type</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.wasteType === 'Medical' ? 'bg-red-100 text-red-800' :
                              report.wasteType === 'E-Waste' ? 'bg-purple-100 text-purple-800' :
                              report.wasteType === 'Plastic' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {report.wasteType}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Severity</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    report.severity >= 8 ? 'bg-red-500' :
                                    report.severity >= 6 ? 'bg-orange-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${(report.severity / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {report.severity}/10
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {report.assignedWorker && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Assigned Worker</h4>
                            <p className="text-sm text-gray-600">{report.assignedWorker}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">Status Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Report Submitted</p>
                            <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {report.status !== 'Pending' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Report Assigned</p>
                              <p className="text-xs text-gray-500">{new Date(report.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        
                        {report.status === 'In Progress' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Pickup In Progress</p>
                              <p className="text-xs text-gray-500">{new Date(report.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        
                        {report.status === 'Resolved' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Report Resolved</p>
                              <p className="text-xs text-gray-500">{new Date(report.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchResults.length === 0 && searchQuery && !searching && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              No reports found for "{searchQuery}". Please check your {searchType === 'id' ? 'report ID' : 'phone number'} and try again.
            </p>
          </div>
        )}

        {/* Demo IDs */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h3 className="font-medium text-blue-900 mb-2">Demo Report IDs for Testing:</h3>
          <p className="text-sm text-blue-700">
            Try searching with IDs: <span className="font-mono">1</span>, <span className="font-mono">2</span>, <span className="font-mono">3</span>, or <span className="font-mono">4</span>
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Or phone numbers: <span className="font-mono">+91-9876543210</span>, <span className="font-mono">+91-8765432109</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;