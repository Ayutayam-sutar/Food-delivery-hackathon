import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Simulate real-time data updates
    const dashboardData = {
      totalOrders: user.dashboardData.totalOrders + Math.floor(Math.random() * 5),
      revenue: user.dashboardData.revenue + Math.floor(Math.random() * 1000),
      activeSuppliers: user.dashboardData.activeSuppliers,
      inventoryItems: user.dashboardData.inventoryItems + Math.floor(Math.random() * 10),
      recentActivity: [
        ...user.dashboardData.recentActivity,
        {
          action: 'Dashboard Accessed',
          details: 'User viewed dashboard data',
          timestamp: new Date()
        }
      ].slice(-10), // Keep only last 10 activities
      businessName: user.businessName,
      userName: user.name,
      lastLogin: user.lastLogin
    };

    // Update user's dashboard data
    user.dashboardData = dashboardData;
    await user.save();

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      totalLogins: Math.floor(Math.random() * 50) + 10,
      averageOrderValue: Math.floor(user.dashboardData.revenue / Math.max(user.dashboardData.totalOrders, 1)),
      growthRate: (Math.random() * 20 + 5).toFixed(1) + '%',
      topSuppliers: [
        { name: 'Fresh Foods Co.', orders: Math.floor(Math.random() * 50) + 20 },
        { name: 'Quality Ingredients Ltd.', orders: Math.floor(Math.random() * 40) + 15 },
        { name: 'Local Farm Supplies', orders: Math.floor(Math.random() * 30) + 10 }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// Update dashboard preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user preferences (you can extend the User model to include preferences)
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
});

export default router;
