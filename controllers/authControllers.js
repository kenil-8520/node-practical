const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const multer = require("multer");
const multerUpload = require('../middleware/multer');
const path = require("path");
const { Op } = require('sequelize');


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

  try {
    let filepath = null;
    if (req.file) {
      filepath = '/uploads/' + req.file.filename;
    }
    const { name, address, address2, city, state, zipcode, message, file } = req.body;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const addressRegex = /^[a-zA-Z0-9\s]+$/;
    const zipcodeRegex = /^[0-9]{6,9}$/;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({success: false, message: "Request body is empty provide name, address, city, state, zipcode and message"});
    }
    const requiredFields = ["name", "address", "city", "state", "zipcode", "message"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }
    if (!nameRegex.test(name) || name.length > 20) {
      return res.status(400).json({ success: false, message: "Invalid name format" });
    }
    if (!nameRegex.test(city) || city.length > 20) {
      return res.status(400).json({ success: false, message: "Invalid city format" });
    }
    if (!nameRegex.test(state) || state.length > 20) {
      return res.status(400).json({ success: false, message: "Invalid state format" });
    }

    if (!addressRegex.test(address) || !addressRegex.test(address2)) {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    if (!zipcodeRegex.test(zipcode)) {
      return res.status(400).json({ success: false, message: "Invalid zipcode format" });
    }

    const newProfile = await Postcard.create({
      recipient_name: name,
      street_1: address,
      street_2: address2,
      city: city,
      state: state,
      zipcode: zipcode,
      message: message,
      bg_image : filepath,
    });

    return res.status(201).json({ success: true, data: newProfile, message: "Postcard created successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


const listPostCard = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const options = {
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      where: {},
    };

    if (search) {
      options.where.recipient_name = { [Op.like]: `%${search}%` };
    }

    const data = await Postcard.findAll(options);

    if (!data || data.length === 0) {
      return res.status(404).json({ success: true, message: "No postcard found" });
    }

    return res.status(200).json({
      success: true,
      data: data,
      message: "Retrieved postcards successfully",
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
    });
  } catch (error) {
    const errors = error.errors[0]?.message || error.message?.errors || error.errors ? errors: "Something went wrong";
    console.log(error);
    return res.status(400).json({ success: false, message: errors });
  }
};

module.exports = {
  logIn,
  createPostCard,
  listPostCard,
};
