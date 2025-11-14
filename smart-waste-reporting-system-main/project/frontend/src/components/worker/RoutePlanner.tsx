import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Truck,
  Calendar,
  Users
} from 'lucide-react';
import { mockReports } from '../../data/mockData';

interface RoutePlannerProps {
  onNavigate?: (view: string) => void;
}

interface RoutePoint {
  id: string;
  address: string;
  lat: number;
  lng: number;
  priority: number;
  estimatedTime: number;
  wasteType: string;
  status: string;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onNavigate }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<RoutePoint[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Get worker tasks
  const workerTasks = mockReports.filter(report => 
    report.assignedWorker === 'Amit Kumar' || 
    (report.status === 'Assigned' || report.status === 'In Progress')
  );

  useEffect(() => {
    // Initialize route with current tasks
    const routePoints: RoutePoint[] = workerTasks.map(task => ({
      id: task.id,
      address: task.location.address,
      lat: task.location.lat,
      lng: task.location.lng,
      priority: task.severity,
      estimatedTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      wasteType: task.wasteType,
      status: task.status
    }));
    
    setOptimizedRoute(routePoints);
    setTotalDistance(routePoints.length * 2.5); // Mock distance calculation
    setTotalTime(routePoints.reduce((acc, point) => acc + point.estimatedTime, 0));
  }, [workerTasks]);

  const optimizeRoute = async () => {
    setIsOptimizing(true);
    
    // Simulate route optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sort by priority (high severity first) and proximity
    const sorted = [...optimizedRoute].sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return a.estimatedTime - b.estimatedTime; // Shorter time first
    });
    
    setOptimizedRoute(sorted);
    setIsOptimizing(false);
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentTaskIndex(0);
  };

  const nextTask = () => {
    if (currentTaskIndex < optimizedRoute.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const previousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const resetRoute = () => {
    setIsNavigating(false);
    setCurrentTaskIndex(0);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 bg-red-100';
    if (priority >= 6) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Assigned': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Planner</h1>
          <p className="text-gray-600 mt-1">
            Optimize your daily collection route for maximum efficiency
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onNavigate?.('tasks')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Truck className="h-4 w-4" />
            <span>Back to Tasks</span>
          </button>
        </div>
      </div>

      {/* Route Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Route className="h-5 w-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {optimizedRoute.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Total Stops</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Navigation className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {totalDistance.toFixed(1)} km
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Total Distance</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Estimated Time</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Route Date</p>
        </div>
      </div>

      {/* Route Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={optimizeRoute}
              disabled={isOptimizing}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isOptimizing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Route className="h-5 w-5" />
              )}
              <span>{isOptimizing ? 'Optimizing...' : 'Optimize Route'}</span>
            </button>
            
            {!isNavigating ? (
              <button
                onClick={startNavigation}
                disabled={optimizedRoute.length === 0}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Start Navigation</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetRoute}
                  className="bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Pause className="h-5 w-5" />
                  <span>Stop</span>
                </button>
                <button
                  onClick={resetRoute}
                  className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>
          
          {isNavigating && (
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Current Task: {currentTaskIndex + 1} of {optimizedRoute.length}
              </p>
              <p className="text-xs text-gray-500">
                Progress: {Math.round(((currentTaskIndex + 1) / optimizedRoute.length) * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Route Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h3>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 flex items-center justify-center relative">
            {/* Mock map with route points */}
            <div className="absolute inset-0 p-4">
              {optimizedRoute.map((point, index) => (
                <div
                  key={point.id}
                  className={`absolute w-4 h-4 rounded-full border-2 ${
                    index === currentTaskIndex && isNavigating
                      ? 'bg-red-500 border-red-700 animate-pulse'
                      : index < currentTaskIndex
                      ? 'bg-green-500 border-green-700'
                      : 'bg-blue-500 border-blue-700'
                  }`}
                  style={{
                    left: `${20 + (index * 60) % 80}%`,
                    top: `${30 + (index * 40) % 60}%`
                  }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    {index + 1}
                  </div>
                </div>
              ))}
              
              {/* Route lines */}
              {optimizedRoute.length > 1 && (
                <svg className="absolute inset-0 w-full h-full">
                  {optimizedRoute.slice(0, -1).map((_, index) => (
                    <line
                      key={index}
                      x1={`${20 + (index * 60) % 80}%`}
                      y1={`${30 + (index * 40) % 60}%`}
                      x2={`${20 + ((index + 1) * 60) % 80}%`}
                      y2={`${30 + ((index + 1) * 40) % 60}%`}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  ))}
                </svg>
              )}
            </div>
            
            <div className="text-center z-10">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Interactive Route Map</h3>
                <p className="text-gray-600 text-sm">
                  {isNavigating 
                    ? `Navigating to: ${optimizedRoute[currentTaskIndex]?.address || 'Unknown'}`
                    : 'Click "Start Navigation" to begin'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Route List */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {optimizedRoute.map((point, index) => (
              <div
                key={point.id}
                className={`p-4 rounded-lg border transition-all ${
                  index === currentTaskIndex && isNavigating
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : index < currentTaskIndex
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentTaskIndex && isNavigating
                        ? 'bg-blue-600 text-white'
                        : index < currentTaskIndex
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{point.address}</h4>
                      <p className="text-sm text-gray-600">{point.wasteType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(point.status)}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(point.priority)}`}>
                      P{point.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      {point.estimatedTime}m
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {isNavigating && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={previousTask}
                  disabled={currentTaskIndex === 0}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  <Navigation className="h-4 w-4 rotate-180" />
                  <span>Previous</span>
                </button>
                
                <span className="text-sm text-gray-600">
                  {currentTaskIndex + 1} of {optimizedRoute.length}
                </span>
                
                <button
                  onClick={nextTask}
                  disabled={currentTaskIndex === optimizedRoute.length - 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
