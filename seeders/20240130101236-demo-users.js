'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});

    const hashedPassword1 = await bcrypt.hash('admin', 10);
    const hashedPassword2 = await bcrypt.hash('demo', 10);
    const hashedPassword3 = await bcrypt.hash('test', 10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@gmail.com',
        password: hashedPassword1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'demo@gmail.com',
        password: hashedPassword2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'test@gmail.com',
        password: hashedPassword3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
