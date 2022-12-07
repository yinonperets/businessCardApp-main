const chalk = require("chalk");
const normalizeCard = require("../cards/helpers/normalizeCard");
const { createCard } = require("../cards/models/cardsAccessDataService");
const data = require("./initialData.json");

const generateInitialCards = async () => {
  const { cards } = data;
  cards.forEach(async (card) => {
    try {
      const userId = "6376274068d78742d84f31d2";
      card = await normalizeCard(card, userId);
      await createCard(card);
      return;
    } catch (error) {
      return console.log(chalk.redBright(error.message));
    }
  });
};

exports.generateInitialCards = generateInitialCards;
