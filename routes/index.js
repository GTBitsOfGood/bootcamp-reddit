const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/", (req, res) => {
    res.send(
        "Please visit https://github.com/GTBitsOfGood/bootcamp/tree/master/10_react_with_apis for directions on how to use this API"
    );
});

/**
 * Get all posts on the server.
 * @route GET /posts
 * @group Posts - Operations about posts
 * @operationId getPosts
 * @returns {PostResponse[]} 200 - An array of posts
 * @returns {Error}  500 - Unexpected error
 */
router.get("/posts", controllers.posts.index);

/**
 * Create a new post.
 * @route POST /posts
 * @param {PostRequest.model} post.body.required - the new post
 * @group Posts - Operations about posts
 * @operationId createPost
 * @returns {PostResponse.model} 201 - The new post stored in the database
 * @returns {Error}  400 - Schema validation error
 * @returns {Error}  500 - Unexpected error
 */
router.post("/posts", controllers.posts.store);

/**
 * Get a specific post.
 * @route GET /posts/:id
 * @param {number} id.path - the post id
 * @group Posts - Operations about posts
 * @operationId getPost
 * @returns {PostResponse.model} 200 - The post with the corresponding id
 * @returns {Error}  500 - Unexpected error
 */
router.get("/posts/:id", controllers.posts.get);

/**
 * Edit a specific post.
 * @route PATCH /posts/:id
 * @param {number} id.path - the post id
 * @param {PostRequest.model} post.body.required - the edited post
 * @group Posts - Operations about posts
 * @operationId editPost
 * @returns {PostResponse.model} 200 - The edited post stored in the database
 * @returns {Error}  400 - Schema validation error
 * @returns {Error}  500 - Unexpected error
 */
router.patch("/posts/:id", controllers.posts.update);

/**
 * Delete a specific post.
 * @route DELETE /posts/:id
 * @param {number} id.path - the post id
 * @group Posts - Operations about posts
 * @operationId deletePost
 * @returns {Response} 200 - Successful deletion
 * @returns {Error}  500 - Unexpected error
 */
router.delete("/posts/:id", controllers.posts.delete);

/**
 * Create a new top-level comment for the given post.
 * @route POST /posts/:id/comment
 * @param {number} id.path - the post id
 * @param {CommentRequest.model} comment.body.required - the new comment for the post
 * @group Posts - Operations about posts
 * @operationId addTopLevelComment
 * @returns {PostResponse.model} 201 - The post with the new comment stored in the database
 * @returns {Error}  400 - Schema validation error
 * @returns {Error}  500 - Unexpected error
 */
router.post("/posts/:id/comment", controllers.posts.comment);

/**
 * Get all comments on the server.
 * @route GET /comments
 * @group Comments - Operations about comments
 * @operationId getComments
 * @returns {CommentResponse[]} 200 - An array of comments
 * @returns {Error}  500 - Unexpected error
 */
router.get("/comments", controllers.comments.index);

/**
 * Get a specific comment.
 * @route GET /comments/:id
 * @param {number} id.path - the comment id
 * @group Comments - Operations about comments
 * @operationId getComment
 * @returns {CommentResponse.model} 200 - The comment with the corresponding id
 * @returns {Error}  500 - Unexpected error
 */
router.get("/comments/:id", controllers.comments.get);

/**
 * Edit a specific comment.
 * @route PATCH /comments/:id
 * @param {number} id.path - the comment id
 * @param {CommentRequest.model} comment.body.required - the edited comment
 * @group Comments - Operations about comments
 * @operationId editComment
 * @returns {CommentResponse.model} 200 - The edited comment stored in the database
 * @returns {Error}  400 - Schema validation error
 * @returns {Error}  500 - Unexpected error
 */
router.patch("/comments/:id", controllers.comments.update);

/**
 * Delete a specific comment.
 * @route DELETE /comments/:id
 * @param {number} id.path - the comment id
 * @group Comments - Operations about comments
 * @operationId deleteComment
 * @returns {Response} 200 - Successful deletion
 * @returns {Error}  500 - Unexpected error
 */
router.delete("/comments/:id", controllers.comments.delete);

/**
 * Create a new child comment for the given comment.
 * @route POST /comments/:id/comment
 * @param {number} id.path - the comment id
 * @param {CommentRequest.model} comment.body.required - the new child comment for the given comment
 * @group Comments - Operations about comments
 * @operationId addChildComment
 * @returns {CommentResponse.model} 201 - The parent comment with the new child comment stored in the database
 * @returns {Error}  400 - Schema validation error
 * @returns {Error}  500 - Unexpected error
 */
router.post("/comments/:id/comment", controllers.comments.comment);

router.use("/", (req, res, next) => {
    let status = 500;
    let response = {status: "error", msg: "Internal Server Error"};
    if (res.locals.data) {
        response = {status: "ok", ...res.locals.data};
        status = res.locals.status || 200;
    } else if (res.locals.error) {
        status = res.locals.status || 500;
        response = {status: "error", ...res.locals.error};
    }
    return res.status(status).json(response);
});
module.exports = router;

/**
 * @typedef PostResponse
 * @property {string} id.required - The ID of the post
 * @property {string} author.required - The person who created the post
 * @property {string} title.required - The title of the post
 * @property {string} text.required - The content of the post
 * @property {number} upVotes.required - The number of up votes
 * @property {number} downVotes.required - The number of down votes
 * @property {string} createdAt.required - The created datetime
 * @property {string} updatedAt.required - The updated datetime
 * @property {CommentResponse[]} comments.required - An array of top-level comments for the post
 */

/**
 * @typedef PostRequest
 * @property {string} author.required - The person who created the post
 * @property {string} title.required - The title of the post
 * @property {string} text.required - The content of the post
 * @property {number} [upVotes] - The number of up votes
 * @property {number} [downVotes] - The number of down votes
 */

/**
 * @typedef CommentResponse
 * @property {string} id.required - The ID of the comment
 * @property {string} author.required - The person who created the comment
 * @property {string} text.required - The content of the comment
 * @property {number} upVotes.required - The number of up votes
 * @property {number} downVotes.required - The number of down votes
 * @property {string} createdAt.required - The created datetime
 * @property {string} updatedAt.required - The updated datetime
 * @property {CommentResponse[]} comments.required - An array of children comments for this comment. Follows the same schema as this schema
 */

/**
 * @typedef CommentRequest
 * @property {string} author.required - The person who created the comment
 * @property {string} text.required - The content of the comment
 * @property {number} [upVotes] - The number of up votes
 * @property {number} [downVotes] - The number of down votes
 */
