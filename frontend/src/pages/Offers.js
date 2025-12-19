import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Percent, 
  Clock, 
  Star, 
  Copy,
  Check,
  Zap,
  Tag,
  TrendingUp,
  Users,
  Smartphone
} from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Offers', icon: <Gift /> },
    { id: 'cashback', name: 'Cashback', icon: <Percent /> },
    { id: 'bonus', name: 'Bonus', icon: <Star /> },
    { id: 'first-time', name: 'First Time', icon: <Users /> },
    { id: 'trending', name: 'Trending', icon: <TrendingUp /> }
  ];

  const mockOffers = [
    {
      id: 1,
      title: 'First Recharge Bonus',
      description: 'Get 20% extra on your first recharge of ₹100 or more',
      discount: '20%',
      code: 'FIRST20',
      category: 'first-time',
      validTill: '2024-12-31',
      minAmount: 100,
      maxDiscount: 50,
      featured: true,
      usedBy: 15420,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Weekend Cashback',
      description: 'Get 10% cashback on weekend recharges',
      discount: '10%',
      code: 'WEEKEND10',
      category: 'cashback',
      validTill: '2024-12-31',
      minAmount: 50,
      maxDiscount: 25,
      featured: false,
      usedBy: 8930,
      rating: 4.5
    },
    {
      id: 3,
      title: 'Mega Bonus Offer',
      description: 'Recharge ₹299 and get ₹50 extra talktime',
      discount: '₹50',
      code: 'MEGA50',
      category: 'bonus',
      validTill: '2024-12-25',
      minAmount: 299,
      maxDiscount: 50,
      featured: true,
      usedBy: 12340,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Daily Saver',
      description: 'Save 5% on every recharge above ₹200',
      discount: '5%',
      code: 'SAVE5',
      category: 'cashback',
      validTill: '2024-12-31',
      minAmount: 200,
      maxDiscount: 30,
      featured: false,
      usedBy: 25670,
      rating: 4.3
    },
    {
      id: 5,
      title: 'Super Saver Combo',
      description: 'Get 15% off on recharges above ₹500',
      discount: '15%',
      code: 'SUPER15',
      category: 'trending',
      validTill: '2024-12-28',
      minAmount: 500,
      maxDiscount: 100,
      featured: true,
      usedBy: 9870,
      rating: 4.9
    },
    {
      id: 6,
      title: 'Student Special',
      description: 'Special discount for students - 12% off',
      discount: '12%',
      code: 'STUDENT12',
      category: 'trending',
      validTill: '2024-12-31',
      minAmount: 150,
      maxDiscount: 40,
      featured: false,
      usedBy: 5430,
      rating: 4.6
    }
  ];

  useEffect(() => {
    setOffers(mockOffers);
  }, []);

  const filteredOffers = offers.filter(offer => 
    selectedCategory === 'all' || offer.category === selectedCategory
  );

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="offers-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
            Exclusive Offers
          </h1>
          <p style={{ color: 'var(--gray-medium)' }}>
            Save more with our amazing deals and cashback offers
          </p>
        </div>

        {/* Featured Offers Banner */}
        <motion.div
          className="featured-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, var(--peach-primary), var(--peach-dark))',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: 'white' }}>
            Limited Time Offers
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Don't miss out on these incredible deals!
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-icon">
              <Tag />
            </div>
            <h3>Filter by Category</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.8rem 1.2rem',
                  border: `2px solid ${selectedCategory === category.id ? 'var(--peach-primary)' : 'var(--peach-light)'}`,
                  borderRadius: '25px',
                  background: selectedCategory === category.id ? 'var(--peach-primary)' : 'white',
                  color: selectedCategory === category.id ? 'white' : 'var(--gray-dark)',
                  cursor: 'pointer',
                  fontWeight: '600',
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

        {/* Offers Grid */}
        <div className="grid grid-2">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{ 
                position: 'relative',
                background: offer.featured ? 'linear-gradient(135deg, var(--peach-light), var(--white))' : 'var(--white)'
              }}
            >
              {offer.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: 'var(--peach-accent)',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Star size={12} />
                  Featured
                </div>
              )}

              <div className="card-header">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  width: '100%'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
                      {offer.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Star size={14} color="var(--warning)" fill="var(--warning)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                          {offer.rating}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                        {offer.usedBy.toLocaleString()} used
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'var(--peach-primary)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '15px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {offer.discount}
                  </div>
                </div>
              </div>

              <p style={{ 
                color: 'var(--gray-medium)', 
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                {offer.description}
              </p>

              {/* Offer Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  padding: '0.8rem',
                  background: 'rgba(255, 176, 122, 0.1)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-dark)' }}>
                    Min Amount
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                    ₹{offer.minAmount}
                  </div>
                </div>

                <div style={{
                  padding: '0.8rem',
                  background: 'rgba(255, 176, 122, 0.1)',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-dark)' }}>
                    Max Discount
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--peach-dark)' }}>
                    ₹{offer.maxDiscount}
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div style={{
                background: 'var(--gray-light)',
                border: '2px dashed var(--peach-primary)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', marginBottom: '0.3rem' }}>
                      Promo Code
                    </div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      color: 'var(--peach-dark)',
                      fontFamily: 'monospace'
                    }}>
                      {offer.code}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyCode(offer.code)}
                    style={{
                      background: copiedCode === offer.code ? 'var(--success)' : 'var(--peach-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {copiedCode === offer.code ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode === offer.code ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
              </div>

              {/* Valid Till */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                color: 'var(--gray-medium)',
                fontSize: '0.9rem'
              }}>
                <Clock size={16} />
                Valid till {formatDate(offer.validTill)}
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  // Store offer data for recharge page
                  localStorage.setItem('selectedOffer', JSON.stringify({
                    code: offer.code,
                    discount: offer.discount,
                    minAmount: offer.minAmount,
                    maxDiscount: offer.maxDiscount,
                    title: offer.title
                  }));
                  
                  // Navigate to recharge page
                  window.location.href = '/recharge';
                }}
              >
                <Smartphone size={20} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
                Use This Offer
              </motion.button>
            </motion.div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--gray-medium)'
            }}
          >
            <Gift size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No offers found</h3>
            <p>Try selecting a different category</p>
          </motion.div>
        )}

        {/* Terms and Conditions */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '2rem' }}
        >
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-dark)' }}>
            Terms & Conditions
          </h3>
          <ul style={{ 
            color: 'var(--gray-medium)', 
            lineHeight: '1.6',
            paddingLeft: '1.5rem'
          }}>
            <li>Offers are valid for limited time only</li>
            <li>Cashback will be credited within 24 hours</li>
            <li>Offers cannot be combined with other promotions</li>
            <li>Minimum recharge amount applies as mentioned</li>
            <li>RechargeHub reserves the right to modify or cancel offers</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Offers;