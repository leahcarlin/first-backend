var axios = require("axios").default;
const { Router } = require("express");
const Entry = require("../models").entry;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.post("/gif", async (req, res, next) => {
  try {
    const { sentiment } = req.body;
    const getGif = await axios
      .get(
        `https://api.giphy.com/v1/gifs/search?q=${sentiment}&api_key=${process.env.GKEY}`
      )
      .then(function (response) {
        const randomObj =
          response.data.data[
            Math.floor(Math.random() * response.data.data.length) - 1
          ].images.original.url;
        res.send(randomObj);
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (e) {
    next(e);
  }
});

// GET /entries/        fetch all entries for user
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entries = await Entry.findAll({
      where: {
        userId: userId,
      },
      order: [["createdAt", "DESC"]],
      limit: 7,
    });
    res.status(200).send({ entries });
  } catch (e) {
    next(e);
  }
});

// POST /entries/       create new entry
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { content, gifUrl } = req.body;

    if (!content) {
      return res
        .status(400)
        .send({ message: "Content must be provided in order to save" });
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

// DELETE /entries/:id  delete entry with id "id"
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

// DELETE /entries/     delete all entries for user
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
