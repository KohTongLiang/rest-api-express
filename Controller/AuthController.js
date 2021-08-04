const express = require('express')
const router = express.Router()
const User = require('../Model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const VerifyToken  = require('../Auth/VerifyToken')
const passport = require('passport')

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require('../Auth/Authenticate')

router.post('/signUp', (req, res, next) => {
    // server side field verification
    if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.username) {
        res.status(500).send({
            message: "Ensure that the registration details are filled"
        })
    } else {
        User.register(
            new User({ username: req.body.username }),
            req.body.password,
            (err,user) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    user.firstName = req.body.firstName
                    user.lastName = req.body.lastName
                    user.email = req.body.email
                    user.username = req.body.username
                    
                    const token = getToken({ _id: user._id })
                    const refreshToken = getRefreshToken({ _id: user._id })
                    //const token = getToken(user)
                    //const refreshToken = getRefreshToken(user)
                    
                    user.refreshToken.push({ refreshToken })
                    user.save((err, user) => {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
                            res.send({ success: true, token })
                        }
                    })
                }
            }
        )
    }
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    const token = getToken({ _id: req.user._id })
    const refreshToken = getRefreshToken({ _id: req.user._id })

    User.findById(req.user._id).then(
        user => {
            user.refreshToken.push({ refreshToken })
            user.save((err, user) => {
                if(err) {
                    res.statusCode(500).send(err)
                } else {
                    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
                    res.send({ success: true, token })
                }
            })
        },
        err => next(err)
    )
})

router.post('/refreshToken', (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            
            User.findOne({ _id: userId }).then(
                user => {
                    if (user) {
                        const tokenIndex = user.refreshToken.findIndex(
                            item => item.refreshToken === refreshToken
                        )

                        if (tokenIndex === -1) {
                            res.statusCode(401).send('Unauthorized')
                        } else {
                            const token = getToken({ _id: userId })
                            const newRefreshToken = getRefreshToken({ _id: userId })

                            user.refreshToken = getRefreshToken({ _id: userId })
                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode(500).send(err)
                                } else {
                                    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS)
                                    res.send({ success: true, token })
                                }
                            })
                        }
                    } else {
                        res.statusCode(401).send('Unauthorized')
                    }
                },
                
                err => next(err)
            )
        } catch (err) {
            res.statusCode(401).send('unauthorized')
        }
    }
})

router.get('/logout', verifyUser, (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    User.findById(req.user._id).then(
        user => {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            )

            if (tokenIndex !== -1) {
                user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
            }

            user.save((err, user) => {
                if (err) {
                    res.statusCode(500).send(err)
                } else {
                    res.clearCookie('refreshToken', COOKIE_OPTIONS)
                    res.send({ success: true })
                }
            })
        },
        err => next(err)
    )
})

router.get('/me', verifyUser, (req, res, next) => {
    res.send(req.user)
})

module.exports = router;