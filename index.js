const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
require("dotenv").config();

const http = axios.create();

app.get("^/*-([0-9]*)", (req, res) => {
  const url = req.params;
  const pageId = url[1] || "no page id";
  res.send(JSON.stringify({ pageId }));
  // Redirect to pageId
});

app.get("/:folder/:slug", (req, res) => {
  const folder = req.params.folder;
  const slug = req.params.slug;
  http
    .get(
      `${process.env.STACK_URL}/v3/content_types/page/entries?query={"taxonomies.term_uid": "${folder}", "slug": "${slug}"}`,
      {
        headers: {
          api_key: process.env.STACK_API_KEY,
          authorization: process.env.STACK_DELIVERY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    )
    .then((result) => {
      res.send(JSON.stringify(result.data));
    });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  http
    .get(
      `${process.env.STACK_URL}/v3/content_types/page/entries?query={"taxonomies": [], "slug": "${slug}"}`,
      {
        headers: {
          api_key: process.env.STACK_API_KEY,
          authorization: process.env.STACK_DELIVERY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    )
    .then((result) => {
      res.send(JSON.stringify(result.data));
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
