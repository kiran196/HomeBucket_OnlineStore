const express = require('express');
const url = require('url');
const mongo = require('mongodb');
const fs = require('fs');
let bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public_html'));

// Product image upload directory setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname +'/public_html/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed for product image';
        return cb(new Error('Only image files are allowed for product image'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

// User registration is handled by this 
app.post('/user_signup', (req, res) => {
	// prepare mongo client for mongodb
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);

	// Connect to monogdb and perform the action
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		// Database to access
		var dbo = db.db("shopDetails");
		// insert record query
		var insertRecord = { user_firstname: req.body.fname, 
					user_lastname: req.body.lname, 
					user_email: req.body.email,
					user_password: req.body.pword,
					user_age: req.body.age,
					user_address: req.body.address };
		// Another insert query for userDetails collection
		var insertLoginRecord = { user_email: req.body.email,
					user_password: req.body.pword };
		
		// Execute query for users collection (used for registration)
		dbo.collection("users").insertOne(insertRecord,
			function(err, result) {
				if (err) { res.redirect('./signup_failure.html'); }
			});
		// Execute the query for userDetails collection (used for login)
		dbo.collection("userDetails").insertOne(insertLoginRecord, 
			function(err, result) {
				if (err) { res.redirect('./signup_failure.html'); }
				res.redirect('./signup_success.html')
				db.close();
			});
	});
});

// user login is handled by this
app.post('/user_login', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		var query = { user_email: req.body.email, user_password: req.body.pword };
		dbo.collection("userDetails").find(query).toArray(function(err, result) {
			if (err) throw err;
			else {
				if (!result || result.length == 0) { res.redirect('./login_failure.html'); }
				else {
					console.log(result);
					if(req.body.email == "admin@homebasket.com") {
						res.redirect('./admin/admin_home.html');
						db.close();
					} else {
						res.redirect('./login_success.html');
						db.close();
					}
				}
			}
	  	});
	}); 	
});

// handle contact form submit
app.post('/contact_shop', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		var insertRecord = { user_firstname: req.body.fname, 
					user_lastname: req.body.lname, 
					user_email: req.body.email,
					user_message: req.body.message };
					
		dbo.collection("contact_req").insertOne(insertRecord, 
			function(err, result) {
				if (err) throw err;
				//res.send("User has been registered.");
				res.redirect('./contact_success.html')
				db.close();
			});
	});
});

// handle add new product
app.post('/add_new_product', upload.single('pimage'), (req, res) => {
	console.log(upload);
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);
	console.log(req.file);
	console.log(req.file.filename);

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		
		var insertRecord = { product_name: req.body.pname, 
					product_desc: req.body.pdesc, 
					product_price: req.body.pprice,
					product_img: req.file.filename };
					
		dbo.collection("products").insertOne(insertRecord, 
			function(err, result) {
				if (err) throw err;
				res.redirect('./admin/product_added.html')
				db.close();
			});
	});
});

// handle add new product
app.post('/add_to_cart', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		
		var query = { product_name: req.query.prod_name };
		dbo.collection("cart").findOne(query, function(err, result) {
			if (err) throw err;
			else {
				if (!result || result.length == 0) { 
						// product not in cart - Add product into the cart 
					dbo.collection("products").findOne(query, function(err, result2)	{
						if (err) throw err;
						var insertRecord = { product_name: result2.product_name, 
						product_desc:  result2.product_desc, 
						product_price:  result2.product_price,
						product_img:  result2.product_img,
						product_quant: req.query.quant };
						
						dbo.collection("cart").insertOne(insertRecord,
							function(err, resultx) {
								if (err) throw err;
								db.close();
							});
					});
				}
				else {
					// Product is in cart, change the quantity
					var existing_quant = parseInt(result.product_quant);
					console.log(result.product_quant);
					var newQuant = existing_quant + parseInt(req.query.quant);
					console.log(newQuant);
					var newvalues = { $set : { product_quant: newQuant } };
					
					dbo.collection('cart').updateOne(query, newvalues, function(err, result3) {
						if (err) throw err;
						db.close();
					});
				}
			}
	  	});
	});
	
	res.redirect('./cart.html');
});

// handle get all products
app.get('/all_products', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("products").find({}).toArray(function(err, result) {
		if (err) throw err;
		db.close();
		return res.json(result);
	  });
	}); 
});

// handle get all products in shopping cart
app.get('/all_products_in_cart', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("cart").find({}).toArray(function(err, result) {
		if (err) throw err;
		db.close();
		return res.json(result);
	  });
	}); 
});

// handle cart empty
app.get('/clear_cart', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("cart").remove({}, function(err, result) {
		if (err) throw err;
		db.close();
		res.redirect('./cart.html');
	  });
	}); 
});

// handle checkout
app.post('/checkout', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		
		var insertRecord = { total_items: req.body.totalitems,
								total_price: req.body.totalprice, 
								card_name: req.body.cname,
								card_no: req.body.cno,
								card_exp_m: req.body.cmonth,
								card_exp_y: req.body.cyear,
								card_sec: req.body.cvv };
					
		dbo.collection("orders").insertOne(insertRecord, 
			function(err, result) {
				if (err) throw err;
			});
			
		dbo.collection("cart").remove({}, function(err, result) {
			if(err) throw err;
			res.redirect('./index.html')
			db.close();
		});
	});
});

app.get('/', (req, res) => {
	res.send("Welcome to the nodejs with mongo. Use following services <br/>" +
			"1. <a href='/api/allcols'> ' /api/allcols ' <a/> Collections list in shopDetails database <br/>" +
			"2. <a href='#'> ' /api/show/{Collection Name} ' </a> Shows collection details <br/>" +
			"3. <a href='/api/collection/users'> ' /api/collection/users ' </a> Shows collection details <br/>" +
			"4. <a href='/api/collection/orders'> ' /api/collection/orders ' </a> Shows collection details <br/>" +
			"5. <a href='/api/collection/wishlist'> ' /api/collection/wishlist ' </a> Shows collection details <br/>" +
			"6. <a href='/api/test'> ' /api/test ' </a> Test the API <br/>");
});


app.get('/api/allcols', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.listCollections().toArray(function(err, collInfos) {
			if (err) throw err;
			collInfos.forEach(element => {
				res.write(JSON.stringify(element));
				res.write("\n");
			});
			res.send();
			console.log(collInfos);
			db.close();
		});
	}); 
	
});

app.get('/api/show/:name', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection(req.params.name).find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		res.send(result);
		db.close();
	  });
	}); 
	
});

app.get('/api/collection/users', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("users").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		res.send(result);
		db.close();
	  });
	}); 
});

app.get('/api/collection/orders', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("orders").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		res.send(result);
		db.close();
	  });
	}); 
});

app.get('/api/collection/wishlist', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("wishlist").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		res.send(result);
		db.close();
	  });
	}); 
});

app.get('/api/orders/:userid', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("orders").find({userid: parseInt(req.params.userid)}).toArray(function(err, result) {
			if (err) throw err;
			if (!result || result.length == 0) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">No orders present for that user id!</h2>');
			console.log(result);
			result.forEach(element => {
				res.write(JSON.stringify(element));
				res.write("\n");
			});
			res.send();
			db.close();
	  });
	}); 
});

app.get('/api/wishlist/:userid', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("wishlist").find({userid: parseInt(req.params.userid)}).toArray(function(err, result) {
			if (err) throw err;
			if (!result || result.length == 0) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">No wishlist items present for that user id!</h2>');
			console.log(result);
			result.forEach(element => {
				res.write(JSON.stringify(element));
				res.write("\n");
			});
			res.send();
			db.close();
	  });
	}); 
});

app.get('/api/logins/:userid', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("loginAttempts").find({userid: parseInt(req.params.userid)}).toArray(function(err, result) {
			if (err) throw err;
			if (!result || result.length == 0) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">No login attempts present for that user id!</h2>');
			console.log(result);
			result.forEach(element => {
				res.write(JSON.stringify(element));
				res.write("\n");
			});
			res.send();
			db.close();
	  });
	}); 
});

app.put('/api/changepass/:userid', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("users").findOneAndUpdate(
			{userid: parseInt(req.params.userid)},
			{$set: {password: req.body.newpass}},
			function(err, result) {
				if (err) { throw err; }
			});
			res.send("Update Done");
			db.close();
	}); 
});

app.put('/api/changeaddress/:userid', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		dbo.collection("addresses").findOneAndUpdate(
			{userid: parseInt(req.params.userid)},
			{$set: {unitno: parseInt(req.body.unitno), street: req.body.street, city: req.body.city, country: req.body.country}},
			function(err, result) {
				console.log(req.body);
				if (err) { throw err; }
			});
			res.send("Update Done");
			db.close();
	}); 
});

app.post('/api/add/newuser', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		var insertRecord = { userid: parseInt(req.body.userid), username: req.body.username, password: req.body.password };
		dbo.collection("users").insertOne(insertRecord,
			function(err, result) {
				if (err) { throw err; }
				res.send("New User has been added.");
				db.close();
			});
	}); 
});

app.post('/api/add/wishlist', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		var insertRecord = { listid: parseInt(req.body.listid), userid: parseInt(req.body.userid), totalItems: parseInt(req.body.totalitems) };
		dbo.collection("wishlist").insertOne(insertRecord,
			function(err, result) {
				if (err) { throw err; }
				res.send("New Wishlist has been added.");
				db.close();
			});
	}); 
});


app.delete('/api/remove/user', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		var deleteRecord = { userid: parseInt(req.body.userid) };
		dbo.collection("users").remove(deleteRecord,
			function(err, result) {
				if (err) { throw err; }
				res.send("User has been deleted");
				db.close();
			});
	}); 
});

app.delete('/api/remove/wishlist', (req, res) => {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("shopDetails");
		var deleterecord = { listid: parseInt(req.body.listid) };
		dbo.collection("wishlist").remove(deleterecord,
			function(err, result) {
				if (err) { throw err; }
				res.send("Wishlist has been removed.");
				db.close();
			});
	}); 
});



app.get('/api/test', (req,res)=> {
	res.send("Hi this is a test API");
});

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}..`));
