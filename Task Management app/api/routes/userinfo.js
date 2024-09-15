const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userInfo = require('../models/userinfo');

router.get('/', (req, res, next) => {
    userInfo.find().select('_id name address mob email dob gender bloodgrp que1 que2 que3 que4')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        address: doc.address,
                        mob: doc.mob,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/userinfo/' + doc._id
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
    const userinfo = new userInfo({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        mob: req.body.mob,
        email: req.body.email,
        dob: req.body.dob,
        gender: req.body.gender,
        bloodgrp: req.body.bloodgrp,
        que1: req.body.que1,
        que2: req.body.que2,
        que3: req.body.que3,
        que4: req.body.que4

    });
    userinfo
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User Information Added.',
                Info_Added: {
                    _id: result._id,
                    name: result.name,
                    address: result.address,
                    email: result.email,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/userinfo/" + result._id
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

router.get('/:userinfoid', (req, res, next) => {
    const id = req.params.userinfoid;
    userInfo.findById(id).select('_id name address mob email dob gender bloodgrp que1 que2 que3 que4')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all users\' info using below link:',
                        url: 'http://localhost:3000/userinfo'
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

// router.patch('/:userinfoid', (req, res, next) => {
//     const id = req.params.userinfoid;
//     const updateOps = {};
//     for (const ops of req.body) {
//         updateOps[ops.propname] = ops.value;
//     }
//     userInfo.update(
//         { _id: id }, { $set: updateOps }).exec().then(result => {
//             res.status(200).json({
//                 message: 'User information Updated',
//                 request: {
//                     type: 'GET',
//                     url: 'http://localhost:3000/userinfo/' + id
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         })
// })

router.delete('/:userinfoid', (req, res, next) => {
    const id = req.params.userinfoid;
    userInfo.remove({
        _id: id
    })
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: 'User information Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/userinfo',
                        body: {
                            name: req.body.name,
                            address: req.body.address,
                            mob: req.body.mob
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

// {
//     "name": "Chirag Pranami" ,
//     "address": "House 420, Ankleshwar" ,
//     "mob": "9426227645" ,
//     "name": "chiragpranami@gmail.com" ,
//     "dob": "1998-10-05" ,
//     "gender": "male" ,
//     "bloodgrp": "B+" ,
//     "que1": "I want to change Bharuch." ,
//     "que2": "1" ,
//     "que3": "Changing Bharuch." ,
//     "que4": "Can change Bharuch." 
// }