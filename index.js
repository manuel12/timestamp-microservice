const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

/**
 * Create an array to hold, original_url and short_url objs.
 * Call this array urlObjects.
 *
 * When ever a POST req is done check the url submited and
 * check the array urlObjects.
 *
 * Find out if the url submitted is present in any of the original
 * urls.
 *
 * Use urlObjects.find((item) => item.originalUrl === submittedUrl)
 *
 * If it is don't do anything.
 *
 * If is NOT present then add the url as originalUrl and add an incremental id
 * as shortUrl.
 *
 */
const urlObjects = [];
let id = 0;

app.get("/api/shorturl/:shorturl", (req, res) => {
  console.log(req.params);

  const shortUrl = req.params.shorturl;
  console.log(shortUrl);
  console.log(urlObjects);

  const existingUrlObj = urlObjects.find((urlObject) => {
    console.log(`urlObject.shortUrl: ${urlObject.shortUrl}`);
    console.log(`shortUrl: ${shortUrl}`);
    return urlObject.shortUrl == shortUrl;
  });
  console.log(existingUrlObj);

  if (existingUrlObj) {
    console.log(`existingUrlObj: ${existingUrlObj}`);
    res.redirect(existingUrlObj.originalUrl);
  }
});

app.post("/api/shorturl", (req, res) => {
  let respObj = {};
  const submittedUrl = req.body.url;

  const existingUrlObj = urlObjects.find(
    (urlObject) => urlObject.originalUrl === submittedUrl
  );

  if (existingUrlObj) {
    console.log(`URL ${submittedUrl} already existed on ${existingUrlObj}`);
    respObj = {
      original_url: existingUrlObj.originalUrl,
      short_url: existingUrlObj.shortUrl,
    };
  } else {
    // urlObj doesn't exists
    console.log(`URL ${submittedUrl} NOT existing, adding to array!`);

    const urlObject = {
      originalUrl: submittedUrl,
      shortUrl: id++,
    };
    urlObjects.push(urlObject);
    respObj = {
      original_url: urlObject.originalUrl,
      short_url: urlObject.shortUrl,
    };
  }

  res.json(respObj);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
