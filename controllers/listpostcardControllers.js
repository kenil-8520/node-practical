const db = require("../models");
const {Op} = require('sequelize')

const Postcard = db.postcard;

module.exports =  listPostCard = async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const options = {
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        where: {},
      };
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).send({ auth: false, message: 'No Token Provided'});
      }
      else{
        const userId = req.user.id;
        options.where.userId = userId;
      }
      if (search) {
        options.where.recipient_name = { [Op.like]: `%${search}%` };
      }
      const totalCount = await Postcard.count({ where: options.where });
      const data = await Postcard.findAll(options);

      const customizedData = data.map(postcard => {
        const newLink = postcard.link;
        const filepath = '/api/unique-postcard/' + newLink;

        return {
          recipient_name: postcard.recipient_name,
          street_1: postcard.street_1,
          street_2: postcard.street_2,
          city: postcard.city,
          state: postcard.state,
          zipcode: postcard.zipcode,
          message: postcard.message,
          bg_image: postcard.bg_image,
          link: filepath,
          tracker: postcard.tracker,
          createdAt: postcard.createdAt,
          updatedAt: postcard.updatedAt
        };
      });

      if (!data || data.length === 0) {
        return res.status(404).json({ success: true, message: "No postcard found" });
      }

      return res.status(200).json({
        success: true,
        data: customizedData,
        message: "Retrieved postcards successfully",
        currentPage: page,
        totatData: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
        console.log(error);
      const errors = error.errors[0]?.message || error.message?.errors || error.errors ? errors: "Something went wrong";
      return res.status(400).json({ success: false, message: errors });
    }
  };
