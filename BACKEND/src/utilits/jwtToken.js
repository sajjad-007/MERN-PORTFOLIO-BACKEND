const generateToken = (user, statusCode, res, message) => {
  const token = user.generateJsonWebToken();
  res
    .status(statusCode)
    .cookie('token', token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

module.exports = { generateToken };
