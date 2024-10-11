const express = require('express');
const connectDB = require('./config/db');
const setupSwagger = require('./swagger');
const authApiRoutes = require('./routes/api/authRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authRoutes = require('./routes/admin/authRoutes');
const dashboardRoutes = require('./routes/admin/dashboardRoutes');
const categoryRoutes = require('./routes/admin/categoryRoutes');
const subCategoryRoutes = require('./routes/admin/subCategoryRoutes');
const reviewRoutes = require('./routes/admin/reviewRoutes');
const awardRoutes = require('./routes/admin/awardRoutes');
const productRoutes = require('./routes/admin/productRoutes');
const { isAuthenticated } = require('./middlewares/auth');
const expressLayouts = require('express-ejs-layouts');
const router = express.Router();

// Connect Database
connectDB();

dotenv.config();

const app = express();


app.use('/admin', authRoutes);

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/adminLayout');
app.set('views', path.join(__dirname, 'views'));
// Set static folder for public assets (CSS, JS, images)

app.use(express.static(__dirname + '/public/'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads', express.static(__dirname + '/uploads/'));
// app.use(session({ secret: 'd6ZR3uBzrQkqQNR1qJLS6fUwJAdDVVBi', resave: false, saveUninitialized: false }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());    

// passport.use(new LocalStrategy(
//     async (username, password, done) => {
//         const user = await User.findOne({ username });
//         if (!user) return done(null, false, { message: 'Incorrect username.' });
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) return done(null, false, { message: 'Incorrect password.' });
//         return done(null, user);
//     }
// ));

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//     const user = await User.findById(id);
//     done(null, user);
// });


// Admin Routes
app.use('/admin', dashboardRoutes);
app.use('/admin', categoryRoutes);
app.use('/admin', subCategoryRoutes);
app.use('/admin', reviewRoutes);
app.use('/admin', awardRoutes);
app.use('/admin', productRoutes);




app.use(cors());
// Middleware
app.use(express.json());

app.use('/api/auth', authApiRoutes);

// Setup Swagger
setupSwagger(app);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));