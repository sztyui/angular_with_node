const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'eg_a_napmelegtol_a_kopar_szik_sarja_tikkadt_szocskenyajak_legelesznek_rajta');
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }
}