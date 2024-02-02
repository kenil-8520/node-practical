const db = require("../models");

const Postcard = db.postcard;

const generateUniqueLink = () => {
  const uuid = require('uuid');
  return uuid.v4();
}

module.exports = createPostCard = async (req, res) => {

  try {
    const userId = req.user.id;
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
    const uniqueLink = generateUniqueLink();
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 1);

    const newProfile = await Postcard.create({
      recipient_name: name,
      street_1: address,
      street_2: address2,
      city: city,
      state: state,
      zipcode: zipcode,
      message: message,
      bg_image : filepath,
      link: uniqueLink,
      expireAt: expireAt,
      userId: userId
    });
    const link = '/api/unique-postcard/' + uniqueLink;
    const responseData = {
      data: {
        recipient_name: newProfile.recipient_name,
        street_1: newProfile.street_1,
        street_2: newProfile.street_2,
        city: newProfile.city,
        state: newProfile.state,
        zipcode: newProfile.zipcode,
        message: newProfile.message,
        bg_image: filepath,
        link: link,
        expireAt: newProfile.expireAt,
      },
    };

    return res.status(201).json({ success: true, data: responseData.data, message: "Postcard created successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
