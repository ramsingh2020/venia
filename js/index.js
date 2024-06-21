$(function(){

  var productShownNumber = 9;
  $(".product-listing .product-box").slice(0, productShownNumber).show();
  $(document).on('click','.show-more-btn',function(e){
    productShownNumber += 9;
    e.preventDefault();
    $(".product-listing .product-box").slice(0, productShownNumber).show();
    if($('.product-listing .product-box:last-child').is(":visible")){
      $('.show-more-btn').addClass('disable');
    }
  });

  if ($(window).width() < 768){
      $('header .hamberger-btn').click(function(){
          $('body').toggleClass('contentoverflow')
          $('header nav').toggleClass('visible');
          $('header').toggleClass('menuoverlay');
          return false;
      });

      $('header .cart-btn').click(function(){
          $('body').toggleClass('contentoverflow')
          $('.filter-sec').toggleClass('visible');
          $('header').toggleClass('menuoverlay');
          return false;
      });

      $(document).on("click", function(event){
        var $trigger = $('header .hamberger-btn, header nav, header .cart-btn, .filter-sec');
        if($trigger !== event.target && !$trigger.has(event.target).length){
            $('header').removeClass('menuoverlay');
            $('header nav').removeClass('visible');
            $('body').removeClass('contentoverflow');
            $('.filter-sec').removeClass('visible');
        }
      });
  }

});
