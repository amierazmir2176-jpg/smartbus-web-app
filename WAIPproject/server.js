const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());

// CORS setup for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // For production, replace '' with your frontend URL
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Database file path (absolute path)
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database with sample data
function initializeDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          user_id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@email.com",
          password: "password123",
          phone_no: "0123456789",
          DOB: "1990-05-15",
          created_at: new Date().toISOString()
        }
      ],
      routes: [
        {
          route_id: 1,
          route_name: "KL to Penang Express",
          origin: "Kuala Lumpur",
          destination: "Penang",
          duration: "04:30:00",
          created_at: new Date().toISOString()
        },
        {
          route_id: 2,
          route_name: "JB to Melaka Coastal", 
          origin: "Johor Bahru",
          destination: "Melaka",
          duration: "03:00:00",
          created_at: new Date().toISOString()
        }
      ],
      schedules: [
        {
          schedule_id: 1,
          route_id: 1,
          driver_id: 1,
          departure_time: "2024-12-01 08:00:00",
          arrival_time: "2024-12-01 12:30:00",
          available_seats: 50,
          created_at: new Date().toISOString()
        }
      ],
      bookings: [],
      drivers: [
        {
          driver_id: 1,
          driver_name: "Test Driver",
          phone: "0123456789", 
          license_no: "TEST123",
          vehicle_plate: "TEST001",
          status: "active",
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('Database initialized with sample data!');
  }
}

// Helper functions
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function updateDB(updateFn) {
  const data = readDB();
  updateFn(data);
  writeDB(data);
}

// ===== API ENDPOINTS =====

// Test endpoint
app.get('/', (req, res) => {
  res.send('SmartBus backend is running!');
});

// Get all routes
app.get('/getroutes', (req, res) => {
  try {
    const data = readDB();
    res.json(data.routes);
  } catch (error) {
    res.status(500).send('Failed to get routes');
  }
});

// User registration
app.post('/register', (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_no, DOB } = req.body;
    if (!email || !password) return res.status(400).send('Email and password required');

    const data = readDB();
    const userExists = data.users.find(u => u.email === email);
    if (userExists) return res.status(400).send('Email already registered');

    const newUser = {
      user_id: Date.now(),
      first_name,
      last_name,
      email,
      password, // For production, hash with bcrypt
      phone_no,
      DOB,
      created_at: new Date().toISOString()
    };

    updateDB(d => d.users.push(newUser));

    console.log('New user registered:', newUser.email);
    res.send('Register success');
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send('Register failed');
  }
});

// User login
app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email and password required');

    const data = readDB();
    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log('User logged in:', email);
      res.send('Login success');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Login error');
  }
});

// Get all schedules
app.get('/schedules', (req, res) => {
  try {
    const data = readDB();
    res.json(data.schedules);
  } catch (error) {
    res.status(500).send('Failed to load schedules');
  }
});

// Create booking
app.post('/book', (req, res) => {
  try {
    const { user_id, schedule_id, seat_num, ticket_price } = req.body;
    if (!user_id || !schedule_id) return res.status(400).send('User ID and Schedule ID required');

    const newBooking = {
      booking_id: Date.now(),
      user_id,
      schedule_id,
      seat_num,
      ticket_price,
      status: "confirmed",
      created_at: new Date().toISOString()
    };

    updateDB(d => d.bookings.push(newBooking));
    console.log('New booking created for user:', user_id);
    res.send('Booking successful');
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).send('Booking failed');
  }
});

// Get user bookings
app.get('/bookings/:user_id', (req, res) => {
  try {
    const data = readDB();
    const userBookings = data.bookings.filter(b => b.user_id == req.params.user_id);
    res.json(userBookings);
  } catch (error) {
    res.status(500).send('Failed to get bookings');
  }
});

// Get all bookings (admin)
app.get('/all-bookings', (req, res) => {
  try {
    const data = readDB();
    res.json(data.bookings);
  } catch (error) {
    res.status(500).send('Failed to get all bookings');
  }
});

// ===== ADD THESE NEW ENDPOINTS =====

// Get booking statistics for charts
app.get('/booking-stats', (req, res) => {
  try {
    const data = readDB();
    
    // Simple booking statistics by time of day
    const stats = {
      labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
      data: [12, 19, 3, 5] // Sample data
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).send('Failed to get booking stats');
  }
});

// Add new schedule (for admin panel)
app.post('/schedule', (req, res) => {
  try {
    const { route_name, route_description, time_slot, max_seats, price } = req.body;
    
    if (!route_name || !time_slot) {
      return res.status(400).send('Route name and time slot required');
    }

    const newSchedule = {
      schedule_id: Date.now(),
      route_name,
      route_description: route_description || '',
      time_slot,
      max_seats: parseInt(max_seats) || 50,
      price: parseFloat(price) || 0,
      available_seats: parseInt(max_seats) || 50,
      created_at: new Date().toISOString()
    };

    updateDB(d => d.schedules.push(newSchedule));
    
    console.log('New schedule added:', route_name);
    res.send('Schedule added successfully');
  } catch (error) {
    console.error('Schedule error:', error);
    res.status(500).send('Add schedule failed');
  }
});

// Admin login
app.post('/admin-login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      console.log('Admin logged in');
      res.send('Admin login success');
    } else {
      res.status(401).send('Invalid admin credentials');
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).send('Admin login failed');
  }
});

// ===== END OF NEW ENDPOINTS =====

// Initialize database and start server
initializeDatabase();
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));

// Initialize database and start server
initializeDatabase();
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));