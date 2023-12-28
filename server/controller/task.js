const Task = require("../model/task");

require("dotenv").config();

exports.addTask = async (req, res) => {
  try {
    // console.log(req.body);
    const { addTask } = req.body;

    // enter all the fields...
    if (!addTask) {
      return res.status(400).json({ err: "enter all the fields" });
    }

    // insert into table...
    const newTask = new Task({
      addTask: addTask,
      userId: req.user._id,
    });

    const createdTask = await newTask.save();
    // console.log('createdTask >>>>', createdTask);

    res.status(201).json({ newTaskDetails: createdTask });
  } catch (err) {
    console.log("add-task is failing :", err);
    res.status(500).json({ err: err });
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    // console.log(req.params);
    const Eid = req.params.id;
    if (Eid === "undefined") {
      return res.status(400).json({ error: "id required to delete" });
    }

    // check the expense before deleting...
    const task = await Task.findOne({ _id: Eid });
    if (!task) {
      res.status(404).json({ err: "task not found" });
    }

    const response = await Task.deleteOne({ _id: Eid });

    res.status(200).json({ deletedTask: response });
  } catch (err) {
    console.log("delete task is failing:", err);
    res.status(500).json({ err: "delete task failed" });
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const perPage = 5; // Number of tasks per page
    const offset = (page - 1) * perPage;

    const response = await Task.find({ userId: req.user._id })
      .skip(offset)
      .limit(perPage);
    // console.log('all tasks >>>>',response);
    const totalTasks = await Task.count({ userId: req.user._id });
    const totalPages = Math.ceil(totalTasks / perPage);

    res.status(200).json({ allTasks: response, totalPages: totalPages });
  } catch (err) {
    console.log("get task is failing :", err);
    res.status(500).json({ err: "failed to get all tasks" });
  }
};
