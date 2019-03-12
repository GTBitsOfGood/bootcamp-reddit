const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

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
