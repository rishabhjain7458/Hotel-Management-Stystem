const CustomError = require('../customError.js');
const User = require('./../Models/userModel.js');
const jwt = require("jsonwebtoken");

exports.signup = async(req, res, next) => {
    try {
        const newUser = await User.create(req.body);

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async(req, res, next) => {
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

        const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });

        res.status(200).json({
            status: 'success',
            token,
            user
        });
    } catch (err) {
        next(err);
    }
};
