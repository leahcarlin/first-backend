"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "entries",
      [
        {
          content:
            "Today I'm feeling happy because we have finished the big project",
          gifUrl:
            "https://media1.giphy.com/media/DhstvI3zZ598Nb1rFf/giphy.gif?cid=34ee3013s6vy5290nq4m8yduhs71j68tpf02offc7zugln7n&rid=giphy.gif&ct=g",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "Today I'm feeling sad",
          gifUrl:
            "https://media2.giphy.com/media/3o6wrvdHFbwBrUFenu/giphy.gif?cid=34ee3013pi9k1k3alp24cldutu615fmevtguing8osasc579&rid=giphy.gif&ct=g",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: "Today I'm feeling angry",
          gifUrl:
            "https://media2.giphy.com/media/3o9bJX4O9ShW1L32eY/giphy.gif?cid=34ee3013yq3vbo0lrvy76m0boh3mtka58cxlou13645rtb5x&rid=giphy.gif&ct=g",
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("entries", null, {});
  },
};
