import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  CreditCard,
  Gift,
  Star,
  Settings,
  LogOut,
  Smartphone
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    avatar: null
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: (user.address && user.address !== user.email) ? user.address : 'Not provided',
        joinDate: user.createdAt ? user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        avatar: null
      });
    }
  }, [user]);

  const [editData, setEditData] = useState({ ...profileData });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User /> },
    { id: 'recharges', name: 'My Recharges', icon: <Smartphone /> },
    { id: 'rewards', name: 'Rewards', icon: <Gift /> },
    { id: 'settings', name: 'Settings', icon: <Settings /> }
  ];

  const recentRecharges = [
    { id: 1, operator: 'Airtel', amount: 199, date: '2024-01-15', status: 'success' },
    { id: 2, operator: 'Jio', amount: 299, date: '2024-01-14', status: 'success' },
    { id: 3, operator: 'Vi', amount: 149, date: '2024-01-13', status: 'success' }
  ];

  const rewards = [
    { id: 1, title: 'First Recharge Bonus', points: 100, earned: '2024-01-15' },
    { id: 2, title: 'Weekend Warrior', points: 50, earned: '2024-01-14' },
    { id: 3, title: 'Loyalty Bonus', points: 75, earned: '2024-01-10' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just update the local state
      setProfileData({ ...editData });
      setIsEditing(false);
      
      // You can add API call here later:
      // await updateProfile(editData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTotalRewards = () => {
    return rewards.reduce((total, reward) => total + reward.points, 0);
  };

  return (
    <div className="profile-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--peach-primary), var(--peach-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold'
              }}>
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  profileData.name.charAt(0).toUpperCase()
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  background: 'var(--peach-primary)',
                  border: '3px solid white',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Camera size={16} />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h2 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
                    {profileData.name}
                  </h2>
                  <p style={{ color: 'var(--gray-medium)' }}>
                    Member since {formatDate(profileData.joinDate)}
                  </p>
                </div>
                
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEdit}
                    className="btn btn-secondary"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </motion.button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      <Save size={16} />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="btn btn-secondary"
                    >
                      <X size={16} />
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '1rem',
                  background: 'var(--peach-light)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                    {user?.totalRecharges || 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                    Recharges
                  </div>
                </div>
                <div style={{
                  padding: '1rem',
                  background: 'var(--peach-light)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                    {user?.rewardPoints || 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                    Reward Points
                  </div>
                </div>
                <div style={{
                  padding: '1rem',
                  background: 'var(--peach-light)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                    ₹{user?.totalSpent || 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                    Total Spent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                border: `2px solid ${activeTab === tab.id ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                borderRadius: '25px',
                background: activeTab === tab.id ? 'var(--peach-primary)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--gray-dark)',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <User />
                </div>
                <h3>Personal Information</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} style={{ marginRight: '0.5rem' }} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--gray-light)', borderRadius: '10px' }}>
                      {profileData.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} style={{ marginRight: '0.5rem' }} />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--gray-light)', borderRadius: '10px' }}>
                      {profileData.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} style={{ marginRight: '0.5rem' }} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--gray-light)', borderRadius: '10px' }}>
                      {profileData.phone}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} style={{ marginRight: '0.5rem' }} />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--gray-light)', borderRadius: '10px' }}>
                      {profileData.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recharges' && (
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <Smartphone />
                </div>
                <h3>Recent Recharges</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentRecharges.map((recharge) => (
                  <div
                    key={recharge.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--peach-light)',
                      borderRadius: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                        {recharge.operator} Recharge
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                        {formatDate(recharge.date)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                        ₹{recharge.amount}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--success)',
                        textTransform: 'capitalize'
                      }}>
                        {recharge.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <Gift />
                </div>
                <h3>Reward Points</h3>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, var(--peach-primary), var(--peach-dark))',
                borderRadius: '15px',
                padding: '2rem',
                color: 'white',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {getTotalRewards()}
                </div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  Total Reward Points
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--peach-light)',
                      borderRadius: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--peach-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Star size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                          {reward.title}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                          Earned on {formatDate(reward.earned)}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: 'var(--peach-dark)'
                    }}>
                      +{reward.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <Settings />
                </div>
                <h3>Account Settings</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: <Bell />, title: 'Notifications', description: 'Manage your notification preferences' },
                  { icon: <Shield />, title: 'Security', description: 'Change password and security settings' },
                  { icon: <CreditCard />, title: 'Payment Methods', description: 'Manage saved payment methods' },
                  { icon: <LogOut />, title: 'Logout', description: 'Sign out of your account' }
                ].map((setting, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'var(--peach-light)',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--peach-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {setting.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                        {setting.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                        {setting.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;