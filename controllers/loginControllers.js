const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const dotenv = require("dotenv");


dotenv.config();

const User = db.user;

module.exports =  logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password to login" });
    }

    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "15h" }
    );
    data = { name: user.name, email: user.email, accessToken: token };
    return res.status(200).json({ success: true, data: data, message: "Login successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Error in sign in" });
  }
};
