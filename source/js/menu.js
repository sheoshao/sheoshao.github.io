
  var navMain = document.querySelector('.main-nav');
  var navToggle = document.querySelector('.main-nav__toggle');

  navMain.classList.remove('main-nav--nojs');
  navMain.classList.remove('main-nav--opened');
  navMain.classList.add('main-nav--closed');

  navToggle.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--opened')) {
      navMain.classList.remove('main-nav--opened');
      navMain.classList.add('main-nav--closed');
    } else {
      navMain.classList.add('main-nav--opened');
      navMain.classList.remove('main-nav--closed');
    }
  });

  $('.slick-slider').slick({
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 2000,
    lazyLoad: 'progressive',
    arrows: false,
    dots: true
  });

  $('.slick-slider-nav').slick({
    fade: true,
    cssEase: 'linear',
    lazyLoad: 'progressive',
    dots: false,
    appendArrows: $(".slider-nav__buttons"),
    prevArrow: '<button type="button" class="slick-prev">Предыдущая</button>',
    nextArrow: '<button type="button" class="slick-next">Следующая</button>'
  });