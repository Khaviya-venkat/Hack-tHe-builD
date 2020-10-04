var express = require('express'),
	app = express(),
	multer = require('multer'),
    path = require('path'),
	helpers = require('./helpers'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	User = require('./models/users'),
	Doctor = require('./models/doctors');

mongoose.set('useUnifiedTopology', true);
var mongoDB = 'mongodb://localhost/sdk';
mongoose.connect(mongoDB, { useNewUrlParser: true });
app.use(
	require('express-session')({
		secret: 'wassup! XD',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/profilepage', function (req, res) {
	res.render('profilepage',{user: req.user});
});

app.post("/:id/profilepage", function(req, res){
	User.findByIdAndUpdate(req.params.id, {$set:{"latofrider": req.body.latofrider, "longofrider": req.body.longofrider, "status": "Picked Up"}}, function(err, updated){
		if(err){
			console.log(err);
		}
		else{
				res.redirect("/home");				
		}
	});
});

app.post('/upload', (req, res) => {

    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('upFile');
    console.log(req.file);
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		var name = "" ;
		for (var i=6;i<req.file.path.length;i++){
			name = name + req.file.path[i];}
		User.findById(req.user._id,function(err,user){
			user.img = name;
			user.save();
			res.redirect("/userpage");
		})
		
    });
});

app.get("/device",function(req,res){
	User.find({username: req.user.username}, function(err, user){
		if(err){
			console.log(err);
		}
		else{
			console.log(user + user._id)
			res.render("device", {user: req.user});
		}
	});	
})

app.get("/login", function(req,res){
	res.render('login');
})

app.get('/signup', function (req, res) {
	res.render('signup');
});

app.post('/signup', function (req, res) {
	req.body.username;
	req.body.password;
	User.register(
		new User({ username: req.body.username, type: req.body.type }),
		req.body.password,
		function (err, user) {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/');
			});
		}
	);
});

app.post('/login',passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
	}),
	function (req, res) {
		req.body.username;
		req.body.password;
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/login');
});

app.get("/about", function(req, res){
	res.render("about");
});

app.get("/doctors", function(req, res){
	res.render("doctors");
});
function islogin(req, res, next) {
	if (req.isAuthenticated()) {
		User.find({ username: req.user.username }, function (err, user) {
			if (err) {
				console.log('shit sorry');
			}
			user.forEach(function (usr) {
				usr.status = 'online';
				usr.save();
			});
		});
		return next();
	} else {
		res.redirect('/');
	}
}
app.listen(3000,function(){
	console.log("server started");
});