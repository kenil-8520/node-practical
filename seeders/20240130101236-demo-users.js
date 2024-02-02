'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = [
      { email: 'admin@gmail.com', password: 'admin' },
      { email: 'demo@gmail.com', password: 'demo' },
      // { email: 'test@gmail.com', password: 'test' },
    ];

    for (const user of userData) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const existingUser = await queryInterface.sequelize.query(
        `SELECT * FROM Users WHERE email = '${user.email}' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (!existingUser || existingUser.length === 0) {
        await queryInterface.bulkInsert('Users', [
          {
            email: user.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
