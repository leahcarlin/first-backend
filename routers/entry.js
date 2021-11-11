var axios = require("axios").default;
const { Router } = require("express");
const Entry = require("../models").entry;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.post("/sentiment", async (req, res) => {
  const { content } = req.body;
  const options = {
    method: "GET",
    url: "https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/",
    params: {
      text: content,
    },
    headers: {
      "x-rapidapi-host": "twinword-emotion-analysis-v1.p.rapidapi.com",
      "x-rapidapi-key": "1063711ffamsh31af34f715bef9dp14c537jsnf568a3552ef0",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const sentiment = response.data.emotions_detected[0];

      axios
        .get(
          `https://api.giphy.com/v1/gifs/search?q=${sentiment}&api_key=UGwSvXyX5MwOX64tVf2q6KF4X9pXrrJV`
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
    })
    .catch(function (error) {
      console.error(error);
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
