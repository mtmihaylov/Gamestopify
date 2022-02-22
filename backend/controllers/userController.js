const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')

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

// Logout user on /api/v1/logout
exports.logout = catchAsyncErrors( async( req, res, next ) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "Successfully logged out!"
  })
});

// Reset password request on api/v1/password/reset
exports.resetPasswordRequest = catchAsyncErrors( async( req, res, next ) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found', 400));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset link is:\n\n${resetUrl}\n\nIf you haven't requested a password reset, contact us immediately.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Gamestopify password recovery',
      message
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`
    })
  } catch (error) {
    user.resetPasswordToken = undefined,
    user.resetPasswordExpire = undefined
    
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500))
  }
})

// Reset password on api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async( req, res, next ) => {
  // Hash URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) { return next(new ErrorHandler('Invalid or expired password reset token', 400)) }

  if (req.body.password !== req.body.confirmPassword) { 
    return next(new ErrorHandler('Password does not match', 400)) }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
})