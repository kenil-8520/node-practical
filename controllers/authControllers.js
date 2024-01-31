const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const multer = require("multer");
const path = require("path");

const dotenv = require("dotenv");

dotenv.config();

const User = db.user;

const logIn = async (req, res) => {
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

const Postcard = db.postcard;

const createPostCard = async (req, res) => {
    console.log(req.file);
  try {
    const { name, address, address2, city, state, zipcode, message, file } = req.body;

    if (!name || !address || !address2 || !city || !state || !zipcode || !message){
      return res.status(400).json({success: false,message:"Request body is empty provide name, address, city, state, zipcode, message and background image"});
    }

    const newProfile = await Postcard.create({
      recipient_name: name,
      street_1: address,
      street_2: address2,
      city: city,
      state: state,
      zipcode: zipcode,
      message: message,
      bg_image : file,
    });

    return res.status(201).json({ success: true, data: newProfile, message: "Postcard created successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};



module.exports = {
  logIn,
  createPostCard,
};
