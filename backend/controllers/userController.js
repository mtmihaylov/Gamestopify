const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const user = require('../models/user');
const sendToken = require('../utils/jwt');

// Register a user on api/v1/register
exports.registerUser = catchAsyncErrors( async ( req, res, next ) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'avatars/130097_emwjwm',
      url: 'https://res.cloudinary.com/best-cloud/image/upload/v1645453725/avatars/130097_emwjwm.jpg'
    }
  })

  sendToken(user, 200, res);
});

// Login user on api/v1/login
exports.loginUser = catchAsyncErrors( async(req, res, next) => {
  const { email, password } = req.body;

  // Check if fields are entered
  if (!email) {
    return next(new ErrorHandler('Please enter email', 400))
  } else if (!password) {
    return next(new ErrorHandler('Please enter password', 400))
  }

  // Does user exist
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  sendToken(user, 200, res);
});