const db = require("../models");
const Task = db.tasksdb;
const authenticationRequired = require("../auth/okta.jwtauth");
// Create and Save a new Tasks
exports.create = (req, res) => {
  // Validate request
  console.log(req.body)
  if (!req.body.taskname) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a Task
  const username = req.jwt.claims.sub;
  const task = new Task({
    username: username,
    taskname: req.body.taskname,
    description: req.body.description,
    duedate: req.body.duedate,
    status: req.body.status ? req.body.status : false
  });
  // Save Tutorial in the database
  task
    .save(task)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tasks."
      });
    });
};
// Retrieve all Tasks from the database.
exports.findAll = (req, res) => {
  const username = req.jwt.claims.sub;
  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : res.status(500).send({
        message: "Username required"
      });
  Task.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks."
      });
    });
};
// Find a single Tasks with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  const username = req.jwt.claims.sub;

  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : res.status(500).send({
        message: "Username required"
      });
  Task.find({
    $and: [
        {'id': id},
        {'username': username}
    ]
  })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Task with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Task with id=" + id });
    });
};
// Update a Tasks by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  const username = req.jwt.claims.sub;

  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : res.status(500).send({
        message: "Username required"
      });
  Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Task with id=${id}. Maybe Task was not found!`
        });
      } else res.send({ message: "Task was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Task with id=" + id
      });
    });
};
// Delete a Tasks with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  const username = req.jwt.claims.sub;

  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : res.status(500).send({
        message: "Username required"
      });
  Task.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
        });
      } else {
        res.send({
          message: "Task was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Task with id=" + id
      });
    });
};
// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {
  const id = req.params.id;
  const username = req.jwt.claims.sub;

  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : res.status(500).send({
        message:
          err.message || "Username required"
      });
  Task.deleteMany(condition)
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tasks were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tasks."
      });
    });
};
