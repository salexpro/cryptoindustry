import $ from 'jquery'
// import { TweenMax, Elastic } from 'gsap/TweenMax';
// import 'plugins/_DrawSVGPlugin.js'; // quiet 

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
    $('.lead_line').height(main.offsetHeight - lead.offsetTop - (lead.offsetHeight / 2) - 158)
}

$(window).resize(() => {
    linesHeigth();
})

linesHeigth();