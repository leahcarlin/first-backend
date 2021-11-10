const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Entry = require("../models").entry;

const router = new Router();

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { content, gifUrl } = req.body;

    if (!content) {
      return res.status(400).send({ message: "Content must be provided" });
    }

    if (!gifUrl) {
      return res.status(400).send({ message: "gifUrl must be provided" });
    }

    const newEntry = await Entry.create({
      content,
      gifUrl,
      userId,
    });
    res.status(200).send({ message: "Mood added", newEntry });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
