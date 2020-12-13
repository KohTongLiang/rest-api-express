var express = require('express');
var router = express.Router();
var User = require('../Model/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var VerifyToken  = require('../Auth/VerifyToken');

// POST /api/auth/register
router.post('/register', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }, function (err, user) {
        if (err) {
            return res.status(500).send("There was a problem registering the user.");
        }

        // create a token
        var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
});

// POST /api/auth/login
router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return res.status(500).send('Error on the server.'); 
        }

        if (!user) {
            return res.status(401).send({ auth: false, token: null, message: 'No such user found.'});
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null, message: "Invalid password" });
        }

        var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
});

// GET /api/auth/logout
router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

// GET /api/auth/me
router.get('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) { 
            return res.status(500).send("There was a problem finding the user.");
        }

        if (!user) {
            return res.status(404).send("No user found.");
        }

        res.status(200).send(user);
    });
});

module.exports = router;