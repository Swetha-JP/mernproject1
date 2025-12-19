import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { transactionAPI } from '../utils/api';
import { 
  CreditCard, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit3
} from 'lucide-react';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const mockTransactions = [
    {
      id: 'TXN001',
      userId: 1,
      userName: 'John Doe',
      phoneNumber: '9876543210',
      operator: 'Airtel',
      amount: 199,
      status: 'success',
      paymentMethod: 'Credit Card',
      timestamp: '2024-01-15T10:30:00Z',
      offerApplied: 'FIRST20',
      cashback: 10,
      commission: 5.97,
      gateway: 'Razorpay'
    },
    {
      id: 'TXN002',
      userId: 2,
      userName: 'Jane Smith',
      phoneNumber: '9876543211',
      operator: 'Jio',
      amount: 299,
      status: 'pending',
      paymentMethod: 'UPI',
      timestamp: '2024-01-15T10:25:00Z',
      offerApplied: null,
      cashback: 0,
      commission: 8.97,
      gateway: 'Paytm'
    },
    {
      id: 'TXN003',
      userId: 3,
      userName: 'Mike Johnson',
      phoneNumber: '9876543212',
      operator: 'Vi',
      amount: 149,
      status: 'failed',
      paymentMethod: 'Wallet',
      timestamp: '2024-01-15T10:20:00Z',
      offerApplied: 'WEEKEND10',
      cashback: 0,
      commission: 0,
      gateway: 'PhonePe'
    },
    {
      id: 'TXN004',
      userId: 1,
      userName: 'John Doe',
      phoneNumber: '9876543210',
      operator: 'BSNL',
      amount: 99,
      status: 'success',
      paymentMethod: 'Net Banking',
      timestamp: '2024-01-15T09:15:00Z',
      offerApplied: null,
      cashback: 0,
      commission: 2.97,
      gateway: 'Razorpay'
    }
  ];

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await transactionAPI.getAllTransactions();
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setFilteredTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Fallback to mock data if API fails
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchTransactions(true), 30000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(txn =>
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.phoneNumber.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }

    if (operatorFilter !== 'all') {
      filtered = filtered.filter(txn => txn.operator.toLowerCase() === operatorFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        
        switch (dateFilter) {
          case 'today':
            return txnDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return txnDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return txnDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, dateFilter, operatorFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} color="var(--success)" />;
      case 'pending':
        return <Clock size={16} color="var(--warning)" />;
      case 'failed':
        return <XCircle size={16} color="var(--error)" />;
      default:
        return <Clock size={16} color="var(--gray-medium)" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'var(--success)';
      case 'pending':
        return 'var(--warning)';
      case 'failed':
        return 'var(--error)';
      default:
        return 'var(--gray-medium)';
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    const total = filteredTransactions.length;
    const successful = filteredTransactions.filter(t => t.status === 'success').length;
    const pending = filteredTransactions.filter(t => t.status === 'pending').length;
    const failed = filteredTransactions.filter(t => t.status === 'failed').length;
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalCommission = filteredTransactions.reduce((sum, t) => sum + t.commission, 0);

    return { total, successful, pending, failed, totalAmount, totalCommission };
  };

  const stats = calculateStats();

  const handleTransactionAction = (action, transaction) => {
    switch (action) {
      case 'view':
        setSelectedTransaction(transaction);
        setShowTransactionModal(true);
        break;
      case 'retry':
        // Handle retry transaction
        const updatedTransactions = transactions.map(t =>
          t.id === transaction.id
            ? { ...t, status: 'pending' }
            : t
        );
        setTransactions(updatedTransactions);
        break;
      case 'refund':
        // Handle refund
        if (window.confirm('Are you sure you want to process a refund for this transaction?')) {
          console.log('Processing refund for:', transaction.id);
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
    <div className="transaction-management">
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
              Transaction Management
            </h1>
            <p style={{ color: 'var(--gray-medium)' }}>
              Monitor and manage all recharge transactions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchTransactions(true)}
              className="btn btn-secondary"
              disabled={refreshing}
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const csvData = [
                  ['Transaction ID', 'User Name', 'Phone', 'Operator', 'Amount', 'Status', 'Payment Method', 'Date', 'Commission', 'Cashback', 'Gateway']
                ];
                filteredTransactions.forEach(txn => {
                  csvData.push([
                    txn.id,
                    txn.userName,
                    txn.phoneNumber,
                    txn.operator,
                    txn.amount,
                    txn.status,
                    txn.paymentMethod,
                    formatDateTime(txn.timestamp),
                    txn.commission,
                    txn.cashback,
                    txn.gateway
                  ]);
                });
                const csvContent = csvData.map(row => row.join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `transactions-report-${new Date().toISOString().split('T')[0]}.csv`;
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

        {/* Stats Cards */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { title: 'Total Transactions', value: stats.total, icon: <CreditCard />, color: 'var(--teal-primary)' },
            { title: 'Successful', value: stats.successful, icon: <CheckCircle />, color: 'var(--success)' },
            { title: 'Pending', value: stats.pending, icon: <Clock />, color: 'var(--warning)' },
            { title: 'Failed', value: stats.failed, icon: <XCircle />, color: 'var(--error)' }
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
                color: stat.color,
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: stat.color,
                marginBottom: '0.3rem'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--gray-medium)', fontSize: '0.9rem' }}>
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--peach-light), var(--white))',
            border: '2px solid var(--peach-primary)30'
          }}>
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
                <h3 style={{ color: 'var(--gray-dark)' }}>Total Revenue</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                  ₹{stats.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--teal-light), var(--white))',
            border: '2px solid var(--teal-primary)30'
          }}>
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
                <TrendingUp />
              </div>
              <div>
                <h3 style={{ color: 'var(--gray-dark)' }}>Total Commission</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--teal-dark)' }}>
                  ₹{stats.totalCommission.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--teal-primary)' }}>
              <Filter />
            </div>
            <h3>Filter Transactions</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
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
                  placeholder="Search by ID, user, or phone..."
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
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Operator Filter */}
            <div className="form-group">
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Operators</option>
                <option value="airtel">Airtel</option>
                <option value="jio">Jio</option>
                <option value="vi">Vi</option>
                <option value="bsnl">BSNL</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="form-group">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--peach-primary)' }}>
              <CreditCard />
            </div>
            <h3>Transactions ({filteredTransactions.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--peach-light)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Transaction</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>User</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Details</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Amount</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--gray-dark)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ borderBottom: '1px solid var(--peach-light)' }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                          {transaction.id}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                          {formatDateTime(transaction.timestamp)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                          {transaction.gateway}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                          {transaction.userName}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                          {transaction.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                          {transaction.operator}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                          {transaction.paymentMethod}
                        </div>
                        {transaction.offerApplied && (
                          <div style={{
                            fontSize: '0.8rem',
                            background: 'var(--peach-light)',
                            color: 'var(--peach-dark)',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '10px',
                            display: 'inline-block',
                            marginTop: '0.2rem'
                          }}>
                            {transaction.offerApplied}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        background: `${getStatusColor(transaction.status)}20`,
                        color: getStatusColor(transaction.status),
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--gray-dark)' }}>
                          ₹{transaction.amount}
                        </div>
                        {transaction.cashback > 0 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                            ₹{transaction.cashback} cashback
                          </div>
                        )}
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                          Commission: ₹{transaction.commission}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTransactionAction('view', transaction)}
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
                        {transaction.status === 'failed' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTransactionAction('retry', transaction)}
                            style={{
                              width: '35px',
                              height: '35px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'var(--warning)',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <RefreshCw size={16} />
                          </motion.button>
                        )}
                        {transaction.status === 'success' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTransactionAction('refund', transaction)}
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
                            <AlertTriangle size={16} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--gray-medium)'
            }}>
              <CreditCard size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No transactions found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Transaction Details Modal */}
        {showTransactionModal && selectedTransaction && (
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
              style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3>Transaction Details</h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--gray-dark)' }}>Transaction Info</h4>
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <div><strong>ID:</strong> {selectedTransaction.id}</div>
                    <div><strong>Status:</strong> 
                      <span style={{
                        marginLeft: '0.5rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '10px',
                        background: `${getStatusColor(selectedTransaction.status)}20`,
                        color: getStatusColor(selectedTransaction.status),
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div><strong>Amount:</strong> ₹{selectedTransaction.amount}</div>
                    <div><strong>Commission:</strong> ₹{selectedTransaction.commission}</div>
                    <div><strong>Cashback:</strong> ₹{selectedTransaction.cashback}</div>
                    <div><strong>Gateway:</strong> {selectedTransaction.gateway}</div>
                    <div><strong>Date:</strong> {formatDateTime(selectedTransaction.timestamp)}</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--gray-dark)' }}>User & Service Info</h4>
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <div><strong>User:</strong> {selectedTransaction.userName}</div>
                    <div><strong>Phone:</strong> {selectedTransaction.phoneNumber}</div>
                    <div><strong>Operator:</strong> {selectedTransaction.operator}</div>
                    <div><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</div>
                    {selectedTransaction.offerApplied && (
                      <div><strong>Offer Applied:</strong> {selectedTransaction.offerApplied}</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TransactionManagement;