const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path  = require('path');
const dotenv = require('dotenv').config({path:'./.env'});
const Promise = require('promise');
const expressValidator = require('express-validator');
const api = require('./api/router');
const nodemailer = require('nodemailer');

const $ = require("jquery");

let port =  process.env.PORT;
if (port == null || port == "") {
    port = process.env.PORT;
}

const app = express();


app.locals.siteTitle = 'Alpha Renovation';

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser('bordeyltd'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: process.env.COOKIE_SAVEUNINITIAALIZED,
    resave: process.env.COOKIE_RESAVE
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
app.use('/', api);
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

function validateForm(req) {
    return new Promise((resolve,reject) => {

        req.checkBody('fullName', 'Name is Required').notEmpty();
        req.checkBody('email', 'Email is Required').notEmpty();
        req.checkBody('text', 'Message is Required').notEmpty();

        let validationErrors = (req.validationErrors());
        let errors = [];
        if (validationErrors) {
            validationErrors.forEach(error => {
                errors.push(error.messages);
            });
            console.log(errors);
            reject(errors);

        }else{
            resolve();
        }

    });
}

app.post('/send', function (req, res) {
    validateForm(req)
        .then(() => {
            const output  = `<p>You have a new contact message</p>
                         <h3>Contact Details</h3>
                         <ul>
                         <li>Name:          ${req.body.fullName}</li>
                         <li>Email: email:  ${req.body.email}</li>
                          <h3>Message</h3>
                         <p>Message:       ${req.body.text}</p>
                         </ul>`;

            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: process.env.MAIL_SECURE,
                auth: {
                    user:process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });
            let mailOptions = {
                from:'"Website contact"<alpharenovation13@gmail.com>',
                //from:'"Website contact"<require-01b997@inbox.mailtrap.io>',
                to: 'alpharenovation13@gmail.com , kasatanya1@gmail.com',
                subject: 'New message from contact from alpharenovation.co.uk',
                html: output,
                headers:{'My-Custom-header' : 'header value'},
                date: new Date()
            };

            transporter.sendMail( mailOptions, function (error, message) {
                message = 'Thank you for your email. We will contact with you as soon as possible.';
                if(message){
                    res.render('contact_send',{
                       flash :  {messages : message},
                        pageTitle: 'Thank you',
                        messages:message
                    });
                    console.log("tanks");
                } else{
                    console.log(error);
                    res.render('contact',{
                        flash :  {errors : error},
                        pageTitle: 'Please get in contact with us',
                        errors: error
                    });

                }
            });
        })
        .catch(error => {
            res.render('contact', {
                pageTitle: 'Please get in contact with us',
                flash:{ errors: error}
            });
            console.log(error);
        });
});


// error handler
app.use(function(err, req, res, next) {
    res.locals.messages = err.messages;
    res.locals.errors = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    if(err && err.length > 0 && dotenv.err){
        //throw env.err;
        res.send(err);

    }
    next();
});

app.listen(port, function () {
    console.log('hey u ' + dotenv.parsed);
});




