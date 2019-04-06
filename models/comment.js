const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    author: {
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

commentSchema
  .pre("findOneAndUpdate", autoPopulateChildren)
  .pre("findOne", autoPopulateChildren)
  .pre("find", autoPopulateChildren);

commentSchema.static("findByIdAndCascadeDelete", function(id) {
  console.log("Comment Cascade Delete got called! ID: ", id);
  return this.findById(id).then(comment => {
    comment.comments.forEach(com => this.findByIdAndCascadeDelete(com));
    return this.deleteOne({ _id: id });
  });
});

commentSchema.static("removeNestedCommentById", function(id) {
  return this.updateMany({ comments: id }, { $pull: { comments: id } });
});

commentSchema.static("findByIdAndAddComment", function(id, commentData) {
  return this.findById(id)
    .then(comment => {
      if (comment === null) {
        throw new Error(`Comment with id ${id} was not found`);
      }
      const newComment = new this(commentData);
      return Promise.all([newComment.save(), Promise.resolve(comment)]);
    })
    .then(([comment_new, comment]) => {
      comment.comments.push(comment_new);
      return comment.save();
    })
    .then(comment => this.findById(comment.id).populate("comments"));
});

module.exports = mongoose.model("Comment", commentSchema);
