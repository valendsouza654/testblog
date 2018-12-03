var express    = require("express");
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'pug');


const { User, Blog } = require('./sequelize')


var router = express.Router();
// test route
router.get('/', function(req, res) {
    res.sendFile(__dirname + '/login.html')
});

router.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html')
});

router.get('/register', function(req, res) {
    res.sendFile(__dirname + '/register.html')
});

router.get('/home', function(req, res) {
    if(session.user){
        //res.sendFile(__dirname + '/home.html')
        //console.log(session.user.username)
        Blog.findAll({where:{userid:session.user.userid}}).then( data =>  {
            if(data){
                    console.log(data)
                    res.render('home', { 
                    title: 'Home', 
                    message: 'Welcome to Blog Project!', 
                    postedby: 'Posted by '+session.user.username,
                    blogs:  data });
            }
            else{
                res.render('home', { 
                title: 'Home', 
                message: 'Welcome to Blog Project!', 
                postedby: 'Posted by '+session.user.username+' on November 10, 2011',
                });
            }
            
         });

        
    }else{
        res.redirect('/login');
    }
    
});


router.post('/registeruser', function(req, res) {
    User.create({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
      })
      .then(user => {
          if(user.toJSON().hasOwnProperty('createdAt')){
            res.json({ message: "Registration successful" });
          }else{
            res.json({ message: 'failed to add user' });
          }
      });
});

router.post('/loginuser', function(req, res) {
    
      User.find({where:{username:req.body.username}}).then( data =>  {
        if(data){
            if(data.password==req.body.password){
                session.user = data;
                //console.log(session.user.name) 
                res.json({ message: "Login Successful" });
                //res.redirect('/home');
            }else{
                res.json({ message: 'Login failed! Check password' });
            }
        }
        else{
            res.json({ message: 'Login failed! Check username and password' });
        }
     });
    
});

router.post('/createblog', function(req, res) {
    Blog.create({
        title: req.body.title,
        text: req.body.text,
        userid: req.body.userid
      })
      .then(blog => {
          if(blog.toJSON().hasOwnProperty('createdAt')){
            res.json({ message: "Registration successful" });
          }else{
            res.json({ message: 'failed to add blog' });
          }
      });
});

app.use('/', router);
app.listen(5000); 