const db = require("../models");

const Postcard = db.postcard;

const generateUniqueLink = () => {
  const uuid = require('uuid');
  return uuid.v4();
}

module.exports = getPostcardById = async (req, res) => {
    try {

      const id = req.params.id;
      const data = await Postcard.findOne({ where: { id: id } });
      const expireAt = new Date();
      expireAt.setMinutes(expireAt.getMinutes() + 1);

      const uniqueLink = generateUniqueLink();
      const link = '/api/unique-postcard/' + uniqueLink;

      await Postcard.update({ link: uniqueLink, expireAt: expireAt }, { where: { id: id } });

      const updatedData = await Postcard.findOne({ where: { id: id } });
      const customResponse = {
        data: {
          recipient_name: updatedData.recipient_name,
          street_1: updatedData.street_1,
          street_2: updatedData.street_2,
          city: updatedData.city,
          state: updatedData.state,
          zipcode: updatedData.zipcode,
          message: updatedData.message,
          bg_image: updatedData.bg_image,
          link: link,
          tracker: updatedData.tracker,
          expireAt: updatedData.expireAt,
          userId: updatedData.userId,
          createdAt: updatedData.createdAt,
          updatedAt: updatedData.updatedAt,
        },
      };
      if (!data) {
        return res.status(404).json({ success: true, message: "No postcard found" });
      }
      return res.status(200).json({ success: true, data: customResponse.data, message: "Retrieved postcard data" });
    } catch (error) {
      const errors = error.message || error.errors[0]?.message || error.message?.errors || error.errors || "Something went wrong";
      if (error.message && error.message.includes("Truncated incorrect DOUBLE value")) {
          return res.status(500).json({ success:false, error: 'Invalid postcard link' });
        }
      return res.status(400).json({ success: false, message: errors });
    }
  };
