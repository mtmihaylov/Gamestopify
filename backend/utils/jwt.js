// Create, send and save JWT in cookie
const sendToken = (user, statusCode, res) => {
  // Create JWT
  const token = user.getJwt()

  // Options for the cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user
  })
}

module.exports = sendToken;