const mongoose = require("mongoose");
const Comment = require("./comment");

const postSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    upVotes: {
      type: Number,
      default: 0
    },
    downVotes: {
      type: Number,
      default: 0
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

const autoPopulateChildren = function(next) {
  this.populate("comments");
  next();
};

postSchema
  .pre("findOneAndUpdate", autoPopulateChildren)
  .pre("findOne", autoPopulateChildren)
  .pre("find", autoPopulateChildren);

postSchema.static("findByIdAndCascadeDelete", function(id) {
  return this.findById(id).then(post => {
    post.comments.forEach(com => Comment.findByIdAndCascadeDelete(com));
    return this.deleteOne({ _id: id });
  });
});

postSchema.static("removeNestedCommentById", function(id) {
  return this.updateMany({ comments: id }, { $pull: { comments: id } });
});

postSchema.static("findByIdAndAddComment", function(id, commentData) {
  return this.findById(id)
    .then(post => {
      if (post === null) {
        throw new Error(`Post with id ${id} was not found`);
      }
      const newComment = new Comment(commentData);
      return Promise.all([newComment.save(), Promise.resolve(post)]);
    })
    .then(([comment, post]) => {
      post.comments.push(comment);
      return post.save();
    })
    .then(post => this.findById(post.id).populate("comments"));
});

module.exports = mongoose.model("Post", postSchema);
