/**
 * Created by tkasa on 14/06/2018.
 */
var express = require('express');
var bodyParser = require('body-parser');
var path  = require('path');
var expressValidator = require('express-validator');
var nodemailer = require('nodemailer');

const port = 9080;
var app = express();
//var api = require('./api/router');

app.locals.siteTitle = 'Alpha Renovation';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});

//express validator
app.use(expressValidator({
    errorFormatter:function (param, msg, value){
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.get('/index', function (req, res) {
   res.render('index',{
       pageTitle: 'Alpha Renovation Company'
   });
});

app.get('/about', function (req, res) {
    res.render('about',{
        pageTitle: 'About Us'
    });
});

app.get('/services', function (req, res) {
    res.render('services',{
        pageTitle: 'Our Services'
    });
});

app.get('/contact', function (req, res) {
    res.render('contact',{
        pageTitle: 'Please get in contact with us'
    });
});

app.get('/portfolio', function (req, res) {
    res.render('portfolio',{
        pageTitle: 'Our Portfolio'
    })
});

function validationForm(req, res, next) {
    req.checkBody('fullName', 'Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('text', 'Message is Required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('contact', {
            pageTitle: 'Please get in contact with us',
            errors: errors
        })
    }  res.render('contact', {
        pageTitle: 'Please get in contact with us',
        errors: errors,
        msg: msg
    })


}
app.post('/contact/send', validationForm, function (req, res) {
        var newUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            text: req.body.text
        };

        var transporter = nodemailer.createTransport({
            //host: 'mail.alpharenovation.co.uk',
            host: 'smtp.gmail.com',
            // port: 587,
            port: 465,
            secure: true,
            auth: {
                user: 'alpharenovation13@gmail.com',
                pass: 'london2014'
            }
            //tls: {rejectUnauthorized: true}
        });
        var mailOptions = {
            from: req.body.fullName + ' ' + req.body.email + ' ' + req.body.email,
            to: 'alpharenovation13@gmail.com',
            subject: 'New message from contact from alpharenovation.co.uk',
            text: req.body.text
            // text: `${req.body.name} (${req.body.email}) says: ${req.body.text}`
        };


    transporter.sendMail( mailOptions, function (error, info) {
        if(error){
            return console.log(error)
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact',{msg: "email"})
    });

});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);    // render the error page
    res.render('error');
});

app.listen(9080, function () {
    console.log('hey');
});


