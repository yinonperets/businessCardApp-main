const express = require("express");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const normalizeCard = require("../helpers/normalizeCard");
const {
  getCards,
  getMyCards,
  getCard,
  createCard,
  updateCard,
  likeCard,
  deleteCard,
  getMyLikesCards,
  updateBizNumber,
} = require("../models/cardsAccessDataService");
const validateCard = require("../validations/cardValidationService");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cards = await getCards();
    return res.send(cards);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  const user = req.user;
  try {
    if(!user.isBusiness) throw new Error('you are not a business user')
    
    const card = await getMyCards(user._id);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// //
router.get('/my-Likes', auth, async(req,res)=>{
const user = req.user;
try {
  const card = await getMyLikesCards(user._id);
  return res.send(card);
} catch (error) {
  return handleError(res, error.status || 500, error.message);
}});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const card = await getCard(id);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user.isBusiness)
      return handleError(
        res,
        403,
        "Business Authentication Error: You must be a business type user to create a new business card"
      );

    let card = req.body;
    card = await createCard(card, user._id);
    return res.status(201).send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.put('/:id', auth, async (req, res) => {
    try {
        let card = req.body;
        const cardId = req.params.id;
        const authUser = req.user;
        if(!authUser.isBusiness) throw new Error('You are not Business User!');
        const { error } = validateCard(card);
        if (error)
          return handleError(res, 400, `Joi Error: ${error.details[0].message}`);
    
        card = await normalizeCard(card, authUser._id);
        card = await updateCard(cardId, card, authUser._id);
        return res.send(card);
      } catch (error) {
        return handleError(res, error.status || 500, error.message);
      }
});

router.patch('/update-biznumber/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { bizNumber } = req.body;
        if(!req.user.isAdmin) throw new Error('You are not Authorized');
        const card = await updateBizNumber(id, bizNumber);
        return res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error.message);
    }
});

router.patch('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
    try {
        const card = await likeCard(id, userId);
        return res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        const card = await deleteCard(id, user);
        return res.send(card);
    } catch (error) {
        return handleError(res, error.status || 500, error.message);
    }
});
 
module.exports = router;

