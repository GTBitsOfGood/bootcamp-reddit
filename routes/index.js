const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/", (req, res) => {
  res.send(
    "Please visit https://github.com/GTBitsOfGood/bootcamp/tree/master/10_react_with_apis for directions on how to use this API"
  );
});

/**
 * Get all posts on the server and their top-level comments.
 * @route GET /posts
 * @group Posts - Operations about posts
 * @operationId getPosts
 * @returns {Post[]} 200 - An array of posts
 * @returns {Error}  500 - Unexpected error
 */
router.get("/posts", controllers.posts.index);

router.post("/posts", controllers.posts.store);
router.get("/posts/:id", controllers.posts.get);
router.patch("/posts/:id", controllers.posts.update);
router.delete("/posts/:id", controllers.posts.delete);
router.post("/posts/:id/comment", controllers.posts.comment);

router.get("/comments", controllers.comments.index);
router.get("/comments/:id", controllers.comments.get);
router.patch("/comments/:id", controllers.comments.update);
router.delete("/comments/:id", controllers.comments.delete);
router.post("/comments/:id/comment", controllers.comments.comment);

router.use("/", (req, res, next) => {
  let status = 500;
  let response = { status: "error", msg: "Internal Server Error" };
  if (res.locals.data) {
    response = { status: "ok", ...res.locals.data };
    status = res.locals.status || 200;
  } else if (res.locals.error) {
    status = res.locals.status || 500;
    response = { status: "error", ...res.locals.error };
  }
  return res.status(status).json(response);
});
module.exports = router;

/**
 * @typedef Post
 * @property {string} author.required - The person who created the post
 * @property {string} title.required - The title of the post
 * @property {string} text.required - The content of the post
 * @property {number} upVotes.required - The number of up votes
 * @property {number} downVotes.required - The number of down votes
 * @property {Comment[]} comments.required - An array of top-level comments for the post
 */

/**
 * @typedef Comment
 * @property {string} author.required - The person who created the comment
 * @property {string} text.required - The content of the comment
 * @property {number} upVotes.required - The number of up votes
 * @property {number} downVotes.required - The number of down votes
 * @property {Comment[]} comments.required - An array of children comments for this comment. Follows the same schema as this schema
 */
