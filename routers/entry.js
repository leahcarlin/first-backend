const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Entry = require("../models").entry;

const router = new Router();

// GET /entries/        fetch all entries for user
// POST /entries/       create new entry
// DELETE /entries/     delete all entries for user
// DELETE /entries/:id  delete entry with id "id"

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entries = await Entry.findAll({
      where: {
        userId: userId,
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({ entries });
  } catch (e) {
    next(e);
  }
});

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

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const entryId = parseInt(req.params.id);
    const specificEntry = await Entry.findByPk(entryId);

    const loggedInUserId = req.user.id;
    const entryUserId = specificEntry.userId;

    if (loggedInUserId != entryUserId) {
      return res
        .status(400)
        .send({ message: "Entry does not belong to this user" });
    }

    specificEntry.destroy();
    res.status(200).send({ message: "Mood deleted" });
  } catch (e) {
    next(e);
  }
});

router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Entry.destroy({
      where: {
        userId: userId,
      },
    });

    res.status(200).send({ message: "All moods deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
