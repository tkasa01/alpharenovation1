/**
 * Created by tkasa on 15/06/2018.
 */

const express = require('express');
const router = express.Router();
const flash = require('connect-flash');

module.exports = function() { //app was before

    router.use('/', function (req, res) {
        res.render('index', {
            siteTitle: 'Alpha Renovation',
            pageTitle: 'Home page'
        })
    });

    router.use('/index', function (req, res) {
        res.render('index',{
            pageTitle: 'Alpha Renovation Company'
        });
    });

    router.use('/about', function (req, res) {
        res.render('about',{
            pageTitle: 'About Us'
        });
    });

    router.use('/services', function (req, res) {
        res.render('services',{
            pageTitle: 'Our Services'
        });
    });

    router.get('/contact', function (req, res) {
        res.render('contact',{
            pageTitle: 'Please get in contact with us.'
        });
    });

    router.get('/contact_send', function (req, res) {
        res.render('contact-send',{
            pageTitle: 'Thank you for your detalies.'
        });
    });

    router.get('/portfolio', function (req, res) {
        res.render('portfolio',{
            pageTitle: 'Our Portfolio'
        })
    });

};
