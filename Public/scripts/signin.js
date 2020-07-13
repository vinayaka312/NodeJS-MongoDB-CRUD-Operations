$(document).ready(()=>{
  $("#cancel").click(()=>{
    window.location.href = '/';
  });

  $("#submit").click(()=>{
    var password = $("#password").val();
    var username = $("#username").val();
    if(password=="" || username=="") {
      alert("Enter Username or Password...!");
    }
    else {
      alert(password+" "+username);
    }
  });
});