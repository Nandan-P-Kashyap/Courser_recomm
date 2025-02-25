const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
require("dotenv").config();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const bcrypt = require('bcrypt');

const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true }, 
  phno: { type: String, required: true },  // Changed Number → String
  password: { type: String, required: true }  // Added `required: true`
});


const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

// Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
//mongoose.connect("mongodb+srv://nandanpkec21:7qvpgFqFgMYDAZC8@cluster0.bmslc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connect("mongodb+srv://nandanpkec21:7qvpgFqFgMYDAZC8@cluster0.bmslc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Connected to MongoDB ✅"))
.catch(err => console.error("Error connecting to MongoDB:", err));

app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  function callback(admin) {
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }

  }
  Admin.findOne({ username }).then(callback);
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, email, phno, password } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    return res.status(403).json({ message: 'User already exists' });
  }

  // Hash password before saving to DB
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ 
    username, 
    email, 
    phno, 
    password: hashedPassword  // Store hashed password
  });

  await newUser.save();

  const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'User created successfully', token });
});


app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(403).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(403).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });

  res.json({ message: 'Logged in successfully', token });
});


app.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({published: true});
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
