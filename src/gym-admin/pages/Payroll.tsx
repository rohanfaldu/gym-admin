import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Send
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  employeeId: string;
  hourlyRate: number;
  salary?: number;
  payType: 'hourly' | 'salary';
  isActive: boolean;
}

interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  hoursWorked: number;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  payDate?: string;
}

const Payroll: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'staff' | 'payroll'>('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    position: 'Personal Trainer',
    employeeId: '',
    hourlyRate: '15',
    salary: '',
    payType: 'hourly' as const,
    isActive: true
  });

  const [payrollFormData, setPayrollFormData] = useState({
    staffId: '',
    payPeriodStart: '',
    payPeriodEnd: '',
    hoursWorked: '40',
    deductions: '0'
  });

  const positions = [
    'Personal Trainer',
    'Front Desk',
    'Manager',
    'Maintenance',
    'Cleaner',
    'Instructor',
    'Sales Representative'
  ];

  useEffect(() => {
    // Mock data for demo
    setStaff([
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex@fitzone.com',
        position: 'Personal Trainer',
        employeeId: 'EMP001',
        hourlyRate: 25,
        payType: 'hourly',
        isActive: true
      },
      {
        id: '2',
        name: 'Lisa Rodriguez',
        email: 'lisa@fitzone.com',
        position: 'Front Desk',
        employeeId: 'EMP002',
        hourlyRate: 15,
        payType: 'hourly',
        isActive: true
      },
      {
        id: '3',
        name: 'David Kim',
        email: 'david@fitzone.com',
        position: 'Manager',
        employeeId: 'EMP003',
        salary: 4500,
        payType: 'salary',
        hourlyRate: 0,
        isActive: true
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        email: 'sarah@fitzone.com',
        position: 'Instructor',
        employeeId: 'EMP004',
        hourlyRate: 30,
        payType: 'hourly',
        isActive: true
      },
      {
        id: '5',
        name: 'Mike Wilson',
        email: 'mike@fitzone.com',
        position: 'Maintenance',
        employeeId: 'EMP005',
        hourlyRate: 18,
        payType: 'hourly',
        isActive: false
      }
    ]);

    setPayrollRecords([
      {
        id: '1',
        staffId: '1',
        staffName: 'Alex Thompson',
        position: 'Personal Trainer',
        payPeriodStart: '2024-01-01',
        payPeriodEnd: '2024-01-15',
        hoursWorked: 80,
        regularHours: 80,
        overtimeHours: 0,
        grossPay: 2000,
        deductions: 200,
        netPay: 1800,
        status: 'paid',
        payDate: '2024-01-16'
      },
      {
        id: '2',
        staffId: '2',
        staffName: 'Lisa Rodriguez',
        position: 'Front Desk',
        payPeriodStart: '2024-01-01',
        payPeriodEnd: '2024-01-15',
        hoursWorked: 80,
        regularHours: 80,
        overtimeHours: 0,
        grossPay: 1200,
        deductions: 120,
        netPay: 1080,
        status: 'paid',
        payDate: '2024-01-16'
      },
      {
        id: '3',
        staffId: '3',
        staffName: 'David Kim',
        position: 'Manager',
        payPeriodStart: '2024-01-01',
        payPeriodEnd: '2024-01-31',
        hoursWorked: 160,
        regularHours: 160,
        overtimeHours: 0,
        grossPay: 4500,
        deductions: 450,
        netPay: 4050,
        status: 'processed'
      },
      {
        id: '4',
        staffId: '4',
        staffName: 'Sarah Johnson',
        position: 'Instructor',
        payPeriodStart: '2024-01-16',
        payPeriodEnd: '2024-01-31',
        hoursWorked: 60,
        regularHours: 60,
        overtimeHours: 0,
        grossPay: 1800,
        deductions: 180,
        netPay: 1620,
        status: 'draft'
      }
    ]);

    setLoading(false);
  }, []);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: staffFormData.name,
      email: staffFormData.email,
      position: staffFormData.position,
      employeeId: staffFormData.employeeId,
      hourlyRate: staffFormData.payType === 'hourly' ? parseFloat(staffFormData.hourlyRate) : 0,
      salary: staffFormData.payType === 'salary' ? parseFloat(staffFormData.salary) : undefined,
      payType: staffFormData.payType,
      isActive: staffFormData.isActive
    };
    
    setStaff(prev => [newStaff, ...prev]);
    setShowAddStaffModal(false);
    resetStaffForm();
  };

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const updatedStaff: Staff = {
      ...editingStaff,
      name: staffFormData.name,
      email: staffFormData.email,
      position: staffFormData.position,
      employeeId: staffFormData.employeeId,
      hourlyRate: staffFormData.payType === 'hourly' ? parseFloat(staffFormData.hourlyRate) : 0,
      salary: staffFormData.payType === 'salary' ? parseFloat(staffFormData.salary) : undefined,
      payType: staffFormData.payType,
      isActive: staffFormData.isActive
    };
    
    setStaff(prev => prev.map(s => s.id === editingStaff.id ? updatedStaff : s));
    setEditingStaff(null);
    resetStaffForm();
  };

  const handleGeneratePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStaff = staff.find(s => s.id === payrollFormData.staffId);
    if (!selectedStaff) return;

    const hoursWorked = parseFloat(payrollFormData.hoursWorked);
    const regularHours = Math.min(hoursWorked, 40);
    const overtimeHours = Math.max(hoursWorked - 40, 0);
    
    let grossPay = 0;
    if (selectedStaff.payType === 'hourly') {
      grossPay = (regularHours * selectedStaff.hourlyRate) + (overtimeHours * selectedStaff.hourlyRate * 1.5);
    } else {
      grossPay = selectedStaff.salary || 0;
    }

    const deductions = parseFloat(payrollFormData.deductions);
    const netPay = grossPay - deductions;

    const newPayroll: PayrollRecord = {
      id: Date.now().toString(),
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      position: selectedStaff.position,
      payPeriodStart: payrollFormData.payPeriodStart,
      payPeriodEnd: payrollFormData.payPeriodEnd,
      hoursWorked,
      regularHours,
      overtimeHours,
      grossPay,
      deductions,
      netPay,
      status: 'draft'
    };
    
    setPayrollRecords(prev => [newPayroll, ...prev]);
    setShowPayrollModal(false);
    resetPayrollForm();
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  const handlePayrollStatusChange = (id: string, status: 'draft' | 'processed' | 'paid') => {
    setPayrollRecords(prev => prev.map(record => 
      record.id === id ? { 
        ...record, 
        status, 
        payDate: status === 'paid' ? new Date().toISOString().split('T')[0] : record.payDate 
      } : record
    ));
  };

  const resetStaffForm = () => {
    setStaffFormData({
      name: '',
      email: '',
      position: 'Personal Trainer',
      employeeId: '',
      hourlyRate: '15',
      salary: '',
      payType: 'hourly',
      isActive: true
    });
  };

  const resetPayrollForm = () => {
    setPayrollFormData({
      staffId: '',
      payPeriodStart: '',
      payPeriodEnd: '',
      hoursWorked: '40',
      deductions: '0'
    });
  };

  const startEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setStaffFormData({
      name: staffMember.name,
      email: staffMember.email,
      position: staffMember.position,
      employeeId: staffMember.employeeId,
      hourlyRate: staffMember.hourlyRate.toString(),
      salary: staffMember.salary?.toString() || '',
      payType: staffMember.payType,
      isActive: staffMember.isActive
    });
  };

  const downloadPayslip = (payroll: PayrollRecord) => {
    const content = `
PAYSLIP
Employee: ${payroll.staffName}
Position: ${payroll.position}
Pay Period: ${payroll.payPeriodStart} to ${payroll.payPeriodEnd}

Hours Worked: ${payroll.hoursWorked}
Regular Hours: ${payroll.regularHours}
Overtime Hours: ${payroll.overtimeHours}

Gross Pay: $${payroll.grossPay.toFixed(2)}
Deductions: $${payroll.deductions.toFixed(2)}
Net Pay: $${payroll.netPay.toFixed(2)}
    `;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `payslip-${payroll.staffName.replace(' ', '-')}-${payroll.payPeriodEnd}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'processed':
        return 'text-blue-400 bg-blue-500/20';
      case 'paid':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayroll = payrollRecords.filter(p =>
    p.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalStaff: staff.filter(s => s.isActive).length,
    totalPayroll: payrollRecords.reduce((sum, p) => sum + p.netPay, 0),
    pendingPayroll: payrollRecords.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.netPay, 0),
    avgSalary: staff.length > 0 ? payrollRecords.reduce((sum, p) => sum + p.netPay, 0) / payrollRecords.length : 0
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
          <h2 className="text-2xl font-bold text-white">Payroll Management</h2>
          <p className="text-gray-400">Manage staff and payroll processing</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'staff' && (
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Staff</span>
            </button>
          )}
          {activeTab === 'payroll' && (
            <button
              onClick={() => setShowPayrollModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Generate Payroll</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Staff</p>
              <p className="text-2xl font-bold text-white">{stats.totalStaff}</p>
            </div>
            <UserCheck className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Payroll</p>
              <p className="text-2xl font-bold text-green-400">${stats.totalPayroll.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">${stats.pendingPayroll.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Pay</p>
              <p className="text-2xl font-bold text-cyan-400">${stats.avgSalary.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'staff'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <UserCheck className="h-5 w-5" />
          <span>Staff Management</span>
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'payroll'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <DollarSign className="h-5 w-5" />
          <span>Payroll Records</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Content */}
      {activeTab === 'staff' ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Employee</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Position</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Employee ID</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Pay Rate</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStaff.map((staffMember) => (
                  <tr key={staffMember.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-sm">{staffMember.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{staffMember.name}</p>
                          <p className="text-gray-400 text-sm">{staffMember.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="bg-gray-800 border border-purple-500/30 px-3 py-1 rounded-full text-purple-400 text-sm inline-block">
                        {staffMember.position}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300 font-mono">{staffMember.employeeId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        {staffMember.payType === 'hourly' ? (
                          <p className="text-white font-bold">${staffMember.hourlyRate}/hr</p>
                        ) : (
                          <p className="text-white font-bold">${staffMember.salary?.toLocaleString()}/month</p>
                        )}
                        <p className="text-gray-400 text-sm capitalize">{staffMember.payType}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        staffMember.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {staffMember.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditStaff(staffMember)}
                          className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember.id)}
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
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Employee</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Pay Period</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Hours</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Gross Pay</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Net Pay</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPayroll.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{payroll.staffName}</p>
                        <p className="text-gray-400 text-sm">{payroll.position}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300">
                        <p>{new Date(payroll.payPeriodStart).toLocaleDateString()}</p>
                        <p className="text-sm">to {new Date(payroll.payPeriodEnd).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300">
                        <p>{payroll.hoursWorked}h total</p>
                        {payroll.overtimeHours > 0 && (
                          <p className="text-sm text-yellow-400">{payroll.overtimeHours}h overtime</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-bold">${payroll.grossPay.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-green-400 font-bold">${payroll.netPay.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={payroll.status}
                        onChange={(e) => handlePayrollStatusChange(payroll.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(payroll.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="processed">Processed</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPayroll(payroll);
                            setShowPayslipModal(true);
                          }}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200"
                          title="View Payslip"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadPayslip(payroll)}
                          className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                          title="Download Payslip"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                          title="Send Payslip"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      {(showAddStaffModal || editingStaff) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
            </div>
            
            <form onSubmit={editingStaff ? handleEditStaff : handleAddStaff} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={staffFormData.name}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <select
                    value={staffFormData.position}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={staffFormData.employeeId}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pay Type</label>
                  <select
                    value={staffFormData.payType}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, payType: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="salary">Salary</option>
                  </select>
                </div>
                
                {staffFormData.payType === 'hourly' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={staffFormData.hourlyRate}
                      onChange={(e) => setStaffFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Salary ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={staffFormData.salary}
                      onChange={(e) => setStaffFormData(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={staffFormData.isActive}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Active Employee</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStaffModal(false);
                    setEditingStaff(null);
                    resetStaffForm();
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Payroll Modal */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Generate Payroll</h3>
            </div>
            
            <form onSubmit={handleGeneratePayroll} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Staff</label>
                <select
                  value={payrollFormData.staffId}
                  onChange={(e) => setPayrollFormData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Choose Staff Member</option>
                  {staff.filter(s => s.isActive).map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.position}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pay Period Start</label>
                  <input
                    type="date"
                    value={payrollFormData.payPeriodStart}
                    onChange={(e) => setPayrollFormData(prev => ({ ...prev, payPeriodStart: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pay Period End</label>
                  <input
                    type="date"
                    value={payrollFormData.payPeriodEnd}
                    onChange={(e) => setPayrollFormData(prev => ({ ...prev, payPeriodEnd: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hours Worked</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={payrollFormData.hoursWorked}
                  onChange={(e) => setPayrollFormData(prev => ({ ...prev, hoursWorked: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deductions ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={payrollFormData.deductions}
                  onChange={(e) => setPayrollFormData(prev => ({ ...prev, deductions: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayrollModal(false);
                    resetPayrollForm();
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                  Generate Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showPayslipModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Payslip Details</h3>
              <button
                onClick={() => setShowPayslipModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Employee Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Name:</p>
                    <p className="text-white font-medium">{selectedPayroll.staffName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Position:</p>
                    <p className="text-white font-medium">{selectedPayroll.position}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Pay Period:</p>
                    <p className="text-white font-medium">
                      {new Date(selectedPayroll.payPeriodStart).toLocaleDateString()} - {new Date(selectedPayroll.payPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(selectedPayroll.status)}`}>
                      {selectedPayroll.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-4">Hours & Earnings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Regular Hours:</span>
                      <span className="text-white">{selectedPayroll.regularHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Overtime Hours:</span>
                      <span className="text-white">{selectedPayroll.overtimeHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Hours:</span>
                      <span className="text-white font-bold">{selectedPayroll.hoursWorked}h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-4">Payment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gross Pay:</span>
                      <span className="text-white">${selectedPayroll.grossPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deductions:</span>
                      <span className="text-red-400">-${selectedPayroll.deductions.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Net Pay:</span>
                        <span className="text-green-400 font-bold text-lg">${selectedPayroll.netPay.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => downloadPayslip(selectedPayroll)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send to Employee</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;