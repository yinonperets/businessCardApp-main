const Card = require("./mongodb/Card");
const { handleBadRequest } = require("../../utils/handleErrors");
const {cardSchema} = require('../models/mongodb/Card')
const config = require('config');
const DB = config.get("DB");


const getCards = async () => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find();
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get cards not in mongodb");
};

const getMyCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find({ user_id: userId });
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get card not in mongodb");
};

const getCard = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card) throw new Error("Could not find this card in the database");
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get card not in mongodb");
};

const createCard = async (normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = new Card(normalizedCard);
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("createCard card not in mongodb");
};

const updateCard = async (cardId, normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findByIdAndUpdate(cardId, normalizedCard, {
        new: true,
      });

      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card updateCard not in mongodb");
};

const likeCard = async (cardId, userId) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      const cardLikes = card.likes.find((id) => id === userId);

      if (!cardLikes) {
        card.likes.push(userId);
        card = await card.save();
        return Promise.resolve(card);
      }

      const cardFiltered = card.likes.filter((id) => id !== userId);
      card.likes = cardFiltered;
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card likeCard not in mongodb");
};

const deleteCard = async (cardId, user) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findByIdAndDelete(cardId);
      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in mongodb");
};

const getMyLikesCards = async (userId) => {
    if(DB === 'MONGODB'){
        try {
            const getCard = mongoose.model('card', cardSchema);
            const userLikes = await getCard.find({likes: {"$in": [userId]}});
            return Promise.resolve(userLikes);
        } catch (error) {
            error.status = 404;
            return Promise.reject(error);
        }
    }
};

const updateBizNumber = async (id, bizNumber) => {
    if(DB === 'MONGODB'){
        try {
            const updateCard = mongoose.model('card', cardSchema);
            let bizCard = await updateCard.findOne({bizNumber: bizNumber});
            if(bizCard) throw new Error('This Biz Number is already exists');
            bizCard = await updateCard.findByIdAndUpdate(id, {bizNumber: bizNumber}, {new: true});
            return Promise.resolve(bizCard);
        } catch (error) {
            error.status = 404;
            return Promise.reject(error);
        }
    }
}

exports.getCards = getCards;
exports.getMyCards = getMyCards;
exports.getCard = getCard;
exports.createCard = createCard;
exports.updateCard = updateCard;
exports.likeCard = likeCard;
exports.deleteCard = deleteCard;
exports.getMyLikesCards = getMyLikesCards;
exports.updateBizNumber = updateBizNumber;