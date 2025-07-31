import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const PORT = process.env.PORT || 3001;

const app = express();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('📝 Make sure PostgreSQL is running and DATABASE_URL is correct');
    process.exit(1);
  }
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0 && !req.path.includes('login')) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ==================== AUTH ROUTES ====================

// Super Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name, 
        role: admin.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Gym Admin Login
app.post('/api/gym-auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const gym = await prisma.gym.findUnique({
      where: { email }
    });

    if (!gym) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, gym.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: gym.id, 
        email: gym.email, 
        role: 'gym_admin',
        gymId: gym.id 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { 
        id: gym.id, 
        email: gym.email, 
        name: gym.name, 
        role: 'gym_admin',
        gymId: gym.id,
        gymName: gym.name
      }
    });
  } catch (error) {
    console.error('Gym admin login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const totalGyms = await prisma.gym.count();
    const activeGyms = await prisma.gym.count({ where: { isActive: true } });
    const totalMembers = await prisma.member.count();
    const totalRevenue = await prisma.revenue.aggregate({
      _sum: { amount: true }
    });

    const recentActivities = await prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { gym: { select: { name: true } } }
    });

    res.json({
      stats: {
        totalGyms,
        activeGyms,
        totalMembers,
        totalRevenue: totalRevenue._sum.amount || 0
      },
      recentActivities
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== GYM MANAGEMENT ROUTES ====================

app.get('/api/gyms', authenticateToken, async (req, res) => {
  try {
    const gyms = await prisma.gym.findMany({
      include: {
        _count: {
          select: {
            members: true,
            subscriptions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const gymsWithParsedArrays = gyms.map(gym => ({
      ...gym,
      services: JSON.parse(gym.services || '[]'),
      amenities: JSON.parse(gym.amenities || '[]')
    }));
    
    res.json(gymsWithParsedArrays);
  } catch (error) {
    console.error('Get gyms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/gyms', authenticateToken, async (req, res) => {
  try {
    const {
      name, email, location, city, phone, description,
      services, amenities, workingHours, priceRange, category
    } = req.body;

    const gymCode = Math.floor(100000 + Math.random() * 900000).toString();
    const password = await bcrypt.hash('gym123', 10);

    const gym = await prisma.gym.create({
      data: {
        name,
        email,
        password,
        gymCode,
        location,
        city,
        phone,
        description,
        services: JSON.stringify(services || []),
        amenities: JSON.stringify(amenities || []),
        workingHours,
        priceRange,
        category
      }
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE_GYM',
        details: `Created gym: ${name}`,
        userType: 'admin',
        userId: req.user.id,
        gymId: gym.id
      }
    });

    res.json(gym);
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/gyms/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.services) {
      updateData.services = JSON.stringify(updateData.services);
    }
    if (updateData.amenities) {
      updateData.amenities = JSON.stringify(updateData.amenities);
    }

    const gym = await prisma.gym.update({
      where: { id },
      data: updateData
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE_GYM',
        details: `Updated gym: ${gym.name}`,
        userType: 'admin',
        userId: req.user.id,
        gymId: gym.id
      }
    });

    res.json(gym);
  } catch (error) {
    console.error('Update gym error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/gyms/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const gym = await prisma.gym.findUnique({ where: { id } });
    await prisma.gym.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE_GYM',
        details: `Deleted gym: ${gym.name}`,
        userType: 'admin',
        userId: req.user.id
      }
    });

    res.json({ message: 'Gym deleted successfully' });
  } catch (error) {
    console.error('Delete gym error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== BILLING ROUTES ====================

app.get('/api/billing', authenticateToken, async (req, res) => {
  try {
    const billings = await prisma.billing.findMany({
      include: {
        gym: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(billings);
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/billing', authenticateToken, async (req, res) => {
  try {
    const { gymId, amount, description, dueDate } = req.body;

    const billing = await prisma.billing.create({
      data: {
        gymId,
        amount,
        description,
        dueDate: new Date(dueDate)
      }
    });

    res.json(billing);
  } catch (error) {
    console.error('Create billing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== SUPPORT ROUTES ====================

app.get('/api/support/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        gym: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/support/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: { status }
    });

    res.json(ticket);
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ACTIVITY LOGS ====================

app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        gym: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/logs/export', authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        gym: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=activity-logs.json');
    res.json(logs);
  } catch (error) {
    console.error('Export logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== GYM ADMIN ROUTES ====================

// Members Management
app.get('/api/gym/:gymId/members', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const members = await prisma.member.findMany({
      where: { gymId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/gym/:gymId/members', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const { name, email, phone, status } = req.body;

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        gymId,
        status
      }
    });

    res.json(member);
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/gym/:gymId/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const member = await prisma.member.update({
      where: { id },
      data: updateData
    });

    res.json(member);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/gym/:gymId/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.member.delete({ where: { id } });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Subscriptions Management
app.get('/api/gym/:gymId/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const subscriptions = await prisma.subscription.findMany({
      where: { gymId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/gym/:gymId/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const { planName, price, duration, features, description } = req.body;

    const subscription = await prisma.subscription.create({
      data: {
        gymId,
        planName,
        price,
        duration,
        features: JSON.stringify(features || []),
        startDate: new Date(),
        endDate: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000)
      }
    });

    res.json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/gym/:gymId/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.features) {
      updateData.features = JSON.stringify(updateData.features);
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: updateData
    });

    res.json(subscription);
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/gym/:gymId/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.subscription.delete({ where: { id } });
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Trainers Management
app.get('/api/gym/:gymId/trainers', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const trainers = await prisma.trainer.findMany({
      where: { gymId },
      orderBy: { name: 'asc' }
    });
    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/gym/:gymId/trainers', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const { name, email, phone, specialty, experience } = req.body;

    const trainer = await prisma.trainer.create({
      data: {
        name,
        email,
        phone,
        specialty,
        experience,
        gymId
      }
    });

    res.json(trainer);
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Classes Management
app.get('/api/gym/:gymId/classes', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const classes = await prisma.class.findMany({
      where: { gymId },
      include: {
        trainer: { select: { name: true, specialty: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/gym/:gymId/classes', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const { name, time, duration, day, capacity, trainerId } = req.body;

    const gymClass = await prisma.class.create({
      data: {
        name,
        time,
        duration,
        day,
        capacity,
        trainerId,
        gymId
      },
      include: {
        trainer: { select: { name: true, specialty: true } }
      }
    });

    res.json(gymClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Revenue tracking
app.post('/api/gym/:gymId/revenue', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const { amount, source } = req.body;

    const revenue = await prisma.revenue.create({
      data: {
        gymId,
        amount,
        source,
        date: new Date()
      }
    });

    res.json(revenue);
  } catch (error) {
    console.error('Create revenue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/gym/:gymId/revenue', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    const revenues = await prisma.revenue.findMany({
      where: { gymId },
      orderBy: { date: 'desc' }
    });
    res.json(revenues);
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Gym Admin Dashboard Stats
app.get('/api/gym/:gymId/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const { gymId } = req.params;
    
    const totalMembers = await prisma.member.count({ where: { gymId } });
    const activeMembers = await prisma.member.count({ 
      where: { gymId, status: 'active' } 
    });
    const totalClasses = await prisma.class.count({ where: { gymId } });
    const monthlyRevenue = await prisma.revenue.aggregate({
      where: { 
        gymId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    });

    res.json({
      totalMembers,
      activeMembers,
      totalClasses,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      todayAttendance: Math.floor(Math.random() * 100) + 50, // Mock data
      pendingRequests: await prisma.member.count({ 
        where: { gymId, status: 'pending' } 
      })
    });
  } catch (error) {
    console.error('Gym dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('🔐 Admin credentials: admin@gymfinder.com / admin123');
  console.log('🏋️ Gym Admin credentials: admin@fitzone.com / gym123');
});