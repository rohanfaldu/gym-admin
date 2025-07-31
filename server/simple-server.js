import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-super-secret-jwt-key-here';

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Simple admin user
const adminUser = {
  id: '1',
  email: 'admin@gymfinder.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SBBzXSBub', // admin123
  name: 'Super Admin',
  role: 'super_admin'
};

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'GymFinder API Server', status: 'running' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email !== adminUser.email) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Checking password...');
    const validPassword = await bcrypt.compare(password, adminUser.password);
    
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password valid, generating token...');
    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = {
      token,
      user: { 
        id: adminUser.id, 
        email: adminUser.email, 
        name: adminUser.name, 
        role: adminUser.role 
      }
    };

    console.log('Login successful, sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
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

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  console.log('Dashboard stats requested by:', req.user.email);
  res.json({
    stats: {
      totalGyms: 82,
      activeGyms: 75,
      totalMembers: 1247,
      totalRevenue: 156780
    },
    recentActivities: [
      {
        id: '1',
        action: 'CREATE_GYM',
        details: 'Created gym: FitZone Premium',
        createdAt: new Date().toISOString(),
        gym: { name: 'FitZone Premium' }
      }
    ]
  });
});

// Gyms endpoint
app.get('/api/gyms', authenticateToken, (req, res) => {
  const gyms = [
    {
      id: '1',
      name: 'FitZone Premium',
      email: 'admin@fitzone.com',
      gymCode: '123456',
      location: 'Downtown District',
      city: 'New York',
      phone: '+1 (555) 123-4567',
      description: 'Premium fitness facility',
      services: ['Personal Training', 'Group Classes'],
      amenities: ['Pool', 'Sauna'],
      workingHours: '5:00 AM - 11:00 PM',
      priceRange: '$$$',
      category: 'Premium',
      isActive: true,
      createdAt: new Date().toISOString(),
      _count: { members: 245, subscriptions: 3 }
    }
  ];
  res.json(gyms);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('🔐 Admin credentials: admin@gymfinder.com / admin123');
  console.log('📊 Dashboard will be available after login');
});