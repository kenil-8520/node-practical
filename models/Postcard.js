
module.exports = (sequelize, DataTypes) => {
    const postcard = sequelize.define("postcard", {
        recipient_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        street_1: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        street_2: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        zipcode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        bg_image:{
            type:DataTypes.STRING,
            allowNull: true
        },
        link:{
            type:DataTypes.STRING,
            allowNull: false
        },
        tracker:{
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        expireAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },)
    return postcard
}
