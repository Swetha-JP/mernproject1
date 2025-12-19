import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../utils/api';
import { 
  Users, 
  Search, 
  Filter,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Ban,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  const [refreshing, setRefreshing] = useState(false);

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra',
      joinDate: '2023-06-15',
      status: 'active',
      totalRecharges: 25,
      totalSpent: 4750,
      lastRecharge: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211',
      address: 'Delhi, Delhi',
      joinDate: '2023-07-20',
      status: 'active',
      totalRecharges: 18,
      totalSpent: 3200,
      lastRecharge: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+91 9876543212',
      address: 'Bangalore, Karnataka',
      joinDate: '2023-08-10',
      status: 'inactive',
      totalRecharges: 12,
      totalSpent: 2100,
      lastRecharge: '2023-12-20'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+91 9876543213',
      address: 'Chennai, Tamil Nadu',
      joinDate: '2023-09-05',
      status: 'blocked',
      totalRecharges: 8,
      totalSpent: 1500,
      lastRecharge: '2023-11-15'
    }
  ];

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await userAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to mock data if API fails
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchUsers(true), 60000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'var(--success)';
      case 'inactive':
        return 'var(--warning)';
      case 'blocked':
        return 'var(--error)';
      default:
        return 'var(--gray-medium)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'inactive':
        return <Calendar size={16} />;
      case 'blocked':
        return <Ban size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case 'edit':
        // Handle edit user
        console.log('Edit user:', user);
        break;
      case 'block':
        // Handle block/unblock user
        const updatedUsers = users.map(u =>
          u.id === user.id
            ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' }
            : u
        );
        setUsers(updatedUsers);
        break;
      case 'delete':
        // Handle delete user
        if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== user.id));
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="user-management">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
              User Management
            </h1>
            <p style={{ color: 'var(--gray-medium)' }}>
              Manage and monitor all registered users
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchUsers(true)}
              className="btn btn-secondary"
              disabled={refreshing}
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddUserModal(true)}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
            >
              <UserPlus size={20} />
              Add New User
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { title: 'Total Users', value: users.length, color: 'var(--teal-primary)' },
            { title: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'var(--success)' },
            { title: 'Inactive Users', value: users.filter(u => u.status === 'inactive').length, color: 'var(--warning)' },
            { title: 'Blocked Users', value: users.filter(u => u.status === 'blocked').length, color: 'var(--error)' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                textAlign: 'center',
                background: `${stat.color}15`,
                border: `2px solid ${stat.color}30`
              }}
            >
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: stat.color,
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--gray-medium)' }}>
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--teal-primary)' }}>
              <Filter />
            </div>
            <h3>Filter Users</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            {/* Search */}
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--gray-medium)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="form-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--peach-primary)' }}>
              <Users />
            </div>
            <h3>Users List ({filteredUsers.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--peach-light)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>User</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Contact</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Activity</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ borderBottom: '1px solid var(--peach-light)' }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                            Joined {formatDate(user.joinDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <Mail size={14} color="var(--gray-medium)" />
                          {user.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <Phone size={14} color="var(--gray-medium)" />
                          {user.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={14} color="var(--gray-medium)" />
                          {user.address}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        background: `${getStatusColor(user.status)}20`,
                        color: getStatusColor(user.status),
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                          {user.totalRecharges} recharges
                        </div>
                        <div style={{ color: 'var(--gray-medium)' }}>
                          ₹{user.totalSpent} spent
                        </div>
                        <div style={{ color: 'var(--gray-medium)' }}>
                          Last: {formatDate(user.lastRecharge)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserAction('view', user)}
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--teal-primary)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserAction('edit', user)}
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--peach-primary)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit3 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserAction('block', user)}
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '8px',
                            border: 'none',
                            background: user.status === 'blocked' ? 'var(--success)' : 'var(--warning)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Ban size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserAction('delete', user)}
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--error)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--gray-medium)'
            }}>
              <Users size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3>User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--gray-medium)'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem'
                }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <h4>{selectedUser.name}</h4>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  background: `${getStatusColor(selectedUser.status)}20`,
                  color: getStatusColor(selectedUser.status),
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {getStatusIcon(selectedUser.status)}
                  {selectedUser.status}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedUser.phone}
                </div>
                <div>
                  <strong>Address:</strong> {selectedUser.address}
                </div>
                <div>
                  <strong>Join Date:</strong> {formatDate(selectedUser.joinDate)}
                </div>
                <div>
                  <strong>Total Recharges:</strong> {selectedUser.totalRecharges}
                </div>
                <div>
                  <strong>Total Spent:</strong> ₹{selectedUser.totalSpent}
                </div>
                <div>
                  <strong>Last Recharge:</strong> {formatDate(selectedUser.lastRecharge)}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3>Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--gray-medium)'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const newId = Math.max(...users.map(u => u.id)) + 1;
                const userToAdd = {
                  ...newUser,
                  id: newId,
                  joinDate: new Date().toISOString().split('T')[0],
                  totalRecharges: 0,
                  totalSpent: 0,
                  lastRecharge: null
                };
                setUsers([...users, userToAdd]);
                setNewUser({ name: '', email: '', phone: '', address: '', status: 'active' });
                setShowAddUserModal(false);
              }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={newUser.address}
                    onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
                  >
                    Add User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserManagement;