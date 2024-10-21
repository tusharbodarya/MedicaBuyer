const express = require('express');
const connectDB = require('./config/db');
const setupSwagger = require('./swagger');
const authApiRoutes = require('./routes/api/authRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authRoutes = require('./routes/admin/authRoutes');
const dashboardRoutes = require('./routes/admin/dashboardRoutes');
const categoryRoutes = require('./routes/admin/categoryRoutes');
const subCategoryRoutes = require('./routes/admin/subCategoryRoutes');
const reviewRoutes = require('./routes/admin/reviewRoutes');
const awardRoutes = require('./routes/admin/awardRoutes');
const productRoutes = require('./routes/admin/productRoutes');
const userRoutes = require('./routes/admin/userRoutes');
const vendorRoutes = require('./routes/admin/vendorRoutes');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

// Connect Database
connectDB();

dotenv.config();

const app = express();



app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/admin', authRoutes);
app.use('/vendor', vendorRoutes);
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/adminLayout');
app.set('views', path.join(__dirname, 'views'));
// Set static folder for public assets (CSS, JS, images)

app.use(express.static(__dirname + '/public/'));

// Body Parser Middleware

app.use('/uploads', express.static(__dirname + '/uploads/'));



// Admin Routes
app.use('/admin', dashboardRoutes);
app.use('/admin', categoryRoutes);
app.use('/admin', subCategoryRoutes);
app.use('/admin', reviewRoutes);
app.use('/admin', awardRoutes);
app.use('/admin', productRoutes);
app.use('/', userRoutes);




app.use(cors());
// Middleware
app.use(express.json());

app.use('/api/auth', authApiRoutes);

// Setup Swagger
setupSwagger(app);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));