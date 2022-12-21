const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const LocalStorage = require('node-localstorage').LocalStorage;

const app = express();
const PORT = process.env.PORT || 8000;

app.engine('handlebars', exphbs.engine({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ " }));
app.set('view engine', 'handlebars');

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));


localStorage = new LocalStorage('./scratch');

app.get('/', (req, res) => {

  const preEmail = localStorage.getItem('email');

  if (preEmail) {
    res.render('success', { email: preEmail });
  }
  else {
    res.render('contact');
  }

});

var otp = Math.floor((Math.random()*1000000)+1);

setInterval(() => {
  otp = Math.floor((Math.random()*1000000)+1);
},30000)


app.post('/send', (req, res) => {

  console.log("OTP : ", otp, "is sent to", req.body.email);

  email = req.body.email;

  

  res.status(200);

  res.render('otp', { msg: "Otp has been sent", email });

});

app.post('/signout', (req, res) => {

  localStorage.clear();
  res.render('contact');

})

app.post('/verify', (req, res) => {

  if (req.body.otp == otp) {
    localStorage.setItem('email', req.body.email)
    res.status(200);
    res.render('success', { email: req.body.email })
  }
  else {
    res.status(400);
    res.render('otp', { msg: 'otp is incorrect / otp expire' });
  }

});


app.post('/resend', (req, res) => {

  console.log("OTP : ", otp, "is sent to", req.body.email);

})

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
