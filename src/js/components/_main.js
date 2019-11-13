import $ from 'jquery'
import { TweenLite, Power0, Power4 } from 'gsap/TweenMax';
import '../plugins/_DrawSVGPlugin.js'; // quiet

const scrollbarSizes = () => ({
    width: window.innerWidth - document.documentElement.clientWidth,
    // height: document.querySelector('.timeline_inner').offsetHeight - document.querySelector('.timeline_inner').clientHeight
});

const main = document.querySelector('.main');
const header = document.querySelector('.header');
const hintGraph = document.querySelector('.hint--graph');
const hintEvent = document.querySelector('.hint--event');
const lead = document.querySelector('.lead');
const $leadLine = $('.lead_line');
const $graphLine = $('.hint--graph .hint_line');

const linesHeigth = () => {
    const isTablet = main.offsetWidth < 1280;
    const isLandscape = main.offsetWidth < 1024;
    const isPortrait = main.offsetWidth < 769;
    const isMobile = main.offsetWidth < 640;
    const scrollbarWidth = scrollbarSizes().width > 0 ? scrollbarSizes().width : 0;
    // const scrollbarHeight = scrollbarSizes().height > 0 ? scrollbarSizes().height : 0;
    // console.log(scrollbarHeight);
    $('.main_inner').css('transform', `translateX(${scrollbarWidth / 2}px)`)

    const graphBreakpoint = isMobile ? 26 : isLandscape ? isPortrait ? 46 : 36 : 64;
    $graphLine.attr('data-width', isTablet ? $('.hint--graph').offset().left - (isMobile ? 5 : isLandscape ? 10 : 20) : 160);
    $graphLine.attr('data-height', main.offsetHeight - hintGraph.offsetTop - (hintGraph.offsetHeight / 2) - header.offsetHeight - graphBreakpoint);
    if ($graphLine.hasClass('expanded')) {
        $graphLine.width($graphLine.attr('data-width'))
        $graphLine.height($graphLine.attr('data-height'))
    } 
    const eventWBreakpoint = isLandscape ? isPortrait ? 552 : 751 : 947;
    const eventHBreakpoint = isMobile ? 60 : isLandscape ? isPortrait ? 80 : 70 : 98;
    $('.hint--event .hint_line').width(isMobile ? 74 : isTablet ? eventWBreakpoint - $('.hint--event').offset().left : 304);
    if (isTablet && !isMobile) $('.hint--event .hint_line').width($('.hint--event .hint_line').width() + $('.hint--event .hint_line').width() * 0.112)
    $('.hint--event .hint_line').height(main.offsetHeight - hintEvent.offsetTop - (hintEvent.offsetHeight / 2) - header.offsetHeight - eventHBreakpoint)

    const leadBreakpoint = isMobile ? 52 : isLandscape ? isPortrait ? 82 : 72 : 100;
    $leadLine.attr('data-width', isMobile ? 65 : isTablet ? $('.lead').offset().left - 78 : 280);
    $leadLine.attr('data-height', main.offsetHeight - lead.offsetTop - (lead.offsetHeight / 2) - header.offsetHeight - leadBreakpoint);
    if ($leadLine[0].classList.contains('expanded')) {
        $leadLine.width($leadLine.attr('data-width'))
        $leadLine.height($leadLine.attr('data-height'))
    }
}

$(window).resize(() => {
    linesHeigth();
})

linesHeigth();

const bgLoaded = () => {
    $('.preloader').addClass('is_loaded')
}

const bg = new Image();
bg.onload = bgLoaded;
bg.src = 'assets/img/bg.jpg';

$(window).on('load', () => {
    const isMobile = main.offsetWidth < 640;
    TweenLite.to('.preloader', 0.3, {autoAlpha: 0})

    TweenLite.to('.block--left .block_inner', 0.4, { x: 0, opacity: 1, delay: 0.1})
    TweenLite.to('.block--wide .block_inner', 0.4, { x: 0, opacity: 1, delay: 0.2})

    if (!isMobile){
        TweenLite.to($graphLine[0], 0.5, { width: $graphLine.data('width'), ease: Power0.easeNone, delay: 0.1 })
        TweenLite.to($graphLine[0], 0.5, { height: $graphLine.data('height'), ease: Power0.easeNone, delay: 0.6 })
        TweenLite.to('.hint--graph .hint_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.1 })
        setTimeout(() => { $graphLine.addClass('expanded') }, 1100);
    
        TweenLite.to('.hint--event', 0.3, { opacity: 1, delay: 0.1 })
        TweenLite.fromTo('#gEventMask path', 1, { drawSVG: '50% 50%' }, { drawSVG: true, delay: 0.4 })
        TweenLite.to('.hint--event .hint_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.4 })

    
    
        TweenLite.to('.lead', 0.3, { opacity: 1, delay: 0.4 })
        TweenLite.to($leadLine[0], 0.5, { width: $leadLine.data('width'), ease: Power0.easeNone, delay: 0.7 })
        TweenLite.to($leadLine[0], 0.5, { height: $leadLine.data('height'), ease: Power0.easeNone, delay: 1.2 })
        TweenLite.to('.lead_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.7 })
        setTimeout(() => {
            $leadLine.addClass('expanded')
        }, 1600);
    }
})

$('.header_hamb').click(() => {
    $('.header_hamb').addClass('active');
    TweenLite.to('#menu', 0.5, { x: '0%'})
    TweenLite.to('.js-off-canvas-overlay', 0.5, { autoAlpha: 1 })
})

$('.js-off-canvas-overlay').click(() => {
    $('.header_hamb').removeClass('active');
    TweenLite.to('#menu', 0.5, {x: '100%'})
    TweenLite.to('.js-off-canvas-overlay', 0.5, { autoAlpha: 0 })
})

$('#subsButton').click(() => {
    TweenLite.to('.subscribe', 0.3, { autoAlpha: 1})
    $('.subscribe').addClass('is_open')
})

$(document).click(e => {
    var container = $('.subscribe');
    if (container.hasClass('is_open') && !($(e.target).parent().attr('id') == 'subsButton')){
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            TweenLite.to(container, 0.3, { autoAlpha: 0})
            container.removeClass('is_open');
        }
    }
});


function sendDataToForm(form_data, form) {
    $.ajax({
        url: 'https://docs.google.com/forms/d/e/1FAIpQLScpCEKrQJ7MoSryZO0KLVDmasqLDSGYEnMNYyu8B7jr9K_8cQ/formResponse',
        data: form_data,
        type: 'POST',
        dataType: 'xml',
        statusCode: {
            0: function () {
                alert('Спасибо за подписку!');
                form.find('input[type="email"]').val('');
            },
            200: function () {
                alert('Спасибо за подписку!');
                form.find('input[type="email"]').val('');
            }
        }
    });
}

$('.subscribe_form').submit(function(e) {
    e.preventDefault();
    var form_data = $(this).serialize();
    sendDataToForm(form_data, $(this));
})