$(document).ready(()=>{
  alert("OTP is sent to your email...!");
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
            window.location.href='http://localhost:5001/SignIn';
          }
        });
      }
  });

  $("#cancel").click(()=>{
    window.location.href = 'http://localhost:5001/dashboard';
  });
});