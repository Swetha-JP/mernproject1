import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { planAPI, operatorAPI } from '../utils/api';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  Clock,
  DollarSign
} from 'lucide-react';

const mockPlans = [
  {
    id: 1,
    name: 'Unlimited Pack',
    operator: 'Airtel',
    amount: 199,
    validity: '28 days',
    data: '1.5GB/day',
    talktime: 'Unlimited',
    sms: '100/day',
    description: 'Unlimited calling with 1.5GB daily data',
    status: 'active'
  },
  {
    id: 2,
    name: 'Data Booster',
    operator: 'Jio',
    amount: 299,
    validity: '28 days',
    data: '2GB/day',
    talktime: 'Unlimited',
    sms: 'Unlimited',
    description: '2GB daily data with unlimited benefits',
    status: 'active'
  }
];

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    operator: '',
    category: 'combo',
    price: '',
    validity: '',
    data: '',
    calls: '',
    sms: '',
    description: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);



  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const plansRes = await planAPI.getPlans();
      
      if (plansRes.data.success) {
        setPlans(plansRes.data.plans);
        setFilteredPlans(plansRes.data.plans);
      } else {
        setPlans(mockPlans);
        setFilteredPlans(mockPlans);
      }
      

    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans(mockPlans);
      setFilteredPlans(mockPlans);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    let filtered = plans;

    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.operator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (operatorFilter !== 'all') {
      filtered = filtered.filter(plan => plan.operator.toLowerCase() === operatorFilter.toLowerCase());
    }

    setFilteredPlans(filtered);
  }, [plans, searchTerm, operatorFilter]);

  const getStatusColor = (status) => {
    return status === 'active' ? 'var(--success)' : 'var(--warning)';
  };

  const handlePlanAction = async (action, plan) => {
    switch (action) {
      case 'view':
        setSelectedPlan(plan);
        setIsEditing(false);
        setShowPlanModal(true);
        break;
      case 'edit':
        setSelectedPlan(plan);
        setFormData({
          operator: plan.operator,
          category: plan.category || 'combo',
          price: plan.price,
          validity: plan.validity,
          data: plan.data,
          calls: plan.calls,
          sms: plan.sms,
          description: plan.description,
          status: plan.status
        });
        setIsEditing(true);
        setShowPlanModal(true);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this plan?')) {
          try {
            await planAPI.deletePlan(plan._id);
            await fetchPlans();
          } catch (error) {
            console.error('Failed to delete plan:', error);
            alert('Failed to delete plan');
          }
        }
        break;
      default:
        break;
    }
  };

  const handleAddPlan = () => {
    setFormData({
      operator: '',
      category: 'combo',
      price: '',
      validity: '',
      data: '',
      calls: '',
      sms: '',
      description: '',
      status: 'active'
    });
    setSelectedPlan(null);
    setIsEditing(true);
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (selectedPlan) {
        const response = await planAPI.updatePlan(selectedPlan._id, formData);
        if (response.data.success) {
          await fetchPlans();
          setShowPlanModal(false);
        }
      } else {
        const response = await planAPI.createPlan(formData);
        if (response.data.success) {
          await fetchPlans();
          setShowPlanModal(false);
        }
      }
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert(error.response?.data?.message || 'Failed to save plan');
    } finally {
      setSaving(false);
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
    <div className="plan-management">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
              Plan Management
            </h1>
            <p style={{ color: 'var(--gray-medium)' }}>
              Manage recharge plans for all operators
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddPlan}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
          >
            <Plus size={20} />
            Add Plan
          </motion.button>
        </div>

        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { 
              title: 'Total Plans', 
              value: plans.length, 
              color: 'var(--teal-primary)',
              icon: <CreditCard />
            },
            { 
              title: 'Active Plans', 
              value: plans.filter(plan => plan.status === 'active').length, 
              color: 'var(--success)',
              icon: <ToggleRight />
            },
            { 
              title: 'Avg Amount', 
              value: plans.length > 0 ? `₹${Math.round(plans.reduce((sum, plan) => sum + (plan.price || plan.amount || 0), 0) / plans.length)}` : '₹0', 
              color: 'var(--peach-primary)',
              icon: <DollarSign />
            },
            { 
              title: 'Operators', 
              value: [...new Set(plans.map(plan => plan.operator))].length, 
              color: 'var(--teal-dark)',
              icon: <Clock />
            }
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
                fontSize: '1.8rem',
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

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--teal-primary)' }}>
              <Filter />
            </div>
            <h3>Filter Plans</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
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
                  placeholder="Search plans by name or operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Operators</option>
                {[...new Set(plans.map(plan => plan.operator))].map(operator => (
                  <option key={operator} value={operator}>{operator}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                border: `2px solid ${plan.status === 'active' ? 'var(--success)30' : 'var(--warning)30'}`
              }}
            >
              <div>
                <h3 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
                  {plan.operator} {plan.category} Plan
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', marginBottom: '0.5rem' }}>
                  {plan.operator}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  background: `${getStatusColor(plan.status)}20`,
                  color: getStatusColor(plan.status),
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {plan.status === 'active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  {plan.status}
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'var(--gray-light)',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--peach-dark)', textAlign: 'center', marginBottom: '1rem' }}>
                  ₹{plan.price || plan.amount}
                </div>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-medium)' }}>Validity:</span>
                    <span style={{ fontWeight: '600' }}>{plan.validity} days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-medium)' }}>Data:</span>
                    <span style={{ fontWeight: '600' }}>{plan.data}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-medium)' }}>Calls:</span>
                    <span style={{ fontWeight: '600' }}>{plan.calls || plan.talktime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-medium)' }}>SMS:</span>
                    <span style={{ fontWeight: '600' }}>{plan.sms}</span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'var(--peach-light)',
                borderRadius: '10px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
                  {plan.description}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlanAction('view', plan)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--teal-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Eye size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlanAction('edit', plan)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--peach-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Edit3 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlanAction('delete', plan)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--error)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
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
            <CreditCard size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No plans found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {showPlanModal && (
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
                <h3>{isEditing && selectedPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                <button
                  onClick={() => setShowPlanModal(false)}
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

              <form onSubmit={handleSavePlan}>
                <div className="form-group">
                  <label className="form-label">Operator</label>
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({...formData, operator: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Select Operator</option>
                    <option value="Airtel">Airtel</option>
                    <option value="Jio">Jio</option>
                    <option value="Vi">Vi</option>
                    <option value="BSNL">BSNL</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="combo">Combo</option>
                    <option value="data">Data</option>
                    <option value="talktime">Talktime</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Validity (days)</label>
                    <input
                      type="number"
                      value={formData.validity}
                      onChange={(e) => setFormData({...formData, validity: parseInt(e.target.value)})}
                      className="form-input"
                      placeholder="28"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Data</label>
                    <input
                      type="text"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                      className="form-input"
                      placeholder="1.5GB/day"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calls</label>
                    <input
                      type="text"
                      value={formData.calls}
                      onChange={(e) => setFormData({...formData, calls: e.target.value})}
                      className="form-input"
                      placeholder="Unlimited"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SMS</label>
                    <input
                      type="text"
                      value={formData.sms}
                      onChange={(e) => setFormData({...formData, sms: e.target.value})}
                      className="form-input"
                      placeholder="100/day"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-input"
                    rows="3"
                    placeholder="Plan description..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="btn btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))' }}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (selectedPlan ? 'Update Plan' : 'Add Plan')}
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

export default PlanManagement;