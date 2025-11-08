$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
      var name = $("input#name").val();
      var email = $("input#email").val();
      var phone = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      $this = $("#sendMessageButton");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
      
      // Usar PHP con PHPMailer y SMTP de DonDominio
      $.ajax({
        url: "mail/contact_me.php",
        type: "POST",
        data: {
          name: name,
          phone: phone,
          email: email,
          message: message
        },
        cache: false,
        success: function(response) {
          if (response.trim() === 'success') {
            $('#success').html("<div class='alert alert-success'>");
            $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
              .append("</button>");
            $('#success > .alert-success')
              .append("<strong>Su mensaje ha sido enviado correctamente. </strong>");
            $('#success > .alert-success')
              .append('</div>');
            $('#contactForm').trigger("reset");
          } else {
            $('#success').html("<div class='alert alert-danger'>");
            $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
              .append("</button>");
            $('#success > .alert-danger').append($("<strong>").text("Lo sentimos " + firstName + ", parece que ha habido un error al enviar el e-mail. Por favor, inténtelo de nuevo más tarde."));
            $('#success > .alert-danger').append('</div>');
          }
        },
        error: function() {
          $('#success').html("<div class='alert alert-danger'>");
          $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-danger').append($("<strong>").text("Lo sentimos " + firstName + ", parece que ha habido un error al enviar el e-mail. Por favor, inténtelo de nuevo más tarde."));
          $('#success > .alert-danger').append('</div>');
        },
        complete: function() {
          setTimeout(function() {
            $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
          }, 1000);
        }
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});


/*Needed for opening hours */
var now = new Date();
var weekday = new Array(7);
weekday[0] = "Lunes";
weekday[1] = "Master";
weekday[2] = "Miercoles";
weekday[3] = "Jueves";
weekday[4] = "Viernes";
weekday[5] = "Sábado";
weekday[6] = "Domingo";

var checkTime = function() {
  var today = weekday[now.getDay()];
  var timeDiv = document.getElementById('timeDiv');
  var dayOfWeek = now.getDay();
  var hour = now.getHours();
  var minutes = now.getMinutes();

  //add AM or PM
  var suffix = hour >= 12 ? "PM" : "AM";

  // add 0 to one digit minutes
  if (minutes < 10) {
    minutes = "0" + minutes
  };

  if ((dayOfWeek == 0 || dayOfWeek == 1) && hour >= 8 && hour <= 16) {
    hour = ((hour + 11) % 12 + 1); //i.e. show 1:15 instead of 13:15
    timeDiv.innerHTML = 'Es ' + today + ' ' + hour + ':' + minutes + suffix + ' - estamos abiertos!';
    timeDiv.className = 'open';
  } 
  
  else if ((dayOfWeek == 2 || dayOfWeek == 3 || dayOfWeek == 4) && hour >= 8 && hour <= 16) {
    hour = ((hour + 11) % 12 + 1);
    timeDiv.innerHTML = 'Es ' + today + ' ' + hour + ':' + minutes + suffix + ' - estamos abiertos!';
    timeDiv.className = 'open';
  } 
  
  else {
    if (hour == 5 || hour == 6 || hour > 16) {
      hour = ((hour + 11) % 12 + 1); //i.e. show 1:15 instead of 13:15
    }
    timeDiv.innerHTML = 'Es ' + today + ' ' + hour + ':' + minutes + suffix + ' - estamos cerrados!';
    timeDiv.className = 'closed';
  }
};

var currentDay = weekday[now.getDay()];
var currentDayID = "#" + currentDay; //gets todays weekday and turns it into id
$(currentDayID).toggleClass("today"); //hightlights today in the view hours modal popup

setInterval(checkTime, 1000);
checkTime();
