import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { transactionAPI } from '../utils/api';
import TestLogin from '../components/TestLogin';
import Toast from '../components/Toast';

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'success', name: 'Success' },
    { id: 'pending', name: 'Pending' },
    { id: 'failed', name: 'Failed' }
  ];

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (!user) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      const response = await transactionAPI.getMyTransactions();
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setFilteredTransactions(response.data.transactions);
        
        if (isRefresh) {
          setToast({
            message: 'Transaction history updated successfully!',
            type: 'success'
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      const errorMessage = 'Failed to load transaction history. Please try again.';
      setError(errorMessage);
      setTransactions([]);
      setFilteredTransactions([]);
      
      if (isRefresh) {
        setToast({
          message: errorMessage,
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Auto-refresh every 30 seconds to get real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !loading && !refreshing) {
        fetchTransactions(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, loading, refreshing, fetchTransactions]);

  useEffect(() => {
    let filtered = transactions;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(txn => 
        txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.phoneNumber.includes(searchTerm)
      );
    }
    setFilteredTransactions(filtered);
  }, [transactions, statusFilter, searchTerm]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle size={20} color="green" />;
      case 'pending': return <AlertCircle size={20} color="orange" />;
      case 'failed': return <XCircle size={20} color="red" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const downloadReport = () => {
    const headers = ['Transaction ID', 'Phone Number', 'Operator', 'Amount', 'Status', 'Date'];
    const csvRows = [headers.join(',')];
    
    filteredTransactions.forEach(txn => {
      const row = [
        txn.transactionId,
        txn.phoneNumber,
        txn.operator,
        txn.amount,
        txn.status,
        formatDate(txn.createdAt)
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!user) {
    return <TestLogin />;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>{error}</p>
        <button onClick={() => fetchTransactions()} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="history-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Transaction History</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => fetchTransactions(true)} 
              className="btn btn-secondary"
              disabled={refreshing}
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={downloadReport} className="btn btn-secondary">
              <Download size={20} />
              Download Report
            </button>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                {statusOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No transactions found</p>
            </div>
          ) : (
            <div>
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.transactionId}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <div>{getStatusIcon(transaction.status)}</div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      {transaction.phoneNumber} - {transaction.operator}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {transaction.transactionId} • {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>₹{transaction.amount}</div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: transaction.status === 'success' ? 'green' : 
                             transaction.status === 'pending' ? 'orange' : 'red'
                    }}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default History;