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
    const scrollbarWidth = scrollbarSizes().width > 0 ? scrollbarSizes().width : 0;
    // const scrollbarHeight = scrollbarSizes().height > 0 ? scrollbarSizes().height : 0;
    // console.log(scrollbarHeight);
    $('.main_inner').css('transform', `translateX(${scrollbarWidth / 2}px)`)

    const graphBreakpoint = isLandscape ? isPortrait ? 46 : 36 : 64;
    $graphLine.attr('data-width', isTablet ? $('.hint--graph').offset().left - (isLandscape ? 10 : 20) : 160);
    $graphLine.attr('data-height', main.offsetHeight - hintGraph.offsetTop - (hintGraph.offsetHeight / 2) - header.offsetHeight - graphBreakpoint);
    if ($graphLine.hasClass('expanded')) {
        $graphLine.width($graphLine.attr('data-width'))
        $graphLine.height($graphLine.attr('data-height'))
    } 
    const eventWBreakpoint = isLandscape ? isPortrait ? 552 : 751 : 947;
    const eventHBreakpoint = isLandscape ? isPortrait ? 80 : 70 : 98;
    $('.hint--event .hint_line').width(isTablet ? eventWBreakpoint - $('.hint--event').offset().left : 304);
    if (isTablet) $('.hint--event .hint_line').width($('.hint--event .hint_line').width() + $('.hint--event .hint_line').width() * 0.112)
    $('.hint--event .hint_line').height(main.offsetHeight - hintEvent.offsetTop - (hintEvent.offsetHeight / 2) - header.offsetHeight - eventHBreakpoint)

    const leadBreakpoint = isLandscape ? isPortrait ? 82 : 72 : 100;
    $leadLine.attr('data-width', isTablet ? main.children[0].offsetLeft + lead.offsetLeft - 78 : 280);
    $leadLine.attr('data-height', main.offsetHeight - lead.offsetTop - (lead.offsetHeight / 2) - header.offsetHeight - leadBreakpoint);
    if ($leadLine.hasClass('expanded')) {
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
    console.log('loaded')
    TweenLite.to('.preloader', 0.3, {autoAlpha: 0})

    TweenLite.to('.block--left .block_inner', 0.4, { x: 0, opacity: 1, delay: 0.1})
    TweenLite.to('.block--wide .block_inner', 0.4, { x: 0, opacity: 1, delay: 0.2})


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
})

$('.header_hamb').click(() => {
    TweenLite.to('#menu', 0.5, { x: 0})
    TweenLite.to('.js-off-canvas-overlay', 0.5, { autoAlpha: 1 })
})

$('.js-off-canvas-overlay').click(() => {
    TweenLite.to('#menu', 0.5, {
        x: document.querySelector('#menu').offsetWidth
    })
    TweenLite.to('.js-off-canvas-overlay', 0.5, { autoAlpha: 0 })
})