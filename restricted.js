module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(400).json({
      message: "no can do buckaroo"
    })
  }
}