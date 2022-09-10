const https = require('https')
const express = require('express');
const  fs = require('fs');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const { default: helmet } = require('helmet');
const cookieSession = require('cookie-session');
const config = require('./config/keys')




// Google Oauth requirements
const OAUTH_OPTIONS ={
    callbackURL:'/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

// Define the verifyCallback function that will be returned by google containing the user
 function verifyCallback(acsessToken,refreshToken,profile,done){
    done(null,profile)
 }

// Passport Strategy
passport.use(new Strategy(OAUTH_OPTIONS,verifyCallback))


// Saving the session to a cookie
passport.serializeUser((user,done) => {
    done(null,user.id)
})
 
// Reading the session from the cookie for comformation
passport.deserializeUser((id,done) =>{
    done(null,id)
})

const PORT = 7000;


const app = express()

app.use(helmet())
app.set('view engine', 'ejs')

// Setting cookieSession middleware
app.use(cookieSession({
    name: 'session',
    maxAge: 24 *60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]
}))


// Function to Check if a user is loggedin
async function checkLoggedIn (req,res,next){
    const loggedIn = await req.isAuthenticated()
    if(!loggedIn){
        return res.send('sorry you have to login')
    }
    next()
}


// Routes 

// Requesting for user informations such email, name etc
app.get('/auth/google',passport.authenticate('google',{
    scope: ['email'],
}),(req,res)=>{}) 

// A callback from google after authenticating the user
app.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect: '/',
    successRedirect: '/main',
    session: true
}), (req,res) => { })


 app.get('/',(req,res) => {
    return res.render('html')
 })

 app.get('/main',(req,res) => {
    return res.render('main')
 })

// Logging out
app.get('auth/loggout',(req,res) => {
    req.logout();
    return req.redirect('/')
})


https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
},app).listen(PORT, () => console.log('server is running'))


















































// const fs = require('fs');
// const https = require('https')
// const express = require('express')
// const helmet =require('helmet')
// const passport = require('passport');
// const { Strategy} = require('passport-google-oauth20');
// const cookieSession = require('cookie-session')


// require('dotenv').config();



// const PORT = 7000;

// const config = {
//     CLIENT_ID:  '778195457926-g11k02ir61ir4r3rp7mjdblil39rgtqf.apps.googleusercontent.com' ,                                                     //process.env.CLIENT_ID,
//     CLIENT_SECRET: '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',  
//     COOKIE_KEY_1: "SECRET1", 
//     COOKIE_KEY_2: "SECRET2"                                          // (process.env.CLIENT_SECRET,) 
// }

// const AUTH_OPTIONS ={
//     callbackURL: '/auth/google/callback',
//     clientID: config.CLIENT_ID,
//     clientSecret: config.CLIENT_SECRET,
// }

// function verifyCallback(acsessToken, refreshToken, profile, done) {
//     console.log('Google profile', profile),
//     done(null,profile);
// }

// passport.use(new Strategy( AUTH_OPTIONS, verifyCallback))

// // Save the session to the cookie
// passport.serializeUser((user, done) => {
//     done(null,user.id)
// })


// // Read the session from the cookie
// passport.deserializeUser((obj,done) =>{
//     done(null,obj);
// })



// const app = express()

// app.use(helmet())
// app.use(cookieSession({
//     name: "session",
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
// }))
// app.use(passport.initialize());
// app.use(passport.session());

// app.set('view engine', "ejs")

// async function checkLoggedIn(req,res,next){
//     const isLoggedIn = await  req.isAuthenticated() && req.user;
//     if(!isLoggedIn){
//         return res.status(401).json({
//             error: 'you must log in!'
//         })
//     }
//     next();
    
// }


// app.get('/secret', checkLoggedIn,(req,res) => {
//  return   res.send('you secret number is 40')
// })

// app.get('/auth/google/callback',passport.authenticate('google',{
//     failureRedirect: '/failure',
//     successRedirect: '/secret',
//     session: true,
// }), (req,res) =>{
//     console.log('goodle called us back')
// } )

//     app.get('/',(req,res) => {
//    res.render('html')})    

// app.get('/auth/google',passport.authenticate('google',{
//     scope: ['email'],
// }),(req,res)=>{})

// app.get('/failure',(req,res) => {
//   return  res.send('fail')  })
    

// app.get('/auth/loggout',(req,res) => {
//     req.logout();
//     return res.redirect('/')
//            })
   


// https.createServer({
//     cert: fs.readFileSync('cert.pem'),
//     key: fs.readFileSync('key.pem'),
// },app).listen(PORT,() => console.log('server is running on port 7000'))