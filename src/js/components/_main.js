import $ from 'jquery'
import { TweenLite, Power0, Power4 } from 'gsap/TweenMax';
import '../plugins/_DrawSVGPlugin.js'; // quiet

const scrollbarSizes = () => ({
    width: window.innerWidth - document.documentElement.clientWidth,
    // height: document.querySelector('.timeline_inner').offsetHeight - document.querySelector('.timeline_inner').clientHeight
});

const linesHeigth = () => {
    const main = document.querySelector('.main');
    const hintGraph = document.querySelector('.hint--graph');
    const hintEvent = document.querySelector('.hint--event');
    const lead = document.querySelector('.lead');
    const scrollbarWidth = scrollbarSizes().width > 0 ? scrollbarSizes().width : 0;
    // const scrollbarHeight = scrollbarSizes().height > 0 ? scrollbarSizes().height : 0;
    // console.log(scrollbarHeight);
    $('.main_inner').css('transform', `translateX(${scrollbarWidth / 2}px)`)

    $('.hint--graph .hint_line').height(main.offsetHeight - hintGraph.offsetTop - (hintGraph.offsetHeight / 2) - 122);
    $('.hint--event .hint_line').height(main.offsetHeight - hintEvent.offsetTop - (hintEvent.offsetHeight / 2) - 156)
    $('.lead_line').attr('data-height', main.offsetHeight - lead.offsetTop - (lead.offsetHeight / 2) - 158)
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


    TweenLite.fromTo('#gHintMask path', 1, { drawSVG: '100% 100%' }, { drawSVG: true, ease: Power0.easeNone, delay: 0.1 })
    TweenLite.to('.hint--graph .hint_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.1 })
    
    TweenLite.to('.hint--event', 0.3, { opacity: 1, delay: 0.1 })
    TweenLite.fromTo('#gEventMask path', 1, { drawSVG: '50% 50%' }, { drawSVG: true, delay: 0.4 })
    TweenLite.to('.hint--event .hint_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.4 })
    
    TweenLite.to('.lead', 0.3, { opacity: 1, delay: 0.4 })
    TweenLite.to('.lead_line', 0.5, { width: 281, ease: Power0.easeNone, delay: 0.7 })
    TweenLite.to('.lead_line', 0.5, { height: $('.lead_line').data('height'), ease: Power0.easeNone, delay: 1.2 })
    TweenLite.to('.lead_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.7 })
    setTimeout(() => {
        $('.lead_line').addClass('expanded')
    }, 1600);
})