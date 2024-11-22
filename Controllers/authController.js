require('dotenv').config({ path: './config.env' });  // Load the environment variables from the config.env file
const User = require('./../Models/userModel');  // Ensure the path is correct
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login Handler
exports.googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        // Extract user details from the token payload
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if not found
            user = await User.create({
                email,
                name,
                password: 'google_oauth', // Optional: Add a default or hashed password
                profilePicture: picture
            });
        }

        // Generate a JWT token for the user
        const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });

        // Send response back to the client
        res.status(200).json({
            status: 'success',
            token: jwtToken,
            user
        });
    } catch (err) {
        console.error('Google login error:', err);
        res.status(401).json({
            status: 'fail',
            message: 'Google authentication failed. Please try again.'
        });
    }
};

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_TEST,  // Use the EMAIL_TEST environment variable for authentication
        pass: process.env.EMAIL_PASS   // Use the EMAIL_PASS environment variable
    },
    debug: true,
    logger: true
});

// Email sending logic for signup
exports.signup = async (req, res, next) => {
    try {
        // Create a new user
        const newUser = await User.create(req.body);

        // Generate the JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });

        // Mail options for sending email to the newly created user
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender address
            to: newUser.email,   // Dynamically using the new user's email
            subject: 'Welcome to Our Hotel Management System',
            text: `Hi ${newUser.name},\n\nThank you for signing up. We are excited to have you onboard!`
        };

        console.log('Sending email with options:', mailOptions);

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info);
            }
        });

        // Send response back to client
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        console.error('Error during signup:', err);
        next(err);
    }
};

// Login function with email notification
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new CustomError('Please enter email or password to login');
            return next(error);
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePasswordInDb(password, user.password))) {
            const error = new CustomError('Incorrect email or password', 400);
            return next(error);
        }

        // Generate the JWT token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });

        // Mail options for sending email to the user on successful login
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender address
            to: user.email,   // Dynamically using the user's email
            subject: 'Successful Login to Our Hotel Management System',
            text: `Hi ${user.name},\n\nYou have successfully logged into our system. If this was not you, please contact support immediately.`
        };

        console.log('Sending email with options:', mailOptions);

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info);
            }
        });

        // Send response back to client
        res.status(200).json({
            status: 'success',
            token,
            user
        });
    } catch (err) {
        next(err);
    }
};
