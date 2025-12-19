import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import { transactionAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import TestLogin from '../components/TestLogin';

import { 
  Smartphone, 
  Zap, 
  CreditCard, 
  Gift, 
  Check,
  AlertCircle,
  Star,
  Percent
} from 'lucide-react';

const Recharge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    operator: '',
    circle: '',
    amount: '',
    paymentMethod: 'card'
  });
  
  useEffect(() => {
    // Check for pre-filled plan data
    const selectedPlan = localStorage.getItem('selectedPlan');
    if (selectedPlan) {
      const planData = JSON.parse(selectedPlan);
      setFormData(prev => ({
        ...prev,
        amount: planData.amount.toString(),
        operator: planData.operator
      }));
      localStorage.removeItem('selectedPlan');
    }
    
    // Check for selected offer
    const selectedOffer = localStorage.getItem('selectedOffer');
    if (selectedOffer) {
      const offerData = JSON.parse(selectedOffer);
      // Set minimum amount if offer has one
      if (offerData.minAmount) {
        setFormData(prev => ({
          ...prev,
          amount: offerData.minAmount.toString()
        }));
      }
      localStorage.removeItem('selectedOffer');
    }
  }, []);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [transactionResult, setTransactionResult] = useState(null);
  const [toast, setToast] = useState(null);

  const operators = [
    { id: 'airtel', name: 'Airtel', logo: '' },
    { id: 'jio', name: 'Jio', logo: '' },
    { id: 'vi', name: 'Vi (Vodafone Idea)', logo: '' },
    { id: 'bsnl', name: 'BSNL', logo: '' }
  ];

  const circles = [
    'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'
  ];

  const quickAmounts = [99, 149, 199, 299, 399, 499, 599, 999];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard /> },
    { id: 'upi', name: 'UPI', icon: '💳' },
    { id: 'wallet', name: 'Wallet', icon: '👛' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' }
  ];

  useEffect(() => {
    // Simulate fetching offers based on operator and amount
    if (formData.operator && formData.amount) {
      const mockOffers = [
        { id: 1, title: '5% Cashback', description: 'Get 5% cashback up to ₹50', discount: 5 },
        { id: 2, title: 'Extra Talktime', description: 'Get ₹10 extra talktime', discount: 10 },
        { id: 3, title: 'First Recharge Bonus', description: 'Get 10% extra on first recharge', discount: 10 }
      ];
      setOffers(mockOffers);
    }
  }, [formData.operator, formData.amount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
  };

  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.phoneNumber || !formData.operator || !formData.circle || !formData.amount) {
      setError('Please fill all fields');
      return;
    }
    
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setError('Enter valid 10-digit mobile number starting with 6-9');
      return;
    }
    
    if (formData.amount < 10 || formData.amount > 5000) {
      setError('Amount must be between ₹10 and ₹5000');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await transactionAPI.createRecharge({
        phoneNumber: formData.phoneNumber,
        operator: formData.operator.toUpperCase(),
        circle: formData.circle,
        amount: parseInt(formData.amount),
        paymentMethod: formData.paymentMethod,
        offerApplied: null // You can implement offer selection later
      });
      
      if (response.data.success) {
        setTransactionResult(response.data.transaction);
        setStep(3);
        
        // Show success toast
        setToast({
          message: `Recharge initiated successfully! Transaction ID: ${response.data.transaction.transactionId}`,
          type: 'success'
        });
        
        // Poll for transaction status updates
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await transactionAPI.getTransaction(response.data.transaction.transactionId);
            if (statusResponse.data.success) {
              const updatedTransaction = statusResponse.data.transaction;
              setTransactionResult(updatedTransaction);
              
              if (updatedTransaction.status === 'success') {
                setToast({
                  message: 'Recharge completed successfully!',
                  type: 'success'
                });
                clearInterval(pollInterval);
                setTimeout(() => navigate('/history'), 2000);
              } else if (updatedTransaction.status === 'failed') {
                setToast({
                  message: `Recharge failed: ${updatedTransaction.failureReason || 'Unknown error'}`,
                  type: 'error'
                });
                clearInterval(pollInterval);
              }
            }
          } catch (pollError) {
            console.error('Status polling error:', pollError);
          }
        }, 2000);
        
        // Clear polling after 30 seconds
        setTimeout(() => clearInterval(pollInterval), 30000);
      } else {
        setError(response.data.message || 'Recharge failed. Please try again.');
        setToast({
          message: response.data.message || 'Recharge failed. Please try again.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Recharge error:', err);
      const errorMessage = err.response?.data?.message || 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.phoneNumber && formData.operator && formData.circle;
      case 2:
        return formData.amount && formData.paymentMethod;
      default:
        return true;
    }
  };

  if (step === 3) {
    return (
      <motion.div 
        className="success-page"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--white)',
          borderRadius: '20px',
          boxShadow: '0 10px 40px var(--shadow)',
          maxWidth: '500px',
          margin: '2rem auto'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: '80px',
            height: '80px',
            background: 'var(--success)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            color: 'white',
            fontSize: '2rem'
          }}
        >
          <Check size={40} />
        </motion.div>
        <h2 style={{ color: 'var(--gray-dark)', marginBottom: '1rem' }}>
          Recharge Initiated!
        </h2>
        <p style={{ color: 'var(--gray-medium)', marginBottom: '1rem' }}>
          Your recharge of ₹{formData.amount} for {formData.phoneNumber} has been initiated.
        </p>
        {transactionResult && (
          <div style={{ 
            background: 'var(--peach-light)', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <p><strong>Transaction ID:</strong> {transactionResult.transactionId}</p>
            <p><strong>Status:</strong> {transactionResult.status}</p>
            {transactionResult.cashback > 0 && (
              <p><strong>Cashback:</strong> ₹{transactionResult.cashback}</p>
            )}
          </div>
        )}
        <p style={{ color: 'var(--gray-medium)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          You will be redirected to transaction history in a few seconds...
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/history')}
          >
            View History
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setStep(1);
              setError('');
              setTransactionResult(null);
              setFormData({
                phoneNumber: '',
                operator: '',
                circle: '',
                amount: '',
                paymentMethod: 'card'
              });
            }}
          >
            Recharge Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <div className="recharge-page">
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <TestLogin />
        </div>
      </div>
    );
  }

  return (
    <div className="recharge-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <motion.div 
        className="recharge-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          {[1, 2].map((stepNum) => (
            <div
              key={stepNum}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step >= stepNum ? 'var(--peach-primary)' : 'var(--peach-light)',
                color: step >= stepNum ? 'white' : 'var(--gray-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {stepNum}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <Smartphone />
            </div>
            <h2>Mobile Recharge</h2>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Operator</label>
                  <div className="operator-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                  }}>
                    {operators.map((operator) => (
                      <motion.div
                        key={operator.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`operator-card ${formData.operator === operator.id ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, operator: operator.id }))}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${formData.operator === operator.id ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                          borderRadius: '15px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: formData.operator === operator.id ? 'var(--peach-light)' : 'white'
                        }}
                      >

                        <div style={{ fontWeight: '600' }}>{operator.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Circle</label>
                  <select
                    name="circle"
                    value={formData.circle}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Choose your circle</option>
                    {circles.map((circle) => (
                      <option key={circle} value={circle}>{circle}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="form-group">
                  <label className="form-label">Recharge Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter amount"
                    min="10"
                    max="5000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quick Amount Selection</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {quickAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAmountSelect(amount)}
                        style={{
                          padding: '0.8rem',
                          border: `2px solid ${formData.amount === amount.toString() ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                          borderRadius: '10px',
                          background: formData.amount === amount.toString() ? 'var(--peach-light)' : 'white',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ₹{amount}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {offers.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Available Offers</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {offers.map((offer) => (
                        <motion.div
                          key={offer.id}
                          whileHover={{ scale: 1.02 }}
                          style={{
                            padding: '1rem',
                            background: 'var(--peach-light)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                        >
                          <Gift size={20} color="var(--peach-dark)" />
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                              {offer.title}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                              {offer.description}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {paymentMethods.map((method) => (
                      <motion.label
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem',
                          border: `2px solid ${formData.paymentMethod === method.id ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          background: formData.paymentMethod === method.id ? 'var(--peach-light)' : 'white'
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                        />
                        <div style={{ fontSize: '1.5rem' }}>
                          {method.icon}
                        </div>
                        <span style={{ fontWeight: '600' }}>{method.name}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '2rem',
              gap: '1rem'
            }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
              )}
              
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (formData.phoneNumber && formData.operator && formData.circle) {
                      setStep(2);
                    }
                  }}
                  disabled={!formData.phoneNumber || !formData.operator || !formData.circle}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.amount || loading}
                  className="btn btn-primary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {loading ? (
                    <div className="spinner" style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <>
                      <Smartphone size={20} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
                      Recharge Now
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Recharge;