/**
 * Created by tkasa on 15/06/2018.
 */

var express = require('express');
var router = require('express').Router();
router.get('/', function (req,res) {
    res.render('index',{
        siteTitle: 'Alpha Renovation',
        pageTitle: 'Home page'
    })
});

module.exports = router;
