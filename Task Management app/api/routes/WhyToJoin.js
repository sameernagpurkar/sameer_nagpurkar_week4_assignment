const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Perk = require('../models/WhyToJoin');

router.get('/', (req, res, next) => {

    Perk.find().select('_id perk perkdesc')
        .exec()
        .then(docs => {
        console.log(docs);
            const response = docs.map(doc => {
                    return {
                        _id: doc._id,
                        perk: doc.perk,
                        perkdesc: doc.perkdesc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/perks/' + doc._id
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
    const perk = new Perk({
        _id: new mongoose.Types.ObjectId(),
        perk: req.body.perk,
        perkdesc: req.body.perkdesc
    });
    perk
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'perk Added',
                createdProduct: {
                    _id: result._id,
                    perk: result.perk,
                    perkdesc: result.perkdesc,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/perks/" + result._id
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

router.get('/:perkId', (req, res, next) => {
    const id = req.params.perkId;
    Perk.findById(id).select('_id perk perkdesc')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all perks using below link:',
                        url: 'http://localhost:3000/perks'
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

router.patch('/:perkId', (req, res, next) => {
    const id = req.params.perkId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propemail] = ops.value;
    }
    Perk.update(
        { _id: id }, { $set: updateOps }).exec().then(result => {
            res.status(200).json({
                message: 'perk Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/perks/' + id
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

router.delete('/:perkId', (req, res, next) => {
    const id = req.params.perkId;
    Perk.remove({
        _id: id
    })
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: 'perk Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/perks',
                        body: {
                            perk: req.body.perk,
                            perkdesc: req.body.perkdesc
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
