var details;

$(window).load(()=>{
  $.get("/get_details",(data)=>{
    details = data;
    if(data.length==0)
      window.location.href = 'http://localhost:5001/';
    $("#radio").prop("hidden",true);
    $("#fname").val(details[0].First_name);
    $("#lname").val(details[0].Last_name);
    $("#gender").val(details[0].Gender);
    $("#age").val(details[0].Age);
    $("#email").val(details[0].Email);
  });
});

function check() {
  if(($("#fname").val()=="")||($("#lname").val()=="")||($("#gender").val()=="")||($("#age").val()=="")||($("#email").val()=="")) {
    alert("Fill all the details");
    $("#fname").val(details[0].First_name);
    $("#lname").val(details[0].Last_name);
    $("#gender").val(details[0].Gender);
    $("#age").val(details[0].Age);
    $("#email").val(details[0].Email);
    $("#radio").prop("hidden",false);
    $("#text").prop("hidden",true);
    return false;
  }
  else {
    return true;
  }
}

$(document).ready(()=>{
  $("#logout").click(()=>{
    $.get("/logout",()=>{
      window.location.href = 'http://localhost:5001/';
    });

  });

  $("#edit").click(()=>{
    $("#confirm_cancel").prop("hidden",false);
    $("#edit_submit").prop("hidden",true);
    $("input").prop("disabled",false);
    $("#radio").prop("hidden",false);
    $("#text").prop("hidden",true);
  }); 

    $("#delete").click(()=>{
      if(confirm("Confirm to Delete...!")) {
        $.get("/delete",()=>{
          alert("Deleted..!");
          $.get("/logout",()=>{
            window.location.href = 'http://localhost:5001/';
          });
        });
      }
    });

  $("#cancel").click(()=>{
    window.location.href = 'http://localhost:5001/dashboard';
  });

  $("#confirm").click(()=>{
    $("#gender").val($("input[type='radio']:checked").val());
    
    $("#radio").prop("hidden",true);
    $("#text").prop("hidden",false);
    if(check()==true) {
      $.post("/update",{
        fname: $("#fname").val(),
        lname: $("#lname").val(),
        gender: $("#gender").val(),
        age: $("#age").val(),
        email: $("#email").val()
      },()=>{
        window.location.href = 'http://localhost:5001/dashboard';
      });
    }
  });
});
