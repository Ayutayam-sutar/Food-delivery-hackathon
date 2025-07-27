import React, { useState } from 'react';
import { Bell, Clock, CheckCircle, XCircle, User, Package, Users, AlertCircle } from 'lucide-react';

interface User {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  avatar?: string;
}

interface Request {
  id: string;
  type: 'inventory' | 'supplier' | 'surplus';
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  quantity?: number;
  price?: number;
}

interface AppState {
  user: User | null;
  isDemo?: boolean;
  requests: Request[];
}

interface RequestsPageProps {
  state: AppState;
  onUpdateRequestStatus: (id: string, status: Request['status']) => void;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({ state, onUpdateRequestStatus }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const filteredRequests = state.requests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const getRequestIcon = (type: Request['type']) => {
    switch (type) {
      case 'inventory':
        return <Package className="h-5 w-5" />;
      case 'supplier':
        return <Users className="h-5 w-5" />;
      case 'surplus':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: Request['type']) => {
    switch (type) {
      case 'inventory':
        return 'bg-orange-100 text-orange-800';
      case 'supplier':
        return 'bg-blue-100 text-blue-800';
      case 'surplus':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canManageRequest = (request: Request) => {
    return request.type !== 'supplier';
  };

  const handleStatusUpdate = (id: string, status: Request['status']) => {
    onUpdateRequestStatus(id, status);
    setSelectedRequest(null);
    
    setTimeout(() => {
      const message = status === 'accepted' 
        ? '🎉 Request accepted! The process will begin shortly.'
        : status === 'rejected'
        ? '❌ Request rejected.'
        : status === 'completed'
        ? '✅ Request completed successfully!'
        : '✅ Request status updated.';
      alert(message);
    }, 100);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="h-8 w-8 mr-3 text-orange-500 notification-bell" />
              Requests & Notifications
            </h1>
            <p className="text-gray-600 mt-2">Manage your incoming requests and notifications</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">
                  {state.requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-xl font-bold">
                  {state.requests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-xl font-bold">
                  {state.requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{state.requests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You don't have any requests yet." 
                  : `No ${filter} requests found.`}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(request.type)}`}>
                      {getRequestIcon(request.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        {request.type === 'supplier' && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-200">
                            Info Only
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(request.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span className="capitalize">{request.type} Request</span>
                        </div>
                        {request.quantity && (
                          <div>
                            <span className="font-medium">Qty: {request.quantity}</span>
                          </div>
                        )}
                        {request.price && (
                          <div>
                            <span className="font-medium">₹{request.price}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && canManageRequest(request) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(request.id, 'accepted');
                        }}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-300 flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(request.id, 'rejected');
                        }}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-300 flex items-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(request.id, 'completed');
                      }}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-300 flex items-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark Complete</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(selectedRequest.type)}`}>
                    {getRequestIcon(selectedRequest.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedRequest.title}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                      {selectedRequest.type === 'supplier' && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-200">
                          Notification Only
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedRequest.description}</p>
                </div>

                {selectedRequest.type === 'supplier' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> This is a supplier notification for informational purposes only. 
                      No action is required from your side.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Type</h4>
                    <p className="text-gray-600 capitalize">{selectedRequest.type} Request</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Created</h4>
                    <p className="text-gray-600">{formatTimeAgo(selectedRequest.createdAt)}</p>
                  </div>
                </div>

                {(selectedRequest.quantity || selectedRequest.price) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedRequest.quantity && (
                      <div>
                        <h4 className="font-medium text-gray-900">Quantity</h4>
                        <p className="text-gray-600">{selectedRequest.quantity}</p>
                      </div>
                    )}
                    {selectedRequest.price && (
                      <div>
                        <h4 className="font-medium text-gray-900">Price</h4>
                        <p className="text-gray-600">₹{selectedRequest.price}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && canManageRequest(selectedRequest) ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                    className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg hover:bg-red-200 transition-colors duration-300"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'accepted')}
                    className="flex-1 bg-green-100 text-green-700 py-3 rounded-lg hover:bg-green-200 transition-colors duration-300"
                  >
                    Accept Request
                  </button>
                </div>
              ) : selectedRequest.status === 'accepted' ? (
                <button
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                  className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                >
                  Mark as Complete
                </button>
              ) : (
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};