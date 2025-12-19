import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Smartphone, 
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

const SystemAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setAnalytics({
        userGrowth: {
          current: 15420,
          previous: 14200,
          growth: 8.6
        },
        revenueGrowth: {
          current: 2450000,
          previous: 2100000,
          growth: 16.7
        },
        transactionSuccess: {
          successful: 89340,
          failed: 2340,
          pending: 450,
          successRate: 97.5
        },
        operatorPerformance: [
          { name: 'Jio', transactions: 18930, revenue: 3200000, successRate: 98.8 },
          { name: 'Airtel', transactions: 15420, revenue: 2450000, successRate: 99.2 },
          { name: 'Vi', transactions: 12340, revenue: 1890000, successRate: 97.5 },
          { name: 'BSNL', transactions: 3450, revenue: 450000, successRate: 95.2 }
        ],
        dailyStats: [
          { date: '2024-01-09', users: 120, transactions: 890, revenue: 45000 },
          { date: '2024-01-10', users: 135, transactions: 920, revenue: 48000 },
          { date: '2024-01-11', users: 142, transactions: 1050, revenue: 52000 },
          { date: '2024-01-12', users: 158, revenue: 55000 },
          { date: '2024-01-13', users: 167, transactions: 1180, revenue: 58000 },
          { date: '2024-01-14', users: 175, transactions: 1250, revenue: 62000 },
          { date: '2024-01-15', users: 189, transactions: 1320, revenue: 65000 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
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
    <div className="system-analytics">
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
              System Analytics
            </h1>
            <p style={{ color: 'var(--gray-medium)' }}>
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-select"
              style={{ minWidth: '120px' }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
              className="btn btn-secondary"
            >
              <RefreshCw size={20} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const csvData = [
                  ['Metric', 'Value'],
                  ['Total Users', analytics.userGrowth?.current || 0],
                  ['Total Revenue', analytics.revenueGrowth?.current || 0],
                  ['Success Rate', analytics.transactionSuccess?.successRate || 0],
                  ['Successful Transactions', analytics.transactionSuccess?.successful || 0],
                  ['Failed Transactions', analytics.transactionSuccess?.failed || 0],
                  ['Pending Transactions', analytics.transactionSuccess?.pending || 0]
                ];
                const csvContent = csvData.map(row => row.join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
            >
              <Download size={20} />
              Export
            </motion.button>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, var(--teal-primary)15, var(--teal-primary)05)',
              border: '2px solid var(--teal-primary)30'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                background: 'var(--teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Users />
              </div>
              <div>
                <h3 style={{ color: 'var(--gray-dark)', marginBottom: '0.3rem' }}>
                  User Growth
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {analytics.userGrowth.growth > 0 ? (
                    <TrendingUp size={16} color="var(--success)" />
                  ) : (
                    <TrendingDown size={16} color="var(--error)" />
                  )}
                  <span style={{
                    color: analytics.userGrowth.growth > 0 ? 'var(--success)' : 'var(--error)',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {formatPercentage(analytics.userGrowth.growth)}
                  </span>
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--teal-primary)',
              marginBottom: '0.5rem'
            }}>
              {analytics.userGrowth.current.toLocaleString()}
            </div>
            <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
              Total Users ({analytics.userGrowth.previous.toLocaleString()} previous)
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, var(--peach-primary)15, var(--peach-primary)05)',
              border: '2px solid var(--peach-primary)30'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                background: 'var(--peach-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <DollarSign />
              </div>
              <div>
                <h3 style={{ color: 'var(--gray-dark)', marginBottom: '0.3rem' }}>
                  Revenue Growth
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <TrendingUp size={16} color="var(--success)" />
                  <span style={{
                    color: 'var(--success)',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {formatPercentage(analytics.revenueGrowth.growth)}
                  </span>
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--peach-primary)',
              marginBottom: '0.5rem'
            }}>
              {formatCurrency(analytics.revenueGrowth.current)}
            </div>
            <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
              Total Revenue ({formatCurrency(analytics.revenueGrowth.previous)} previous)
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, var(--success)15, var(--success)05)',
              border: '2px solid var(--success)30'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                background: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Activity />
              </div>
              <div>
                <h3 style={{ color: 'var(--gray-dark)', marginBottom: '0.3rem' }}>
                  Success Rate
                </h3>
                <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
                  Transaction Performance
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--success)',
              marginBottom: '0.5rem'
            }}>
              {analytics.transactionSuccess.successRate}%
            </div>
            <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
              {analytics.transactionSuccess.successful.toLocaleString()} successful transactions
            </div>
          </motion.div>
        </div>

        {/* Operator Performance */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--teal-primary)' }}>
              <Smartphone />
            </div>
            <h3>Operator Performance</h3>
          </div>
          <div className="grid grid-4">
            {analytics.operatorPerformance.map((operator, index) => (
              <motion.div
                key={operator.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--gray-light)',
                  borderRadius: '15px',
                  textAlign: 'center'
                }}
              >
                <h4 style={{ color: 'var(--gray-dark)', marginBottom: '1rem' }}>
                  {operator.name}
                </h4>
                <div style={{ marginBottom: '0.8rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--teal-primary)' }}>
                    {operator.transactions.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                    Transactions
                  </div>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--peach-primary)' }}>
                    {formatCurrency(operator.revenue)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                    Revenue
                  </div>
                </div>
                <div style={{
                  padding: '0.5rem',
                  background: operator.successRate > 98 ? 'var(--success)20' : 'var(--warning)20',
                  borderRadius: '10px',
                  color: operator.successRate > 98 ? 'var(--success)' : 'var(--warning)',
                  fontWeight: '600'
                }}>
                  {operator.successRate}% Success
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transaction Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--peach-primary)' }}>
              <PieChart />
            </div>
            <h3>Transaction Status Breakdown</h3>
          </div>
          <div className="grid grid-3">
            <div style={{
              padding: '2rem',
              background: 'var(--success)15',
              borderRadius: '15px',
              textAlign: 'center',
              border: '2px solid var(--success)30'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'var(--success)',
                marginBottom: '0.5rem'
              }}>
                {analytics.transactionSuccess.successful.toLocaleString()}
              </div>
              <div style={{ color: 'var(--gray-dark)', fontWeight: '600', marginBottom: '0.3rem' }}>
                Successful
              </div>
              <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
                {((analytics.transactionSuccess.successful / (analytics.transactionSuccess.successful + analytics.transactionSuccess.failed + analytics.transactionSuccess.pending)) * 100).toFixed(1)}% of total
              </div>
            </div>

            <div style={{
              padding: '2rem',
              background: 'var(--error)15',
              borderRadius: '15px',
              textAlign: 'center',
              border: '2px solid var(--error)30'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'var(--error)',
                marginBottom: '0.5rem'
              }}>
                {analytics.transactionSuccess.failed.toLocaleString()}
              </div>
              <div style={{ color: 'var(--gray-dark)', fontWeight: '600', marginBottom: '0.3rem' }}>
                Failed
              </div>
              <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
                {((analytics.transactionSuccess.failed / (analytics.transactionSuccess.successful + analytics.transactionSuccess.failed + analytics.transactionSuccess.pending)) * 100).toFixed(1)}% of total
              </div>
            </div>

            <div style={{
              padding: '2rem',
              background: 'var(--warning)15',
              borderRadius: '15px',
              textAlign: 'center',
              border: '2px solid var(--warning)30'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'var(--warning)',
                marginBottom: '0.5rem'
              }}>
                {analytics.transactionSuccess.pending.toLocaleString()}
              </div>
              <div style={{ color: 'var(--gray-dark)', fontWeight: '600', marginBottom: '0.3rem' }}>
                Pending
              </div>
              <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
                {((analytics.transactionSuccess.pending / (analytics.transactionSuccess.successful + analytics.transactionSuccess.failed + analytics.transactionSuccess.pending)) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemAnalytics;