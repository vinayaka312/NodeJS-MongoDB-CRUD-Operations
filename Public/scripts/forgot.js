$(document).ready(()=>{
  $("#sendotp").click(()=>{
    $.post("/sendmail",{
      email:$("#email").val()
    },(data)=>{
      if(data=="true") {
        alert("OTP is sent to your email...!");
        $("#email").prop("hidden",true);
        $("#otp").prop("hidden",false);
        $("#sendotp").prop("hidden",true);
        $("#submit").prop("hidden",false);
      }
      else {
        window.location.href = "http://localhost:5001/forgotpassword";
      }
    });
  });


  $("#submit").click(()=>{
    $.post("/sendOtp",{
      otp:$("#otp").val()
    },(data)=>{
      if(data==false)
        alert("Incorrect OTP");
      else {
        $("#password").prop("hidden",false);
        $("#submit").prop("hidden",true);
        $("#confirm").prop("hidden",false);
        $("#otp").prop("hidden",true);
      }
    });
  });
  $("#confirm").click(()=>{
      var psw = $("#psw").val();
      var re_psw = $("#re_psw").val();
      if((psw!=re_psw)||(psw=="" || re_psw=="")) {
        alert("Password should match the Repeat Password");
      }
      else {
        $.post('/updatepassword',{psw:psw},(data)=>{
          if(data=="true") {
            window.location.href='http://localhost:5001/dashboard';
          }
        });
      }
  });

  $("#cancel").click(()=>{
    window.location.href = 'http://localhost:5001/SignIn';
  });
});