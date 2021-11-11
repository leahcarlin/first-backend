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
});

module.exports = router;
