const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Article = require('../models/artChild');

router.get('/', (req, res, next) => {

    Article.find().select('_id title desc date')
        .exec()
        .then(docs => {
            const response = docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        desc: doc.desc,
                        date: doc.date,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/artchild/' + doc._id
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
        title: req.body.title,
        desc: req.body.desc,
        date: req.body.date
    });
    article
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Article Added',
                createdProduct: {
                    title: result.title,
                    desc: result.desc,
                    _id: result._id,
                    date: result.date,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/artchild/" + result._id
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
    Article.findById(id).select('_id title desc date')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all artchild using below link:',
                        url: 'http://localhost:3000/artchild'
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
                    url: 'http://localhost:3000/artchild/' + id
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
                        url: 'http://localhost:3000/artchild',
                        body: {
                            title: req.body.title,
                            desc: req.body.desc,
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