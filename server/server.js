import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import nodemailer from 'nodemailer';
import * as cheerio from 'cheerio';
import PDFDocument from 'pdfkit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin:[
  'https://zhezu.onrender.com',
  'http://localhost:5173',
  'https://zhezu-front.onrender.com/',
  'http://localhost:5000'

],
  credentials: true,
}));
app.use(express.json());



// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/documents';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
  secure: true, // true для 465, false для других портов
  auth: {
    user: process.env.SMTP_USER || 'your_email@gmail.com',
    pass: process.env.SMTP_PASS || 'your_app_password'
  }
});
const sendApplicationStatusEmail = async (to, studentName, status, application) => {
  const statusLabels = {
    draft: 'Черновик',
    submitted: 'Подана',
    under_review: 'На рассмотрении',
    accepted: 'Принята',
    rejected: 'Отклонена'
  };
  const subject = `Обновление статуса заявки - ${statusLabels[status]}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Талапкер ЖеЗУ</h1>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Уважаемый(ая) ${studentName}!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Статус вашей заявки изменился: <strong>${statusLabels[status]}</strong>
        </p>
        <p style="font-size: 14px; color: #888; margin-top: 30px;">
          Если у вас есть вопросы, обращайтесь в приемную комиссию:<br>
          📧 admission@zhezu.edu.kz<br>
          📞 +7 (7282) 23-88-49
        </p>
      </div>
      <div style="background: #333; padding: 20px; text-align: center;">
        <p style="color: #ccc; margin: 0; font-size: 12px;">
          © 2024 Западно-Казахстанский Университет имени М. Утемисова
        </p>
      </div>
    </div>
  `;
console.log('Sending email to:', to, 'subject:', subject);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Талапкер ЖеЗУ" <your_email@gmail.com>',
    to,
    subject,
    html
  });
};
// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://inzuakylbekova:8520@cluster0.zm4mb6o.mongodb.net/Proect';
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
     
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Speciality Schema
const specialitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameKk: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  faculty: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    enum: ['bachelor', 'master', 'phd'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  language: {
    type: [String],
    enum: ['kk', 'ru', 'en'],
    required: true
  },
  tuitionFee: {
    type: Number,
    required: true
  },
  grantPlaces: {
    type: Number,
    required: true
  },
  paidPlaces: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  subjects: {
    type: [String],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Speciality = mongoose.model('Speciality', specialitySchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialities: [{
    specialityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speciality',
      required: true
    },
    priority: {
      type: Number,
      required: true
    }
  }],
  personalInfo: {
    iin: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    parentName: {
      type: String,
      required: true
    },
    parentPhone: {
      type: String,
      required: true
    }
  },
  entResults: {
    totalScore: Number,
    subjects: [{
      name: String,
      score: Number
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
    default: 'draft'
  },
  submittedAt: {
    type: Date
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model('Application', applicationSchema);

// News Schema
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleKk: {
    type: String,
    required: true,
    trim: true
  },
  titleEn: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentKk: {
    type: String,
    required: true
  },
  contentEn: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['admission', 'academic', 'events', 'announcements'],
    required: true
  },
  tags: [{
    type: String
  }],
  image: {
    filename: String,
    originalName: String,
    path: String
  },
  isPublished: {
    type: Boolean,
    default: true 
  },
  publishedAt: {
    type: Date
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model('News', newsSchema);

// Question Schema for Tests
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  questionKk: {
    type: String,
    required: true
  },
  questionEn: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    textKk: {
      type: String,
      required: true
    },
    textEn: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      default: 1
    }
  }],
  category: {
    type: String,
    enum: ['personality', 'interests', 'skills', 'values'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);

// Test Result Schema (updated)
const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOption: Number,
    category: String,
    weight: Number
  }],
  categoryScores: {
    type: Map,
    of: Number,
    required: true
  },
  recommendedSpecialities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speciality'
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  answeredQuestions: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const TestResult = mongoose.model('TestResult', testResultSchema);

// Chat Message Schema (updated)
const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['admission', 'specialities', 'grants', 'general'],
    default: 'general'
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Phone verification helper
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 
          'Пользователь с таким email уже существует' : 
          'Пользователь с таким номером телефона уже существует'
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create new user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password,
      verificationCode
    });

    await user.save();

    // In real app, send SMS with verification code
    console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Пользователь зарегистрирован. Проверьте SMS для подтверждения номера.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.post('/api/auth/verify-phone', authenticateToken, async (req, res) => {
  try {
    const { verificationCode } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Неверный код подтверждения' });
    }

    user.isPhoneVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: 'Номер телефона успешно подтвержден' });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -verificationCode');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login can be email or phone

    // Find user by email or phone
    const user = await User.findOne({ 
      $or: [{ email: login }, { phoneNumber: login }] 
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Specialities Routes
app.get('/api/specialities', async (req, res) => {
  try {
    const { faculty, degree, language } = req.query;
    const filter = { isActive: true };
    if (faculty) filter.faculty = faculty;
    if (degree) filter.degree = degree;
    if (language) filter.language = { $in: [language] };
    const specialities = await Speciality.find(filter).sort({ name: 1 });
    res.json(specialities);
  } catch (error) {
    console.error('Get specialities error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.put('/api/admin/applications/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, reviewedAt: new Date(), reviewedBy: req.user.userId },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Здесь вызывайте функцию отправки email
    await sendApplicationStatusEmail(application.userId.email, application.userId.fullName, status, application);

    res.json({ message: 'Статус заявки обновлен' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.post('/api/admin/specialities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const speciality = new Speciality(req.body);
    await speciality.save();
    res.status(201).json({ message: 'Специальность создана', speciality });
  } catch (error) {
    console.error('Create speciality error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/admin/specialities/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const speciality = await Speciality.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!speciality) {
      return res.status(404).json({ message: 'Специальность не найдена' });
    }
    
    res.json({ message: 'Специальность обновлена', speciality });
  } catch (error) {
    console.error('Update speciality error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.delete('/api/admin/specialities/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const speciality = await Speciality.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!speciality) {
      return res.status(404).json({ message: 'Специальность не найдена' });
    }
    
    res.json({ message: 'Специальность деактивирована' });
  } catch (error) {
    console.error('Delete speciality error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password -verificationCode').sort({ createdAt: -1 });
    // Можно добавить фильтрацию/пагинацию по необходимости
    res.json({ users });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
// Applications Routes
app.post('/api/applications', authenticateToken, async (req, res) => {
  try {
    let applicationData = req.body;
    if (req.body.applicationData) {
      applicationData = JSON.parse(req.body.applicationData);
    }

    if (
      !applicationData.personalInfo ||
      !applicationData.specialities ||
      !applicationData.entResults
    ) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
    }

    // УДАЛЕНО: const documents = {};

    // Создание заявки без documents
    const application = new Application({
      userId: req.user.userId,
      ...applicationData
    });

    await application.save();

    res.status(201).json({
      message: 'Заявка создана успешно',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/applications/my', authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('specialities.specialityId')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/applications/:id/submit', authenticateToken, async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { 
        status: 'submitted',
        submittedAt: new Date()
      },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }
    
    res.json({ message: 'Заявка подана на рассмотрение' });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Admin Applications Routes
app.get('/api/admin/applications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    
    const applications = await Application.find(filter)
      .populate('userId', 'fullName email phoneNumber')
      .populate('specialities.specialityId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Application.countDocuments(filter);
    
    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin applications error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/admin/applications/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.user.userId,
        $push: comment ? {
          comments: {
            text: comment,
            author: req.user.userId
          }
        } : {}
      },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    // Добавьте вызов здесь:
    await sendApplicationStatusEmail(application.userId.email, application.userId.fullName, status, application);

    res.json({ message: 'Статус заявки обновлен' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// News Routes
app.get('/api/news', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = { isPublished: true };
    
    if (category) filter.category = category;
    
    const news = await News.find(filter)
      .populate('author', 'fullName')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await News.countDocuments(filter);
    
    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'fullName');
    
    if (!news || !news.isPublished) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    
    // Increment views
    news.views += 1;
    await news.save();
    
    res.json(news);
  } catch (error) {
    console.error('Get news by id error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Admin News Routes
app.post('/api/admin/news', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const newsData = req.body;
    
    if (req.file) {
      newsData.image = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }
    // Принудительно публикуем новость
    newsData.status = 'published';
    newsData.isPublished = true;
    newsData.publishedAt = new Date();
    const news = new News({
      ...newsData,
      author: req.user.userId
    });
    
    await news.save();
    
    res.status(201).json({ message: 'Новость создана', news });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/admin/news/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const newsData = req.body;
    
    if (req.file) {
      newsData.image = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }
    // Принудительно публикуем новость
    newsData.status = 'published';
    newsData.isPublished = true;
    newsData.publishedAt = new Date();

    const news = await News.findByIdAndUpdate(
      req.params.id,
      newsData,
      { new: true }
    );
    
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    
    res.json({ message: 'Новость обновлена', news });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/admin/news/:id/publish', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { 
        isPublished: true,
        publishedAt: new Date()
      },
      { new: true }
    );
    
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    
    res.json({ message: 'Новость опубликована' });
  } catch (error) {
    console.error('Publish news error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Questions Routes
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true }).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.post('/api/admin/questions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json({ message: 'Вопрос создан', question });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/admin/questions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!question) {
      return res.status(404).json({ message: 'Вопрос не найден' });
    }
    
    res.json({ message: 'Вопрос обновлен', question });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.get('/api/test/history', authenticateToken, async (req, res) => {
  try {
    const tests = await TestResult.find({ userId: req.user.userId }).sort({ completedAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения истории тестов' });
  }
});
// Test Routes (updated)
app.post('/api/test/submit', authenticateToken, async (req, res) => {
  try {
    const { answers, categoryScores, totalQuestions, answeredQuestions } = req.body;

    // Get recommended specialities based on results
    const topCategories = Object.entries(categoryScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([category]) => category);

    const recommendedSpecialities = await Speciality.find({
      isActive: true,
      // Add logic to match categories with specialities
    }).limit(5);
const testResult = new TestResult({
  userId: req.user.userId,
  answers,
  categoryScores: new Map(Object.entries(categoryScores)),
  recommendedSpecialities: recommendedSpecialities.map(s => s._id),
  totalQuestions,
  answeredQuestions,
  completedAt: new Date()
});
await testResult.save();

    res.json({
      message: 'Результаты теста сохранены',
      resultId: testResult._id,
      recommendedSpecialities
    });
  } catch (error) {
    console.error('Test submission error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Chat Routes (updated)
async function fetchBachelorPrograms() {
  const url = 'https://zhezu.edu.kz/ru/bachelor-program/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const programs = [];
  $('.program-card, .bachelor-program__item').each((i, el) => {
    programs.push({
      title: $(el).find('.program-card__title, .bachelor-program__title').text().trim(),
      desc: $(el).find('.program-card__desc, .bachelor-program__desc').text().trim(),
      link: $(el).find('a').attr('href')
    });
  });
  return programs;
}

async function fetchAdmissionRules() {
  const url = 'https://zhezu.edu.kz/ru/admission-rules/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  // Можно возвращать основной текст или структурировать по разделам
  return $('.content, .admission-rules').text().trim();
}

async function fetchTuitionFees() {
  const url = 'https://zhezu.edu.kz/ru/tuition-fees/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  // Пример: ищем таблицу с ценами
  const fees = [];
  $('table tr').each((i, el) => {
    const cols = $(el).find('td');
    if (cols.length >= 2) {
      fees.push({
        program: $(cols[0]).text().trim(),
        price: $(cols[1]).text().trim()
      });
    }
  });
  return fees;
}
async function fetchAdmissionCommitteeInfo() {
  const url = 'https://zhezu.edu.kz/ru/admission-committee/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  // Пример: получить основной текст или важные блоки
  const info = $('.content, .admission-committee').text().trim();
  return info || 'Не удалось получить информацию о сроках и порядке подачи документов. Пожалуйста, посетите https://zhezu.edu.kz/ru/admission-committee/';
}
// --- Интеграция в чат-бота ---
const generateEnhancedBotResponse = async (message) => {
  const lower = message.toLowerCase();
 // 1. Вопросы о сроках подачи документов
  if (
    lower.includes('когда подавать документы') ||
    lower.includes('сроки подачи документов') ||
    lower.includes('дедлайн') ||
    lower.includes('прием документов')
  ) {
    const info = await fetchAdmissionCommitteeInfo();
    return info.length > 1000
      ? info.slice(0, 1000) + '... Подробнее: https://zhezu.edu.kz/ru/admission-committee/'
      : info;
  }
  // 1. Ключевые вопросы — только парсер!
  if (lower.includes('специальност')) {
    const programs = await fetchBachelorPrograms();
    if (programs.length) {
      return 'Список специальностей ЖезУ:\n' + programs.map(p => `• ${p.title}`).join('\n');
    }
    return 'Не удалось получить список специальностей.';
  }
  if (lower.includes('правила поступлен')) {
    const rules = await fetchAdmissionRules();
    return rules ? `Правила поступления в ЖезУ:\n${rules.slice(0, 1000)}...` : 'Не удалось получить правила поступления.';
  }
  if (lower.includes('стоимость') || lower.includes('цена')) {
    const fees = await fetchTuitionFees();
    if (fees.length) {
      return 'Стоимость обучения в ЖезУ:\n' + fees.map(f => `${f.program}: ${f.price}`).join('\n');
    }
    return 'Не удалось получить стоимость обучения.';
  }

  // 2. Фильтрация нерелевантных тем
  const forbiddenWords = [
    'visa', 'виза', 'capacity building', 'wechat', 'facebook', 'платная реклама', 'ad', 'реклама'
  ];
  if (forbiddenWords.some(w => lower.includes(w))) {
    return 'Пожалуйста, задавайте вопросы, связанные с поступлением в Жезказганский университет (ZheZU), расположенный в Казахстане.';
  }

  // 3. Общий шаблон для остальных вопросов
  return "Пожалуйста, уточните ваш вопрос о поступлении, специальностях или обучении в Жезказганском университете (ZheZU).";
};

// В /api/chat/message используйте await generateEnhancedBotResponse(message)
app.post('/api/chat/message', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await generateEnhancedBotResponse(message);
    const category = categorizeMessage(message);

    const chatMessage = new ChatMessage({
      userId: req.user.userId,
      message,
      response,
      category
    });

    await chatMessage.save();

    res.json({
      message: 'Сообщение обработано',
      response,
      category
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Helper functions
const categorizeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('специальность') || lowerMessage.includes('программа')) {
    return 'specialities';
  } else if (lowerMessage.includes('грант') || lowerMessage.includes('стипендия')) {
    return 'grants';
  } else if (lowerMessage.includes('поступление') || lowerMessage.includes('документы')) {
    return 'admission';
  }
  
  return 'general';
};
app.post('/api/test/generate-pdf', authenticateToken, async (req, res) => {
  try {
    const { categoryScores, totalQuestions, answeredQuestions } = req.body;
    // 1. Генерируем PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // 2. Сохраняем PDF в БД (например, в TestResult)
      const testResult = await TestResult.findOneAndUpdate(
        { userId: req.user.userId },
        { pdfBuffer },
        { new: true }
      );

      // 3. Отправляем PDF клиенту
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-results.pdf"',
      });
      res.send(pdfBuffer);
    });

    // Пример простого PDF (добавьте графики через svg/png или html-to-pdf)
    doc.fontSize(20).text('Результаты теста', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Всего вопросов: ${totalQuestions}`);
    doc.text(`Отвечено: ${answeredQuestions}`);
    doc.moveDown();
    Object.entries(categoryScores).forEach(([cat, score]) => {
      doc.text(`${cat}: ${score}`);
    });
    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка генерации PDF' });
  }
});
app.get('/api/test/pdf/:id', authenticateToken, async (req, res) => {
  const testResult = await TestResult.findById(req.params.id);
  if (!testResult || !testResult.pdfBuffer) {
    return res.status(404).send('PDF не найден');
  }
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="test-results.pdf"',
  });
  res.send(testResult.pdfBuffer);
});

// Admin Routes (updated)
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalApplications: await Application.countDocuments(),
      pendingApplications: await Application.countDocuments({ status: 'submitted' }),
      totalSpecialities: await Speciality.countDocuments({ isActive: true }),
      totalNews: await News.countDocuments({ isPublished: true }),
      totalQuestions: await Question.countDocuments({ isActive: true })
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'mistralai/mistral-7b-instruct', // или другую бесплатную модель
    messages,
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

    res.json(response.data);
  } catch (error) {
    console.error('GPT API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch GPT response' });
  }
});
app.use('/uploads', express.static('uploads'));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

// 404 handler для API (только для /api)
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Статика
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all для SPA (только после всех API и статики!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});