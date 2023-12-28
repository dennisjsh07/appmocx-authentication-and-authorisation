const express = require('express');
const taskController = require('../controller/task');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-task', userAuthentication.authenticate, taskController.addTask);

router.delete('/delete-task/:id', userAuthentication.authenticate, taskController.deleteTask);

router.get('/get-task', userAuthentication.authenticate, taskController.getTask);

module.exports = router;
 