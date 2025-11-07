(function($) {
  "use strict"; // Start of use strict

  // Floating label headings for the contact form
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });

  // Elegant fixed navbar - always visible when scrolling
  var MQL = 992;

  // Simple fixed navbar behavior
  if ($(window).width() > MQL) {
    var headerHeight = $('#mainNav').height();
    $(window).on('scroll', function() {
      var currentTop = $(window).scrollTop();
      
      // When scrolled past the header, make it fixed
      if (currentTop > headerHeight) {
        if (!$('#mainNav').hasClass('is-fixed')) {
          $('#mainNav').addClass('is-fixed');
        }
      } else {
        // When at top, remove fixed class
        $('#mainNav').removeClass('is-fixed');
      }
    });
  }
  
  // For mobile, always show navbar when scrolling
  if ($(window).width() <= MQL) {
    $(window).on('scroll', function() {
      var currentTop = $(window).scrollTop();
      if (currentTop > 50) {
        $('#mainNav').css({
          'background-color': 'rgba(255, 255, 255, 0.98)',
          'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.05)'
        });
      } else {
        $('#mainNav').css({
          'background-color': 'white',
          'box-shadow': 'none'
        });
      }
    });
  }

})(jQuery); // End of use strict
