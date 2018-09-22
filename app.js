const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path  = require('path');
const Promise = require('promise');
const expressValidator = require('express-validator');

const nodemailer = require('nodemailer');


const $ = require("jquery");

const PORT = process.env.PORT || 9080;
const app = express();


app.locals.siteTitle = 'Alpha Renovation';

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //'./views

app.use(cookieParser('bordeyltd'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secr6783',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(function (req, res, next) {
    res.locals.flash = {
        messages :req.flash('messages'),
        errors: req.flash('errors')
    };
    next();
});

//express validator
app.use(expressValidator({
    errorFormatter:function (param, message, error, value){
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            messages: message,
            errors: error,
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
/*
function validationForm(req) {
    return new Promise((resolve, reject)=>{
        req.checkBody('fullName', 'Name is Required').notEmpty();
        req.checkBody('email', 'Email is Required').notEmpty();
        req.checkBody('text', 'Message is Required').notEmpty();
        let validationError = (req.validationErrors());
        let errors = [];

        if (validationError) {
            validationError.forEach(errors => {
                errors.push(error.messages);
            });
            reject(errors);
        }else{
            resolve();
        }
    });
}

app.post('/send', function (req, res) {
    validationForm(req).then(()=>{
        const output  = `<p>You have a new contact message</p>
                         <h3>Contact Details</h3>
                         <ul>
                         <li>Name:          ${req.body.name}</li>
                         <li>Email: email:  ${req.body.email}</li>
                         <h3>Message</h3>
                         <li>Message:       ${req.body.text}</li>
                         </ul>`;

        const transporter = nodemailer.createTransport({
            host: 'box5231.bluehost.com',
            port: 465,
            secure: true,
            auth: {
                user:'request@alpharenovation.co.uk',
                pass: 'london2014'
            }
        });
        const mailOptions = {
            from: '"Website contact" <request@alpharenovation.co.uk> ',
            to: 'alpharenovation13@gmail.com',
            subject: 'New message from contact from alpharenovation.co.uk',
            html: output,
            headers:{'My-Custom-header' : 'header value'},
            date: new Date()
        };

        transporter.sendMail( mailOptions, function (error, message, info) {
            if(message){
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                console.log(nodemailer.getTestMessageUrl(info));

                res.render('contact_send',{
                    flash :  {messages : message},
                    pageTitle: 'Please get in contact with us',
                    errors: error
                });
            } else{
                res.render('contact',{
                    flash :  {errors : error},
                    pageTitle: 'Please get in contact with us',
                    errors: error
                });
            }
        });
    }).catch(errors =>{
        res.render('contact',{
            flash :  {errors : error},
            pageTitle: 'Please get in contact with us',
            errors: error
        });
    })
});*/


function validationForm(req, res, next) {

         req.checkBody('fullName', 'Name is Required').notEmpty();
         req.checkBody('email', 'Email is Required').notEmpty();
         req.checkBody('text', 'Message is Required').notEmpty();

        let error = (req.validationErrors());

        if (error) {
            res.render('contact', {
                pageTitle: 'Please get in contact with us',
                flash:{ errors: error}
            })
        }
       // res.render('contact_send', {
        res.render('contact', {
            pageTitle: 'Thank you for contacting us.',
            flash:{messages: 'Thank you for contacting us. We will get back to you as soon as we can.'}
         });

        next();
}

app.post('/send', validationForm, function (req, res) {

        const output  = `<p>You have a new contact message</p>
                         <h3>Contact Details</h3>
                         <ul>
                         <li>Name:          ${req.body.name}</li>
                         <li>Email: email:  ${req.body.email}</li>
                         <h3>Message</h3>
                         <li>Message:       ${req.body.text}</li>
                         </ul>`;


        const transporter = nodemailer.createTransport({
            host: 'box5231.bluehost.com',
            port: 465,
            secure: true,
            auth: {
                user:'request@alpharenovation.co.uk',
                pass: 'london2014'
            }

        });
        const mailOptions = {
            from: '"Website contact" <request@alpharenovation.co.uk> ',
            to: 'alpharenovation13@gmail.com',
            subject: 'New message from contact from alpharenovation.co.uk',
            html: output,
            headers:{'My-Custom-header' : 'header value'},
            date: new Date()
        };

    transporter.sendMail( mailOptions, function (error, message, info) {
        if(!error){
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            console.log(nodemailer.getTestMessageUrl(info));

            res.render('contact_send',{
                flash :  {messages : message},
                pageTitle: 'Please get in contact with us',
                errors: error
            });
        } else{
            res.render('contact',{
                flash :  {errors : error},
                pageTitle: 'Please get in contact with us',
                errors: error
            });

        }
    });

});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    if(err && err.length >0){
        res.send(err);
    }
});

app.listen(PORT, function () {
    console.log('hey');
});


