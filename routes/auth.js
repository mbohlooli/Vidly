const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password.')
    
    const validPasswrod = await bcrypt.compare(req.body.password, user.password);
    if(!validPasswrod) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
}); 

function validate(req) {
    const Schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }

    return Joi.validate(req, Schema);
}

module.exports = router;