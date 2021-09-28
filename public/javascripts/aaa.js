$(document).ready(function () {
    $(window).scroll(function () {
                if ($(this).scrollTop() >= 400) {
                    $('.top').fadeIn();
                    $('.wrapper').fadeIn().addClass("nav_wrapper_change")
                } else if ($(this).scrollTop() < 400) {
                    $('.top').fadeOut();
                    $('.wrapper').fadeOut().removeClass("nav_wrapper_change")
                }
            });
            if ($('.wrapper').offset().top === 0) {
                $('.wrapper').css({
                    'display': 'none'
                })
            }
            $('.top').click(function () {
                $('html, body').animate({
                    scrollTop: 0
                },
                1000);
                return false
            })
            $('.go_about').click(function () {
                var offset = $("#about").offset();
                $('html, body').animate({
                    scrollTop:offset.top
                },
                1000);
                return false
            })
            $('.go_awards').click(function () {
                var offset = $("#award").offset();
                $('html, body').animate({
                    scrollTop:offset.top
                },
                1000);
                return false
            })
            $('.go_members').click(function () {
                var offset = $("#member").offset();
                $('html, body').animate({
                    scrollTop:offset.top
                },
                1000);
                return false
            })
            $('.go_connection').click(function () {
                var offset = $("#connection").offset();
                $('html, body').animate({
                    scrollTop:offset.top
                },
                1000);
                return false
            })
        }); 