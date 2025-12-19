import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Gift, 
  Clock, 
  Shield, 
  Star,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Smartphone style={{ filter: 'drop-shadow(0 0 8px rgba(255, 176, 122, 0.8))' }} />,
      title: 'Instant Recharge',
      description: 'Lightning-fast recharges in under 10 seconds'
    },
    {
      icon: <Gift />,
      title: 'Exclusive Offers',
      description: 'Get cashback and special deals on every recharge'
    },
    {
      icon: <Shield />,
      title: 'Secure Payments',
      description: 'Bank-grade security for all your transactions'
    },
    {
      icon: <Clock />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  const stats = [
    { icon: <Users />, value: '10M+', label: 'Happy Users' },
    { icon: <Smartphone style={{ filter: 'drop-shadow(0 0 8px rgba(255, 176, 122, 0.8))' }} />, value: '50M+', label: 'Recharges Done' },
    { icon: <Award />, value: '99.9%', label: 'Success Rate' },
    { icon: <TrendingUp />, value: '₹500Cr+', label: 'Transactions' }
  ];

  const quickActions = [
    { icon: <Smartphone />, title: 'Mobile Recharge', path: '/recharge', color: 'var(--peach-primary)' },
    { icon: <Gift />, title: 'View Offers', path: '/offers', color: 'var(--peach-dark)' },
    { icon: <Star />, title: 'Best Plans', path: '/plans', color: 'var(--peach-accent)' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Recharge Made Simple & Rewarding</h1>
        <p>
          Experience the fastest, most secure, and rewarding way to recharge your mobile. 
          Get instant cashback, exclusive offers, and seamless transactions.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/recharge" className="btn btn-primary">
            <Smartphone size={20} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
            Recharge Now
          </Link>
          <Link to="/offers" className="btn btn-secondary">
            <Gift size={20} />
            View Offers
          </Link>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        className="quick-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ marginBottom: '3rem' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--gray-dark)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={action.path} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-header">
                  <div className="card-icon" style={{ background: action.color }}>
                    {action.icon}
                  </div>
                  <h3>{action.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ marginBottom: '3rem' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--gray-dark)' }}>
          Why Choose RechargeHub?
        </h2>
        <div className="grid grid-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <div className="card-header">
                <div className="card-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
              </div>
              <p style={{ color: 'var(--gray-medium)' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ 
          background: 'linear-gradient(135deg, var(--peach-primary), var(--peach-dark))',
          borderRadius: '20px',
          padding: '3rem 2rem',
          marginBottom: '3rem',
          color: 'white'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>
          Trusted by Millions
        </h2>
        <div className="grid grid-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              style={{ textAlign: 'center' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          textAlign: 'center',
          background: 'var(--white)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          boxShadow: '0 10px 40px var(--shadow)'
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: 'var(--gray-dark)' }}>
          Ready to Start Recharging?
        </h2>
        <p style={{ marginBottom: '2rem', color: 'var(--gray-medium)', fontSize: '1.1rem' }}>
          Join millions of users who trust RechargeHub for their mobile recharge needs
        </p>
        <Link to="/recharge" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem' }}>
          <Smartphone size={24} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
          Get Started Now
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;