const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path  = require('path');
const Promise = require('promise');
const expressValidator = require('express-validator');
const api = require('./api/router');
const nodemailer = require('nodemailer');
const SparkPost = require('sparkpost');
const sp = new SparkPost();

const sparkPostTransport = require('nodemailer-sparkpost-transport');
const transporter = nodemailer.createTransport(sparkPostTransport(process.env.SPARKPOST_API_KEY));


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
        res.render('contact_send', {
            pageTitle: 'Thank you for contacting us.',
            flash:{messages: 'Thank you for contacting us. We will get back to you as soon as we can.'}
         });

        next();
}

app.get("/", function (req, res, next) {
    Promise.resolve().then(function () {
        throw new Error("BROKEN");
    }).catch(next); // Errors will be passed to Express.
});
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

        url:'https://api.sparkpost.com/api/v1',
        host:'smtp.sparkpostmail.com',
        port: 587,
        secure: true,
        auth: {
            user:'SMTP_Injection',
            pass: 'd0ae8bcca3ad7881a2f73b01465fa75de5079084'
        }

    });
    const mailOptions = {
        from: '"Website contact" <young-temple-62524@sparkpostbox.com>',
        //from: '"Website contact" <request@alpharenovation.co.uk> ',
        to: 'alpharenovation13@gmail.com',
        subject: 'New message from contact from alpharenovation.co.uk',
        html: output,
        headers:{'My-Custom-header' : 'header value'},
        date: new Date()
    };

    transporter.sendMail( mailOptions, function (error, message, info) {
        if(!error){
            console.log('Message sent: %s', info.messageId);
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
    if(err && err.length > 0){
        res.send(err);
    }
});

app.listen(PORT, function () {
    console.log('hey');
});


