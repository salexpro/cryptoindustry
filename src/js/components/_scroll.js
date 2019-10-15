import TweenLite from 'gsap/TweenLite';

const html = document.querySelector('.timeline_overflow');
var body = document.querySelector('.timeline_inner');

var scroller = {
    target: document.querySelector('.konvajs-content'),
    ease: 0.05, // <= scroll speed
    endX: 0,
    x: 0,
    resizeRequest: 1,
    scrollRequest: 0,
};

var requestId = null;

TweenLite.set(scroller.target, {
    rotation: 0.01,
    force3D: true
});

window.addEventListener('load', onLoad);

function onLoad() {
    updateScroller();
    window.focus();
    window.addEventListener('resize', onResize);
    document.querySelector('.timeline_overflow').addEventListener('scroll', onScroll);
}

function updateScroller() {

    

    var resized = scroller.resizeRequest > 0;

    if (resized) {
        var width = scroller.target.clientWidth;
        body.style.width = width + 'px';
        scroller.resizeRequest = 0;
    }

    var scrollX = html.scrollLeft || 0;
    // console.log(scrollX);
    scroller.endX = scrollX;
    scroller.x += (scrollX - scroller.x) * scroller.ease;

    if (Math.abs(scrollX - scroller.x) < 0.05 || resized) {
        scroller.x = scrollX;
        scroller.scrollRequest = 0;
    }

    TweenLite.set(scroller.target, {
        x: -scroller.x
    });

    requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
}

// const hideUnused = () =>{
//     const ovf = document.querySelector('.timeline_overflow').scrollLeft;
//     const mrg = document.querySelector('.timeline_events').offsetLeft;
//     console.log('check')
//     document.querySelectorAll('.timeline_event').forEach(el => {
//         // el.setAttribute('data-offset', (el.offsetLeft + mrg + 114) - ovf)
//         const elOffset = (el.offsetLeft + mrg + 200);
//         if ((ovf > elOffset) || ((ovf + document.documentElement.clientWidth) < (el.offsetLeft + mrg - 50))) {
//             el.style.visibility = 'hidden'
//         } else {
//             el.style.visibility = 'visible'
//         }
//     });
// }

function onScroll() {
    scroller.scrollRequest++;
    if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
    }
    // hideUnused()
}

function onResize() {
    scroller.resizeRequest++;
    if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
    }
} 
