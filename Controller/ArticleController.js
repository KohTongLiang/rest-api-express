var express = require('express');
var router = express.Router();
var Article = require('../Model/Article');
var moment = require('moment');
var VerifyToken = require('../Auth/VerifyToken');

// POST /articles/
// CREATE NEW ARTICLE
// AUTH REQUIRED TO CREATE AN ARTICLE
router.post('/', VerifyToken, (req, res) => {
    Article.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        createdBy: req.body.createdBy,
        createdOn: moment().format('YYYY-MM-DD'),
        updatedBy: null,
        updatedOn: null,
        deletedBy: null,
        deletedOn: null,
        deleted: false
    }), (err, article) => {
        if (err) {
            return res.status(500).json({ message: 'There was a problem creating the article.' });
        }

        res.status(200).send(article);
    };
}); // end of create article

// GET /articles/
// GET ALL ARTICLES
// ANYONE CAN RETRIEVE ALL ARTICLES
router.get('/', (req, res) => {
    Article.find({}, (err, article) => {
        if (err) {
            return res.status(500).json({ message: 'There was a problem retrieving the articles.' });
        }
        res.status(200).send(article);
    })
}); // end of get all articles

// GET /articles/:id
// GET SINGLE ARTICLE BY ARTICLE ID
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) {
            return res.status(500).json({ message: 'There was a problem finding the article.' });
        }

        if (!article) {
            return res.status(404).json({ message: 'No article found.' });
        }

        res.status(200).send(article);
    });
}); // end of get single article by article id

// DELETE /articles/:id/:userId
// DELETE ARTICLE BY ARTICLE ID
router.delete('/:id/:userId', VerifyToken, (req, res) => {
    Article.findByIdAndUpdate({ _id: req.params.id, createdBy: req.params.userId }, { deletedOn: moment().format('YYYY-MM-DD'), deletedBy: req.params.userId, deleted: true },
        { new: true }, (err, article) => {
            if (err) {
                // return res.status(500).json({ message: 'There was a problem deleting article.' });
                return res.status(500).json({ message: err });
            }

            res.status(200).json({ message: 'Article successfully deleted.' });
        });
}); // end of delete article by article id

// PUT /articles/:id
// UPDATE SINGLE ARTICLE IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    Article.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, article) {
        if (err) {
            return res.status(500).send("There was a problem updating the user.");
        }
        res.status(200).send(article);
    });
}); // end of update single article

module.exports = router;