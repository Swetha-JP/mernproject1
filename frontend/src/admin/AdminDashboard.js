import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { transactionAPI, userAPI } from '../utils/api';
import { 
  Users, 
  Smartphone, 
  DollarSign, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [transactionsRes, usersRes] = await Promise.all([
        transactionAPI.getAllTransactions({ limit: 5 }),
        userAPI.getUsers({ limit: 100 })
      ]);

      if (transactionsRes.data.success) {
        const transactions = transactionsRes.data.transactions;
        setRecentTransactions(transactions.slice(0, 5));
        
        const totalTransactions = transactions.length;
        const successfulTransactions = transactions.filter(t => t.status === 'success');
        const pendingTransactions = transactions.filter(t => t.status === 'pending');
        const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        const today = new Date().toDateString();
        const todayTransactions = transactions.filter(t => 
          new Date(t.createdAt).toDateString() === today
        );
        const todayRevenue = todayTransactions
          .filter(t => t.status === 'success')
          .reduce((sum, t) => sum + t.amount, 0);

        setStats({
          totalUsers: usersRes.data.success ? usersRes.data.users.length : 0,
          totalRecharges: totalTransactions,
          totalRevenue: totalRevenue,
          successRate: totalTransactions > 0 ? ((successfulTransactions.length / totalTransactions) * 100).toFixed(1) : 0,
          todayRecharges: todayTransactions.length,
          todayRevenue: todayRevenue,
          activeUsers: usersRes.data.success ? usersRes.data.users.filter(u => u.status === 'active').length : 0,
          pendingTransactions: pendingTransactions.length
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers?.toLocaleString(),
      icon: <Users />,
      color: 'var(--teal-primary)',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Recharges',
      value: stats.totalRecharges?.toLocaleString(),
      icon: <Smartphone />,
      color: 'var(--peach-primary)',
      change: '+8.3%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 100000)?.toFixed(1)}L`,
      icon: <DollarSign />,
      color: 'var(--success)',
      change: '+15.2%',
      changeType: 'positive'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: <TrendingUp />,
      color: 'var(--teal-dark)',
      change: '+0.5%',
      changeType: 'positive'
    }
  ];

  const todayStats = [
    {
      title: "Today's Recharges",
      value: stats.todayRecharges?.toLocaleString(),
      icon: <Activity />,
      color: 'var(--peach-accent)'
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue?.toLocaleString()}`,
      icon: <DollarSign />,
      color: 'var(--teal-accent)'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers?.toLocaleString(),
      icon: <Users />,
      color: 'var(--success)'
    },
    {
      title: 'Pending Transactions',
      value: stats.pendingTransactions,
      icon: <Clock />,
      color: 'var(--warning)'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} color="var(--success)" />;
      case 'pending':
        return <Clock size={16} color="var(--warning)" />;
      case 'failed':
        return <AlertCircle size={16} color="var(--error)" />;
      default:
        return <Clock size={16} color="var(--gray-medium)" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="admin-dashboard">
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
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--gray-medium)' }}>
              Welcome back! Here's what's happening with RechargeHub today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="btn btn-secondary"
            >
              <Calendar size={20} />
              Date Range
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const csvContent = `data:text/csv;charset=utf-8,Date,Users,Transactions,Revenue\n${stats.todayRecharges || 0},${stats.totalUsers || 0},${stats.totalRecharges || 0},${stats.totalRevenue || 0}`;
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `admin-report-${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
            >
              <Download size={20} />
              Export Report
            </motion.button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '15px',
                  background: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  background: stat.changeType === 'positive' ? 'var(--success)' : 'var(--error)',
                  color: 'white',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {stat.change}
                </div>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--gray-dark)',
                marginBottom: '0.3rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                color: 'var(--gray-medium)',
                fontSize: '0.9rem'
              }}>
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's Stats */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--teal-primary)' }}>
              <Activity />
            </div>
            <h3>Today's Overview</h3>
          </div>
          <div className="grid grid-4">
            {todayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: `${stat.color}15`,
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: `2px solid ${stat.color}30`
                }}
              >
                <div style={{
                  color: stat.color,
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: 'var(--gray-dark)',
                  marginBottom: '0.3rem'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: 'var(--gray-medium)',
                  fontSize: '0.9rem'
                }}>
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Recent Transactions */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon" style={{ background: 'var(--peach-primary)' }}>
                <Smartphone />
              </div>
              <h3>Recent Transactions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--gray-light)',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusIcon(transaction.status)}
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                        {transaction.userId?.name || 'Unknown User'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                        {transaction.phoneNumber} • {transaction.operator}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--gray-dark)' }}>
                      ₹{transaction.amount}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                      {formatTime(transaction.createdAt || transaction.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon" style={{ background: 'var(--teal-dark)' }}>
                <BarChart3 />
              </div>
              <h3>Quick Actions</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'View All Users', icon: <Users />, color: 'var(--teal-primary)', path: '/admin/users' },
                { title: 'Transaction Reports', icon: <BarChart3 />, color: 'var(--peach-primary)', path: '/admin/transactions' },
                { title: 'Operator Management', icon: <Smartphone />, color: 'var(--teal-accent)', path: '/admin/operators' },
                { title: 'System Analytics', icon: <PieChart />, color: 'var(--peach-accent)', path: '/admin/analytics' }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: `${action.color}15`,
                    border: `2px solid ${action.color}30`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    {action.icon}
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                    {action.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range Picker */}
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{
              position: 'absolute',
              top: '120px',
              right: '2rem',
              zIndex: 1000,
              minWidth: '300px'
            }}
          >
            <h4 style={{ marginBottom: '1rem' }}>Select Date Range</h4>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDatePicker(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Applying date range:', dateRange);
                  // Here you would typically refetch data with the new date range
                  setShowDatePicker(false);
                }}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}

        {/* Click outside to close date picker */}
        {showDatePicker && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowDatePicker(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;