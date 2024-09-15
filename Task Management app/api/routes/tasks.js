const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Task = require('../models/Task');

router.get('/', (req, res, next) => {

    Task.find().select('task deadline _id assignedBy assignedTo status')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        _id: doc._id,
                        task: doc.task,
                        deadline: doc.deadline,
                        status: doc.status,
                        assignedBy: doc.assignedBy,
                        assignedTo: doc.assignedTo,
                        status: doc.status,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/tasks/' + doc._id
                        }
                    }
                })
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const task = new Task({
        _id: new mongoose.Types.ObjectId(),
        task: req.body.task,
        deadline: req.body.deadline,
        status: req.body.status,
        assignedBy: req.body.assignedBy,
        assignedTo: req.body.assignedTo
    });
    task
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Task Added',
                createdProduct: {
                    task: result.task,
                    deadline: result.deadline,
                    _id: result._id,
                    status: result.status,
                    assignedby: result.assignedby,
                    assignedto: result.assignedto,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/tasks/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:taskId', (req, res, next) => {
    const id = req.params.taskId;
    Task.findById(id).select('_id task deadline status assignedBy assignedTo')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all tasks using below link:',
                        url: 'http://localhost:3000/tasks'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No Valid entry Found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
})

router.patch('/:taskId', (req, res, next) => {
    const id = req.params.taskId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propemail] = ops.value;
    }
    Task.update(
        { _id: id }, { $set: updateOps }).exec().then(result => {
            res.status(200).json({
                message: 'Task Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/tasks/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:taskId', (req, res, next) => {
    const id = req.params.taskId;
    Task.remove({
        _id: id
    })
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: 'Task Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/tasks',
                        body: {
                            task: req.body.task,
                            deadline: req.body.deadline,
                            status: req.body.status,
                            assignedBy: req.body.assignedBy,
                            assignedTo: req.body.assignedTo
                        }
                    }
                });
            })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;