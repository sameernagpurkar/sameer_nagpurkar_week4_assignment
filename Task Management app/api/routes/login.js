const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Login = require('../models/Login');

router.get('/', (req, res, next) => {
    Login.find().select('_id email password status loginstatus')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        password: doc.password,
                        status: doc.status,
                        loginstatus: doc.loginstatus,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/login/' + doc._id
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
    const login = new Login({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password,
        role: req.body.role      
    });
    login
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User Information Added.',
                Info_Added: {
                    _id: result._id,
                    email: result.email,
                    password: result.password,
                    role: result.role,
                    loginstatus: result.loginstatus,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/login/" + result._id
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

router.get('/:loginid', (req, res, next) => {
    const id = req.params.loginid;
    Login.findById(id).select('_id email password role loginstatus')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all users\' info using below link:',
                        url: 'http://localhost:3000/login'
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

router.patch('/:loginid', (req, res, next) => {
    const id = req.params.loginid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propemail] = ops.value;
    }
    Login.update(
        { _id: id }, { $set: updateOps }).exec().then(result => {
            res.status(200).json({
                message: 'User information Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/login/' + id
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

router.delete('/:loginid', (req, res, next) => {
    const id = req.params.loginid;
    Login.remove({
        _id: id
    })
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: 'User information Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/login',
                        body: {
                            email: req.body.email,
                            password: req.body.password,
                            role: req.body.role
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