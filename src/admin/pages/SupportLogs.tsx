import React, { useState, useEffect } from 'react';
import { 
  HeadphonesIcon, 
  Search, 
  Download, 
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
  Building2
} from 'lucide-react';

interface SupportTicket {
  id: string;
  gymId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  gym: {
    name: string;
    email: string;
  };
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  userType: string;
  userId: string;
  createdAt: string;
  gym?: {
    name: string;
  };
}

const SupportLogs: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'logs'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
    fetchLogs();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Mock data for demo
      setTickets([
        {
          id: '1',
          gymId: '1',
          title: 'Payment gateway not working',
          description: 'Unable to process member payments through the system',
          status: 'open',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          gym: { name: 'FitZone Premium', email: 'admin@fitzone.com' }
        },
        {
          id: '2',
          gymId: '2',
          title: 'Member registration issue',
          description: 'New members cannot complete registration process',
          status: 'in_progress',
          priority: 'medium',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          gym: { name: 'PowerHouse Gym', email: 'admin@powerhouse.com' }
        },
        {
          id: '3',
          gymId: '3',
          title: 'Class schedule sync problem',
          description: 'Class schedules not updating properly in the app',
          status: 'resolved',
          priority: 'low',
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          gym: { name: 'Zen Fitness Studio', email: 'hello@zenfitness.com' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Mock data for demo
      setLogs([
        {
          id: '1',
          action: 'CREATE_GYM',
          details: 'Created new gym: FitZone Premium',
          userType: 'admin',
          userId: 'admin',
          createdAt: new Date().toISOString(),
          gym: { name: 'FitZone Premium' }
        },
        {
          id: '2',
          action: 'UPDATE_BILLING',
          details: 'Updated billing information for PowerHouse Gym',
          userType: 'admin',
          userId: 'admin',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          gym: { name: 'PowerHouse Gym' }
        },
        {
          id: '3',
          action: 'MEMBER_SIGNUP',
          details: 'New member registered: John Doe',
          userType: 'gym_owner',
          userId: 'gym_1',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          gym: { name: 'FitZone Premium' }
        }
      ]);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/support/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
            : ticket
        ));
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const exportLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activity-logs.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.gym.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.gym?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Support & Logs</h2>
          <p className="text-gray-400">Manage support tickets and view system activity</p>
        </div>
        <button
          onClick={exportLogs}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'tickets'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <HeadphonesIcon className="h-5 w-5" />
          <span>Support Tickets</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'logs'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Activity Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        {activeTab === 'tickets' && (
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </>
        )}
      </div>

      {/* Content */}
      {activeTab === 'tickets' ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Ticket</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Gym</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Priority</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Created</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{ticket.title}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-300">{ticket.gym.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(ticket.status)}
                        <span className="text-gray-300 capitalize">{ticket.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value)}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg mt-1">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-medium">{log.action.replace('_', ' ')}</h3>
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                        {log.userType.replace('_', ' ')}
                      </span>
                      {log.gym && (
                        <span className="text-cyan-400 text-sm">{log.gym.name}</span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-2">{log.details}</p>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportLogs;