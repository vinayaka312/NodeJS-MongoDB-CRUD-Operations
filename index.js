var express = require("express");                           //modules insertion....
var path = require("path");
var mongo = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
var session = require("express-session");
var nodemailer = require('nodemailer');
var app = express();

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"Public")));

app.use(session({                                           //session declaration....
  secret:'LetsGo',
  resave:false,
  saveUninitialized:true
}));
var sess;
var otp;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'majjigetambli@gmail.com',
    pass: 'gasaGase'
  }
});

var  db;
var col;
const url = "mongodb://localhost:27017";
mongo.connect(url,(err,result1)=>{                                        //database connected
 db = result1.db("test");
 col = db.collection ("users");
});  

app.get('/',(req,res)=>{                                    //home page loader
  sess = req.session;
  if(sess.email)
    res.sendFile(__dirname+'/dashboard.html');
  else
    res.sendFile(__dirname+'/home.html');
    
});

app.get('/SignUp',(req,res)=>{                                     //SignUp page loader
    res.sendFile(__dirname+'/signup.html');
 
});
app.post('/Signup',(req,res)=>{                                   //Writing the Persons details
  sess = req.session;
  var Fname = req.body.fname;
  var Lname = req.body.lname;
  var gender = req.body.gender;
  var age = req.body.age;
  var email = req.body.email;
  psw = req.body.psw;
  sess.psw = psw;
  var repsw = req.body.psw_repeat;

    col.find({Email:{$eq:email}}).toArray((err,result)=>{
      console.log(result.length+" "+result);
        if(result.length>0) {
          res.send("<body><script>alert('Entered email already exist..!');window.location.href='/SignUp'; </script></body>");
        }
        else {
          if (psw != repsw) {
            res.send("<body><script>alert('Password is not matching');window.location.href='/SignUp'; </script></body>");
          }
          else {
            sess.email = email;
            col.insertOne({First_name:Fname,Last_name:Lname,Gender:gender,Age:age,Email:email,Password:psw});
            res.send("<script>window.location.href = 'http://localhost:5001/Dashboard'</script>");
          }
        }
    });
})


app.get('/SignIn',(req,res)=>{                                  //SignIn page Loader
    res.sendFile(__dirname+'/signin.html');
});

app.post("/Signin",(req,res)=>{                         //Chenking the user
   sess = req.session;
  var username = req.body.uname;
  var password = req.body.psw;
  col.find({$and:[{Email:{$eq:username}},{Password:{$eq:password}}]}).toArray((err,result)=>{
    if(!err) {
      if(result.length) {
        sess.email = username;
        sess.psw = password;
        res.send("<script>window.location.href = 'http://localhost:5001/Dashboard'</script>");
      }
      else {
        res.send("<body><script>alert('Invalid UserName Or Password');window.location.href='/SignIn'; </script></body>");
      }
    }
  });
});

app.get("/get_details",(req,res)=>{                                     //Reading the Users dettails
  sess = req.session;
  col.find({Email:{$eq:sess.email}}).toArray((err,result)=>{
    if(!err) { 
      if(result.length!=0)
        res.send(result);
      else
        res.sendFile(__dirname+"/home.html");
    } 
      
      
  });
});

app.get("/dashboard",(req,res)=>{                             //dashboard loader
  sess = req.session;
  if(sess.email)
    res.sendFile(__dirname+"/dashboard.html");  
  else
  res.send("<script>window.location.href = 'http://localhost:5001'</script>");
  
    
});

app.get("/logout",(req,res)=>{                           //logout from the session
  sess = req.session;
  sess.destroy(()=>{});
  res.sendFile(__dirname+"/home.html");
});

app.get("/delete",(req,res)=>{                //Deleting the User
  sess = req.session;
  var email = sess.email;
  sess.destroy(()=>{});
  col.remove({Email:{$eq:email}})
  res.sendFile(__dirname+"/home.html");
});

app.post('/update',(req,res)=>{                 //Updatinig the user details
  sess = req.session;
  var Fname = req.body.fname;
  var Lname = req.body.lname;
  var gender = req.body.gender;
  var age = req.body.age;
  var email = sess.email;
  sess.email = req.body.email;
  col.update({Email:email},{First_name:Fname,Last_name:Lname,Gender:gender,Age:age,Email:sess.email,Password:sess.psw})
  res.send();
});

app.get("/changePassword",(req,res)=>{
  sess = req.session;
  if(sess.email) {
    otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    var content = 'Your one time password is ' +otp;
    var mailOptions = {
      from: 'majjigetambli@gmail.com',
      to: sess.email,
      subject: 'Your One Time Password',
      text: content
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.sendFile(__dirname+"/change_password.html");
  }
  else
    res.send("<script>window.location.href='http://localhost:5001/'</script>")
});

app.get("/forgotPassword",(req,res)=>{
  res.sendFile(__dirname+"/forgot.html");
});

app.post("/sendmail",(req,res)=>{
  var email = req.body.email;
  col.find({Email:{$eq:email}}).toArray((err,result)=>{
    if(result.length==1) {
      res.send("true");
    }
    else
      res.send("false");
  });
});

app.post("/sendotp",(req,res)=>{
  sess = req.session;
  var sentotp = req.body.otp;
  if(sentotp == otp) {
    res.send(true);
  }
  else {
    res.send(false);
  }
})

app.post("/updatepassword",(req,res)=>{
  sess = req.session;
  var psw = req.body.psw;
  col.updateOne({Password:{$eq:sess.psw}},{$set:{Password:psw}});
  console.log("HI");
  res.send("true");
});

app.listen(5001);  //server listening at port 3001