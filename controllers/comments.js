const { Comment, Post } = require("../models");

module.exports.index = (req, res, next) => {
  Comment.find()
    .populate("comments")
    .then(comments => {
      res.locals.data = { comments };
      res.locals.status = 200;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.locals.error = { error: err.message };
      return next();
    });
};

module.exports.get = (req, res, next) => {
  Comment.findById(req.params.id)
    .populate("comments")
    .then(comment => {
      res.locals.data = { comment };
      res.locals.status = comment === null ? 404 : 200;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.locals.errors = { error: err.message };
      return next();
    });
};

module.exports.store = (req, res, next) => {
  const newPost = new Post(req.body);
  newPost
    .save()
    .then(comment => {
      res.locals.data = { comment };
      res.locals.status = 201;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.locals.error = { error: err.message };
      res.locals.status = 400;
      return next();
    });
};

module.exports.update = (req, res, next) => {
  Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true
  })
    .then(comment => {
      res.locals.data = { comment };
      res.locals.status = 200;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.locals.error = { error: err.message };
      res.locals.status = 400;
      return next();
    });
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Comment.findByIdAndCascadeDelete(id)
    .then(_ => Post.removeNestedCommentById(id))
    .then(_ => Comment.removeNestedCommentById(id))
    .then(_ => {
      res.locals.data = { deleted: "Success" };
      res.locals.status = 200;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.locals.error = { error: err.message };
      res.locals.status = 400;
      return next();
    });
};

module.exports.comment = (req, res, next) => {
  Comment.findByIdAndAddComment(req.params.id, req.body)
    .then(comment => {
      res.locals.data = { comment };
      res.locals.status = 201;
      return next();
    })
    .catch(err => {
      console.error(err);
      res.locals.error = { error: err.message };
      res.locals.status = 400;
      return next();
    });
};
