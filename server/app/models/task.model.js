
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
        username: String,
        taskname: String,
        description: String,
        status: Boolean,
        duedate: Date
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Task = mongoose.model("task", schema);
  return Task;
};