const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const taskRoutes = require('./api/routes/tasks');
const LoginRoutes = require('./api/routes/login');
const artChildRoutes = require('./api/routes/artchild');
const artVolunteerRoutes = require('./api/routes/artvolunteer');
const userInfoRoutes = require('./api/routes/userinfo');
const WhyToJoinRoutes = require('./api/routes/WhyToJoin');
const galleryRoutes = require('./api/routes/gallery');

const mongoURI = 'PASTE_YOUR_MONGODB_URI_HERE';

mongoose.connect(mongoURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.header("Access-Control-ALlow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
}
next();
});

//Routes handling request
app.use('/tasks', taskRoutes);
app.use('/login', LoginRoutes);
app.use('/artchild', artChildRoutes);
app.use('/artvolunteer', artVolunteerRoutes);
app.use('/userinfo', userInfoRoutes);
app.use('/whytojoin', WhyToJoinRoutes);
app.use('/gallery', galleryRoutes);

app.use((req, res, next) => {
    const error = new Error("NOT FOUND");
    error.status(404);
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app; 