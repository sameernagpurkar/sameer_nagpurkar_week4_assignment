const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Article = require('../models/artVolunteer');

router.get('/', (req, res, next) => {

    Article.find().select('volunteer camp _id experience date ')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        _id: doc._id,
                        volunteer: doc.volunteer,
                        camp: doc.camp,
                        experience: doc.experience,
                        date: doc.date,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/artvolunteer/' + doc._id
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
    const article = new Article({
        _id: new mongoose.Types.ObjectId(),
        volunteer: req.body.volunteer,
        camp: req.body.camp,
        experience: req.body.experience,
        date: req.body.date
    });
    article
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Article Added',
                createdProduct: {
                    _id: result._id,
                    volunteer: result.volunteer,
                    camp: result.camp,
                    experience: result.experience,
                    date: result.date,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/artvolunteer/" + result._id
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

router.get('/:ArticleId', (req, res, next) => {
    const id = req.params.ArticleId;
    Article.findById(id).select('_id volunteer camp status experience date')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all Articles using below link:',
                        url: 'http://localhost:3000/artvolunteer'
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

router.patch('/:ArticleId', (req, res, next) => {
    const id = req.params.ArticleId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propemail] = ops.value;
    }
    Article.update(
        { _id: id }, { $set: updateOps }).exec().then(result => {
            res.status(200).json({
                message: 'Article Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/artvolunteer/' + id
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

router.delete('/:ArticleId', (req, res, next) => {
    const id = req.params.ArticleId;
    Article.remove({
        _id: id
    })
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: 'Article Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/artvolunteer',
                        body: {
                            volunteer: req.body.volunteer,
                            camp: req.body.camp,
                            experience: req.body.experience,
                            date: req.body.date
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