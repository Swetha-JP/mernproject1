import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Wifi, 
  Phone, 
  MessageSquare, 
  Clock, 
  Star,
  Filter,
  Search,
  Zap
} from 'lucide-react';

const Plans = () => {
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);

  const operators = [
    { id: 'all', name: 'All Operators' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'jio', name: 'Jio' },
    { id: 'vi', name: 'Vi' },
    { id: 'bsnl', name: 'BSNL' }
  ];

  const categories = [
    { id: 'all', name: 'All Plans', icon: <Smartphone /> },
    { id: 'data', name: 'Data Plans', icon: <Wifi /> },
    { id: 'talktime', name: 'Talktime', icon: <Phone /> },
    { id: 'sms', name: 'SMS Plans', icon: <MessageSquare /> },
    { id: 'combo', name: 'Combo Plans', icon: <Star /> }
  ];

  const mockPlans = [
    {
      id: 1,
      operator: 'airtel',
      category: 'combo',
      price: 199,
      validity: 28,
      data: '1GB/day',
      calls: 'Unlimited',
      sms: '100/day',
      description: 'Perfect for daily usage',
      popular: true,
      rating: 4.5
    },
    {
      id: 2,
      operator: 'jio',
      category: 'data',
      price: 149,
      validity: 28,
      data: '2GB/day',
      calls: 'FUP 1000 mins',
      sms: '100/day',
      description: 'High-speed data plan',
      popular: false,
      rating: 4.3
    },
    {
      id: 3,
      operator: 'vi',
      category: 'combo',
      price: 299,
      validity: 28,
      data: '1.5GB/day',
      calls: 'Unlimited',
      sms: 'Unlimited',
      description: 'Complete entertainment package',
      popular: true,
      rating: 4.4
    },
    {
      id: 4,
      operator: 'airtel',
      category: 'talktime',
      price: 99,
      validity: 28,
      data: '200MB',
      calls: 'Unlimited',
      sms: '300',
      description: 'Basic calling plan',
      popular: false,
      rating: 4.1
    },
    {
      id: 5,
      operator: 'jio',
      category: 'combo',
      price: 399,
      validity: 56,
      data: '2GB/day',
      calls: 'Unlimited',
      sms: '100/day',
      description: 'Long validity combo',
      popular: true,
      rating: 4.6
    },
    {
      id: 6,
      operator: 'bsnl',
      category: 'data',
      price: 99,
      validity: 22,
      data: '2GB',
      calls: 'FUP 200 mins',
      sms: '100',
      description: 'Budget data plan',
      popular: false,
      rating: 3.9
    }
  ];

  useEffect(() => {
    setPlans(mockPlans);
  }, []);

  const filteredPlans = plans.filter(plan => {
    const matchesOperator = selectedOperator === 'all' || plan.operator === selectedOperator;
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    const matchesSearch = plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.price.toString().includes(searchTerm);
    
    return matchesOperator && matchesCategory && matchesSearch;
  });

  const handleRecharge = (plan) => {
    // Store plan data in localStorage for the recharge page
    localStorage.setItem('selectedPlan', JSON.stringify({
      amount: plan.price,
      operator: plan.operator,
      planDetails: plan
    }));
    
    // Navigate to recharge page
    window.location.href = '/recharge';
  };

  return (
    <div className="plans-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
            Recharge Plans
          </h1>
          <p style={{ color: 'var(--gray-medium)' }}>
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon">
              <Filter />
            </div>
            <h3>Filter Plans</h3>
          </div>

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
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          {/* Operator Filter */}
          <div className="form-group">
            <label className="form-label">Operator</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {operators.map((operator) => (
                <motion.button
                  key={operator.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedOperator(operator.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `2px solid ${selectedOperator === operator.id ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                    borderRadius: '25px',
                    background: selectedOperator === operator.id ? 'var(--peach-primary)' : 'white',
                    color: selectedOperator === operator.id ? 'white' : 'var(--gray-dark)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  {operator.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `2px solid ${selectedCategory === category.id ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                    borderRadius: '25px',
                    background: selectedCategory === category.id ? 'var(--peach-primary)' : 'white',
                    color: selectedCategory === category.id ? 'white' : 'var(--gray-dark)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {category.icon}
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-2">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{ position: 'relative' }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  background: 'var(--peach-accent)',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  Popular
                </div>
              )}

              <div className="card-header">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div>
                    <h3 style={{ color: 'var(--peach-dark)', textTransform: 'capitalize' }}>
                      {plan.operator}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Star size={16} color="var(--warning)" fill="var(--warning)" />
                      <span style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                        {plan.rating}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gray-dark)' }}>
                      ₹{plan.price}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                      {plan.validity} days
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--gray-medium)', marginBottom: '1rem' }}>
                  {plan.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{
                    padding: '0.8rem',
                    background: 'var(--peach-light)',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <Wifi size={20} color="var(--peach-dark)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-dark)' }}>
                      {plan.data}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                      Data
                    </div>
                  </div>

                  <div style={{
                    padding: '0.8rem',
                    background: 'var(--peach-light)',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <Phone size={20} color="var(--peach-dark)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-dark)' }}>
                      {plan.calls}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                      Calls
                    </div>
                  </div>

                  <div style={{
                    padding: '0.8rem',
                    background: 'var(--peach-light)',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <MessageSquare size={20} color="var(--peach-dark)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-dark)' }}>
                      {plan.sms}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                      SMS
                    </div>
                  </div>

                  <div style={{
                    padding: '0.8rem',
                    background: 'var(--peach-light)',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <Clock size={20} color="var(--peach-dark)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-dark)' }}>
                      {plan.validity} days
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-medium)' }}>
                      Validity
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRecharge(plan)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Smartphone size={20} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
                Recharge Now
              </motion.button>
            </motion.div>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--gray-medium)'
            }}
          >
            <Smartphone size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No plans found</h3>
            <p>Try adjusting your filters to see more plans</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Plans;