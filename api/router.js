/**
 * Created by tkasa on 15/06/2018.
 */

const express = require('express');
const router = express.Router();

    router.get('/', function (req, res) {
        res.render('index',{
            pageTitle: 'Alpha Renovation Company'
        });
    });
    router.get('/index', function (req, res) {
    res.render('index',{
         pageTitle: 'Alpha Renovation Company'
        });
    });

    router.get('/about', function (req, res) {
        res.render('about',{
            pageTitle: 'About Us'
        });
    });

    router.get('/services', function (req, res) {
        res.render('services',{
            pageTitle: 'Our Services'
        });
    });

    router.get('/contact', function (req, res) {
        res.render('contact',{
            pageTitle: 'Please get in contact with us'
        });

    });

    router.get('/portfolio', function (req, res) {
        res.render('portfolio',{
            pageTitle: 'Our Portfolio'
        })
    });

module.exports = router;

