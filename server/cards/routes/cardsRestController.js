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

router.get('/mylikes', auth, async(req,res)=>{
const user = req.user;
try {
  const card = await likeCard(user._id);
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

router.put("/:id", auth, async (req, res) => {
  try {
    const rawCard = req.body;
    const { id } = req.params;
    const user = req.user;
    if (user._id !== rawCard.userId)
      return handleError(
        res,
        403,
        "Authorization Error: Only an admin or the user who created the business card can update its details"
      );

    const card = await updateCard(id, rawCard);
    return res.send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.patch('/update-biz-number/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const bizNumber = req.body.bizNumber;
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

module.exports = router;
