import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock,
  Users,
  UserCheck,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  memberName: string;
  memberEmail: string;
  memberId: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
  duration?: number; // in minutes
  type: 'member' | 'staff';
  status: 'checked_in' | 'checked_out';
}

interface StaffAttendance {
  id: string;
  staffName: string;
  staffId: string;
  position: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
  duration?: number;
  status: 'checked_in' | 'checked_out';
}

const AttendanceLogs: React.FC = () => {
  const [memberAttendance, setMemberAttendance] = useState<AttendanceRecord[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'staff'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEntry, setNewEntry] = useState({
    memberName: '',
    memberEmail: '',
    checkInTime: new Date().toTimeString().slice(0, 5),
    type: 'member' as const
  });

  useEffect(() => {
    // Mock data for demo
    setMemberAttendance([
      {
        id: '1',
        memberName: 'John Doe',
        memberEmail: 'john@example.com',
        memberId: 'M001',
        checkInTime: '08:30',
        checkOutTime: '10:15',
        date: new Date().toISOString().split('T')[0],
        duration: 105,
        type: 'member',
        status: 'checked_out'
      },
      {
        id: '2',
        memberName: 'Sarah Wilson',
        memberEmail: 'sarah@example.com',
        memberId: 'M002',
        checkInTime: '09:15',
        date: new Date().toISOString().split('T')[0],
        type: 'member',
        status: 'checked_in'
      },
      {
        id: '3',
        memberName: 'Mike Johnson',
        memberEmail: 'mike@example.com',
        memberId: 'M003',
        checkInTime: '07:45',
        checkOutTime: '09:30',
        date: new Date().toISOString().split('T')[0],
        duration: 105,
        type: 'member',
        status: 'checked_out'
      },
      {
        id: '4',
        memberName: 'Emma Davis',
        memberEmail: 'emma@example.com',
        memberId: 'M004',
        checkInTime: '18:00',
        date: new Date().toISOString().split('T')[0],
        type: 'member',
        status: 'checked_in'
      }
    ]);

    setStaffAttendance([
      {
        id: '1',
        staffName: 'Alex Thompson',
        staffId: 'S001',
        position: 'Personal Trainer',
        checkInTime: '06:00',
        checkOutTime: '14:00',
        date: new Date().toISOString().split('T')[0],
        duration: 480,
        status: 'checked_out'
      },
      {
        id: '2',
        staffName: 'Lisa Rodriguez',
        staffId: 'S002',
        position: 'Front Desk',
        checkInTime: '08:00',
        date: new Date().toISOString().split('T')[0],
        status: 'checked_in'
      },
      {
        id: '3',
        staffName: 'David Kim',
        staffId: 'S003',
        position: 'Maintenance',
        checkInTime: '07:30',
        checkOutTime: '15:30',
        date: new Date().toISOString().split('T')[0],
        duration: 480,
        status: 'checked_out'
      }
    ]);

    setLoading(false);
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: AttendanceRecord = {
      id: Date.now().toString(),
      memberName: newEntry.memberName,
      memberEmail: newEntry.memberEmail,
      memberId: `M${Date.now().toString().slice(-3)}`,
      checkInTime: newEntry.checkInTime,
      date: selectedDate,
      type: newEntry.type,
      status: 'checked_in'
    };
    
    setMemberAttendance(prev => [entry, ...prev]);
    setShowAddModal(false);
    setNewEntry({
      memberName: '',
      memberEmail: '',
      checkInTime: new Date().toTimeString().slice(0, 5),
      type: 'member'
    });
  };

  const handleCheckOut = (id: string, type: 'member' | 'staff') => {
    const currentTime = new Date().toTimeString().slice(0, 5);
    
    if (type === 'member') {
      setMemberAttendance(prev => prev.map(record => {
        if (record.id === id) {
          const checkInTime = new Date(`2000-01-01 ${record.checkInTime}`);
          const checkOutTime = new Date(`2000-01-01 ${currentTime}`);
          const duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));
          
          return {
            ...record,
            checkOutTime: currentTime,
            duration,
            status: 'checked_out' as const
          };
        }
        return record;
      }));
    } else {
      setStaffAttendance(prev => prev.map(record => {
        if (record.id === id) {
          const checkInTime = new Date(`2000-01-01 ${record.checkInTime}`);
          const checkOutTime = new Date(`2000-01-01 ${currentTime}`);
          const duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));
          
          return {
            ...record,
            checkOutTime: currentTime,
            duration,
            status: 'checked_out' as const
          };
        }
        return record;
      }));
    }
  };

  const handleDeleteEntry = (id: string, type: 'member' | 'staff') => {
    if (confirm('Are you sure you want to delete this entry?')) {
      if (type === 'member') {
        setMemberAttendance(prev => prev.filter(record => record.id !== id));
      } else {
        setStaffAttendance(prev => prev.filter(record => record.id !== id));
      }
    }
  };

  const exportAttendance = () => {
    const data = activeTab === 'members' ? memberAttendance : staffAttendance;
    const csvContent = [
      ['Name', 'Check In', 'Check Out', 'Duration (min)', 'Date', 'Status'].join(','),
      ...data.map(record => [
        activeTab === 'members' ? record.memberName : (record as StaffAttendance).staffName,
        record.checkInTime,
        record.checkOutTime || '-',
        record.duration || '-',
        record.date,
        record.status
      ].join(','))
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTab}-attendance-${selectedDate}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredMemberAttendance = memberAttendance.filter(record => {
    const matchesSearch = record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const filteredStaffAttendance = staffAttendance.filter(record => {
    const matchesSearch = record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const memberStats = {
    totalCheckedIn: memberAttendance.filter(r => r.date === selectedDate && r.status === 'checked_in').length,
    totalCheckedOut: memberAttendance.filter(r => r.date === selectedDate && r.status === 'checked_out').length,
    averageDuration: memberAttendance.filter(r => r.date === selectedDate && r.duration).reduce((sum, r) => sum + (r.duration || 0), 0) / memberAttendance.filter(r => r.date === selectedDate && r.duration).length || 0
  };

  const staffStats = {
    totalPresent: staffAttendance.filter(r => r.date === selectedDate).length,
    totalCheckedIn: staffAttendance.filter(r => r.date === selectedDate && r.status === 'checked_in').length,
    totalHours: staffAttendance.filter(r => r.date === selectedDate && r.duration).reduce((sum, r) => sum + (r.duration || 0), 0) / 60
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Attendance Logs</h2>
          <p className="text-gray-400">Track member and staff attendance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportAttendance}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTab === 'members' ? (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Currently In</p>
                  <p className="text-2xl font-bold text-green-400">{memberStats.totalCheckedIn}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Checked Out</p>
                  <p className="text-2xl font-bold text-cyan-400">{memberStats.totalCheckedOut}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-cyan-400" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Duration</p>
                  <p className="text-2xl font-bold text-purple-400">{formatDuration(memberStats.averageDuration)}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Visits</p>
                  <p className="text-2xl font-bold text-yellow-400">{memberStats.totalCheckedIn + memberStats.totalCheckedOut}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Present Today</p>
                  <p className="text-2xl font-bold text-green-400">{staffStats.totalPresent}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Currently In</p>
                  <p className="text-2xl font-bold text-cyan-400">{staffStats.totalCheckedIn}</p>
                </div>
                <UserCheck className="h-8 w-8 text-cyan-400" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Hours</p>
                  <p className="text-2xl font-bold text-purple-400">{staffStats.totalHours.toFixed(1)}h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Hours/Staff</p>
                  <p className="text-2xl font-bold text-yellow-400">{staffStats.totalPresent > 0 ? (staffStats.totalHours / staffStats.totalPresent).toFixed(1) : '0'}h</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'members'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Member Attendance</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'staff'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <UserCheck className="h-5 w-5" />
          <span>Staff Attendance</span>
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
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  {activeTab === 'members' ? 'Member' : 'Staff'}
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Check In</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Check Out</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Duration</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {(activeTab === 'members' ? filteredMemberAttendance : filteredStaffAttendance).map((record) => (
                <tr key={record.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">
                          {(activeTab === 'members' ? record.memberName : (record as StaffAttendance).staffName).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {activeTab === 'members' ? record.memberName : (record as StaffAttendance).staffName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {activeTab === 'members' ? record.memberEmail : (record as StaffAttendance).position}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{record.checkInTime}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{record.checkOutTime || '-'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{formatDuration(record.duration)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      record.status === 'checked_in' 
                        ? 'text-green-400 bg-green-500/20' 
                        : 'text-cyan-400 bg-cyan-500/20'
                    }`}>
                      {record.status === 'checked_in' ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span className="capitalize">{record.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {record.status === 'checked_in' && (
                        <button
                          onClick={() => handleCheckOut(record.id, activeTab === 'members' ? 'member' : 'staff')}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200"
                          title="Check Out"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(record.id, activeTab === 'members' ? 'member' : 'staff')}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Manual Attendance Entry</h3>
            </div>
            
            <form onSubmit={handleAddEntry} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Name</label>
                <input
                  type="text"
                  value={newEntry.memberName}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, memberName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newEntry.memberEmail}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, memberEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Check In Time</label>
                <input
                  type="time"
                  value={newEntry.checkInTime}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, checkInTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceLogs;