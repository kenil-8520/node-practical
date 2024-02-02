const db = require("../models");

const Postcard = db.postcard;

module.exports =  getPostcard = async (req, res) => {
    try {
      const id = req.params.link;
      const currentDate = Date.now()
      const data = await Postcard.findOne({ where: { link: id } });
      if (data.expireAt < currentDate){
        return res.status(400).json({ success: true, message: "Your link has been expired" });
      }
      const currentTrackerValue = data.tracker;
      const newTrackerValue = currentTrackerValue + 1;
      await Postcard.update({ tracker: newTrackerValue }, { where: { link: id } });
      const custommizeData = {
        id: data.id,
        recipient_name: data.recipient_name,
        street_1: data.street_1,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        message: data.message,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
      if (!data) {
        return res.status(404).json({ success: true, message: "No postcard found" });
      }
      return res.status(200).json({ success: true, data: custommizeData, message: "Retrieved postcard data" });
    } catch (error) {
      const errors = error.message || error.errors[0]?.message || error.message?.errors || error.errors || "Something went wrong";
      if (error.message && error.message.includes("Truncated incorrect DOUBLE value")) {
          return res.status(500).json({ success:false, error: 'Invalid postcard link' });
        }
      return res.status(400).json({ success: false, message: errors });
    }
  };
