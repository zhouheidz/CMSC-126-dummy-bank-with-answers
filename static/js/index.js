// $(function() {

//     $('#login-form-link').click(function(e) {
// 		$("#login-form").delay(100).fadeIn(100);
//  		$("#signup-form").fadeOut(100);
// 		$('#signup-form-link').removeClass('active');
// 		$(this).addClass('active');
// 		e.preventDefault();
// 	});

// 	$('#signup-form-link').click(function(e) {
// 		$("#signup-form").delay(100).fadeIn(100);
//  		$("#login-form").fadeOut(100);
// 		$('#login-form-link').removeClass('active');
// 		$(this).addClass('active');
// 		e.preventDefault();
// 	});

// });


$(document).ready(function(){
	/* Login & Signup Toggle */
	var cardToggle = 0;	

$('.toggle-link').on('click', function(event){
    event.preventDefault();
		if(cardToggle == 0 ) {
      $('.signup-box').removeClass('active'); 
      $(this).addClass("active");              
			$(this).text('Login');
			$('.login-box').animate({
				right: '350px'
			});
			$('.signup-box').animate({
				right: '0'
			});      	
			cardToggle = 1;
      $('.login-box').removeClass('active');
      $(this).addClass('active');
		}
    else {
      $('.login-box').removeClass('active');
      $(this).addClass("active");      
			$(this).text('Signup');
			$('.login-box').animate({
				right: '0'
			});
			$('.signup-box').animate({
				right: '-350px'
			});
      $('.signup-box').removeClass('active');
      $(this).addClass('active');
			cardToggle = 0;
		}
	})
})


$(".choose").click(function() {
  $(".choose").addClass("active");
  $(".choose > .icon").addClass("active");
  $(".deposit").removeClass("active");
  $(".withdraw").removeClass("active");
  $(".profile").removeClass("active");
  $(".deposit > .icon").removeClass("active");
  $(".withdraw > .icon").removeClass("active");
  $(".profile > .icon").removeClass("active");
  $("#line").addClass("one");
  $("#line").removeClass("two");
  $("#line").removeClass("three");
  $("#line").removeClass("four");
})

$(".deposit").click(function() {
  $(".deposit").addClass("active");
  $(".deposit > .icon").addClass("active");
  $(".choose").removeClass("active");
  $(".withdraw").removeClass("active");
  $(".profile").removeClass("active");
  $(".choose > .icon").removeClass("active");
  $(".withdraw > .icon").removeClass("active");
  $(".profile > .icon").removeClass("active");
  $("#line").addClass("two");
  $("#line").removeClass("one");
  $("#line").removeClass("three");
  $("#line").removeClass("four");
})

$(".withdraw").click(function() {
  $(".withdraw").addClass("active");
  $(".withdraw > .icon").addClass("active");
  $(".deposit").removeClass("active");
  $(".choose").removeClass("active");
  $(".profile").removeClass("active");
  $(".deposit > .icon").removeClass("active");
  $(".choose > .icon").removeClass("active");
  $(".profile > .icon").removeClass("active");
  $("#line").addClass("three");
  $("#line").removeClass("two");
  $("#line").removeClass("one");
  $("#line").removeClass("four");
})

$(".profile").click(function() {
  $(".profile").addClass("active");
  $(".profile > .icon").addClass("active");
  $(".deposit").removeClass("active");
  $(".withdraw").removeClass("active");
  $(".choose").removeClass("active");
  $(".deposit > .icon").removeClass("active");
  $(".withdraw > .icon").removeClass("active");
  $(".choose > .icon").removeClass("active");
  $("#line").addClass("four");
  $("#line").removeClass("two");
  $("#line").removeClass("three");
  $("#line").removeClass("one");
})

$(".choose").click(function() {
  $("#first").addClass("active");
  $("#second").removeClass("active");
  $("#third").removeClass("active");
  $("#fourth").removeClass("active");
})

$(".deposit").click(function() {
  $("#first").removeClass("active");
  $("#second").addClass("active");
  $("#third").removeClass("active");
  $("#fourth").removeClass("active");
})

$(".withdraw").click(function() {
  $("#first").removeClass("active");
  $("#second").removeClass("active");
  $("#third").addClass("active");
  $("#fourth").removeClass("active");
})

$(".profile").click(function() {
  $("#first").removeClass("active");
  $("#second").removeClass("active");
  $("#third").removeClass("active");
  $("#fourth").addClass("active");
})