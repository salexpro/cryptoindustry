/* global player */
import $ from 'jquery';
import { TweenLite, TimelineLite } from 'gsap/TweenMax';
import Hammer from 'hammerjs';
import Drag from '../../lib/_drag'; // quiet

import { events, accRate, canvas, stage, mouse, gEvents, main, scrollbar, ranges, controls, rConfig, isTablet, isMobile} from './_config';
import { anim } from './_anim';
import * as eventsData from '../../data/events';

let isDragging = false;
let prevInd = -1;

const onTick = () => {

   

    if (stage.movable) {
        if (mouse.dest > 0) mouse.dest = 0;
        if (mouse.dest < rConfig.graphEnd()) mouse.dest = rConfig.graphEnd();

        mouse.fin += (mouse.dest - mouse.fin) / accRate;
        if (Math.abs(mouse.fin - mouse.dest) < 0.005) mouse.fin = mouse.dest;
        
        if (!isMobile() && main.dataset.visible == 'false' && mouse.fin > -5 && mouse.delta < 0 && main.dataset.animated == 'false' && scrollbar.offsetLeft == 30) {
            anim.showMain();
            main.dataset.visible = true;
        }
        if (mouse.fin == 0 && !isMobile()) stage.movable = false;
        stage.x = mouse.fin * window.devicePixelRatio;
        // if (!isDragging){
            const precentPos = stage.x * 100 / rConfig.graphEnd() / window.devicePixelRatio;
            const endScrollbarPos = document.querySelector('.timeline_years').offsetWidth - rConfig.paddings() - scrollbar.offsetWidth;
            scrollbar.style.left = `${endScrollbarPos * precentPos / 100}px`;
            // console.log(Math.round(precentPos))
        // }
    }
    if (main.dataset.visible == 'true' && mouse.delta >= 5 && main.dataset.animated == 'false') {
        console.log(mouse.delta, main.dataset.visible, main.dataset.animated, mouse.fin, mouse.dest)
        if (isMobile()) {
            anim.mobileStep(main.dataset.step)
        } else {
            anim.hideMain();
            main.dataset.visible = false;
            mouse.dest = -0.0001;
        }
    }

    const { x, y } = mouse.mouse;
    const corrX = x - mouse.fin;
    const corrY = y - rConfig.topHeight() - (stage.y / window.devicePixelRatio) + document.querySelector('.wrap').scrollTop;

    events.forEach(({ shape, button }, i) => {
        const dotXStart = shape.pX - 10;
        const dotXEnd = shape.pX + 10;
        const dotYStart = shape.dY - 10;
        const dotYEnd = shape.dY + 10;

        const isDotHovered = corrX > dotXStart && corrX < dotXEnd && corrY > dotYStart && corrY < dotYEnd;

        if ((corrX > shape.x &&
            corrX < shape.x + rConfig.shapeSize() &&
            corrY > shape.y &&
            corrY < shape.y + rConfig.shapeSize()) ||
            isDotHovered) {
            shape.hovered = true;
        } else {
            shape.hovered = false;
        }
        if (!shape.hovered && shape.changed && (shape.hoverable || !isDotHovered) && !shape.opened && !shape.opening) {
            anim.mouseOut(i);
            shape.changed = false;
        }
        if (shape.hovered && !shape.changed && (shape.hoverable || isDotHovered) && !shape.opened && main.dataset.visible == 'false' && main.dataset.animated == 'false') {
            anim.mouseOver(i);
            shape.changed = true;
        }
        
        shape.dotHovered = isDotHovered;
        if (isDotHovered && !shape.showed && !shape.revealing && !shape.fadedOut && main.dataset.visible == 'false' && main.dataset.animated == 'false') {
            if (!shape.revealed) {
                anim.revealEvent(i)
            } else {
                anim.showEvent(i)
            }
            shape.dotInitiated = true;
            anim.hideGroup(i)
        } 
        if (!shape.hovered && shape.dotInitiated && shape.dotInitiated != undefined){
            shape.dotInitiated = false;
        }

        if (shape.opened && button) {
            const buttonX = shape.x + (isMobile() ? 11 : 173) + button.x;
            const buttonY = shape.y + 11 + button.y - 35;
            if (corrX > buttonX &&
                corrX < buttonX + button.buttonWidth &&
                corrY > buttonY &&
                corrY < buttonY + 35) {
                button.hovered = true;
            } else {
                button.hovered = false;
            }

            if (button.hovered && !button.changed) {
                anim.buttonOver(i)
                button.changed = true;
            }
            if (!button.hovered && button.changed) {
                anim.buttonOut(i)
                button.changed = false;
            }
        }

        if (shape.x < (Math.abs(mouse.fin) + canvas.offsetWidth) && !shape.revealed && !shape.revealing && ((shape.pX - 60) > canvas.offsetWidth)) {
            const gid = gEvents.findIndex(({ group }) => group.includes(i));
            if (gid != -1) {
                anim.changeEvent(gid)
            } else {
                anim.revealEvent(i)
            }
        }
    });

    if(stage.movable){
        const corrM = mouse.fin + (isMobile() ? rConfig.halfScreen() : 0);
        if (corrM > -950) {
            stage.y = 0;
        }
        if (corrM < -950 && corrM > -2300) {
            // stage.y = corrM ;
            tl.progress(Math.abs(corrM + 950) / 1350)
        }
        if (corrM < -2300 && corrM > -3600) {
            // stage.y = corrM ;
            tl2.progress(Math.abs(corrM + 2300) / 1300)
        }

        if (corrM < -4100 && corrM > -5700) {
            tl3.progress(Math.abs(corrM + 4100) / 1600)
        }

        if (corrM < -6300 && corrM > -6860) {
            tl4.progress(Math.abs(corrM + 6300) / 560)
        }
    }

    let rLabel = ranges[0].label;
    let activeControls = controls[0];
    let ind = 0;
    if (mouse.fin > ranges[1].x()) {
        rLabel = ranges[0].label;
        activeControls = controls[0];
        ind = 0;
    }
    if (mouse.fin <= ranges[1].x() && mouse.fin > ranges[2].x()) {
        rLabel = ranges[1].label;
        activeControls = controls[1];
        ind = 1;
    }
    if (mouse.fin <= ranges[2].x() && mouse.fin > ranges[3].x()) {
        rLabel = ranges[2].label;
        activeControls = controls[1];
        ind = 2;
    }
    if (mouse.fin <= ranges[3].x() && mouse.fin > ranges[4].x()) {
        rLabel = ranges[3].label;
        activeControls = controls[1];
        ind = 3;
    }
    if (mouse.fin <= ranges[4].x() && mouse.fin > ranges[5].x()) {
        rLabel = ranges[4].label;
        activeControls = controls[1];
        ind = 4;
    }
    if (mouse.fin <= ranges[5].x()) {
        rLabel = ranges[5].label;
        activeControls = controls[2];
        ind = 5;
    }
    if (prevInd !== ind) {
        $('#menu li').removeClass('active');
        $(`#menu li:eq(${ind})`).addClass('active')
        $('.timeline_years_button span').text(rLabel);
        $('.timeline_controls_inner').html(
            activeControls.reduce((acc, btn) => 
                `${acc}
                    <button class="timeline_control timeline_control--${btn.direction}" data-x="${btn.x()}">
                        ${btn.label}
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="8" viewBox="0 0 17 8"><use fill="currentColor" xlink:href="./assets/img/icons.svg#arrow_${btn.arrow}"></use></svg>
                    </button>
                `, '')
        );

        if (ind == 5) {
            anim.showEnd()
        } else {
            anim.hideEnd()
        }

        prevInd = ind;
    }

    stage.update();
}

const corr = (canvas.offsetHeight > 662) ? (canvas.offsetHeight - 662) / 2.5 : 0;

const tl = new TimelineLite({ paused: true }).to(stage, 1, { y:  (250 - corr) * window.devicePixelRatio });
const tl2 = new TimelineLite({ paused: true }).to(stage, 1, { y: (180 - corr) * window.devicePixelRatio });
const tl3 = new TimelineLite({ paused: true }).to(stage, 1, { y: (300 - corr) * window.devicePixelRatio });
const tl4 = new TimelineLite({ paused: true }).to(stage, 1, { y: ((isMobile() ? 400 : 350) - corr) * window.devicePixelRatio });


canvas.addEventListener('click', () => {

    const { x, y } = mouse.mouse;
    const corrX = x - mouse.fin;
    const corrY = y - rConfig.topHeight() - (stage.y / window.devicePixelRatio) + document.querySelector('.wrap').scrollTop;

    events.some(({ shape, content, button }, i) => {

        const eventHeight = content.eventHeight + 22;

        const dotXStart = shape.pX - 10;
        const dotXEnd = shape.pX + 10;
        const dotYStart = shape.dY - 10;
        const dotYEnd = shape.dY + 10;

        const isDotClicked = corrX > dotXStart && corrX < dotXEnd && corrY > dotYStart && corrY < dotYEnd;

        if (((corrX > shape.x &&
            corrX < shape.x + rConfig.shapeSize() &&
            corrY > shape.y &&
            corrY < shape.y + rConfig.shapeSize()) || (shape.dotHovered && isDotClicked)) && shape.hoverable && shape.visible) {
            // console.log(shape.hoverable, shape.visible, i);
            anim.openEvent(i)
            console.log('opened')
            return true;
        }
        
        if (!(corrX > shape.x &&
            corrX < shape.x + 588 &&
            corrY > shape.y &&
            corrY < shape.y + eventHeight)
            && shape.opened && !shape.dotHovered) {
            anim.closeEvent(i)
            // console.log('closed')
            return true;
        }

        if (shape.opened && button) {
            // const buttonX = shape.x + 173 + button.x;
            // const buttonY = shape.y + 11 + button.y - 35;
            const buttonX = shape.x + (isMobile() ? 11 : 173) + button.x;
            const buttonY = shape.y + 11 + button.y - 35;
            if (corrX > buttonX &&
                corrX < buttonX + button.buttonWidth &&
                corrY > buttonY &&
                corrY < buttonY + 35) {
                if (eventsData.events[i].link) {
                    window.open(eventsData.events[i].link, '_blank');
                } else {
                    console.log(`open video ${eventsData.events[i].comment}`)
                    player.loadVideoById(eventsData.events[i].comment);
                    anim.openPopup();
                }
            }
        }
    });
    // console.log('_____________')
})


$('.reveal-overlay').click(() => {
    player.stopVideo();
    anim.closePopup();
})

const openedIndex = () => events.findIndex(({shape}) => shape.opened)

$('#menu a').click(function (e) {
    e.preventDefault();
    if (main.dataset.visible == 'true') {
        anim.hideMain();
        main.dataset.visible = false;
    }
    const oIdx = openedIndex();
    if (oIdx != -1) anim.closeEvent(oIdx);
    const el = ranges[$(this).parent().index()];
    if (isMobile()) TweenLite.to(canvas, 0.3, { css: { opacity: 1 } });
    mouse.dest = el.x();
    stage.movable = true;
})

$('.timeline_controls_inner').on('click', 'button', function () {
    if (main.dataset.visible == 'true') {
        anim.hideMain();
        main.dataset.visible = false;
    }
    const oIdx = openedIndex();
    if (oIdx != -1) anim.closeEvent(oIdx);
    mouse.dest = $(this).data('x');
    stage.movable = true;
})

$(document).on('keydown', e => {
    if (e.keyCode == 37) {
        if (stage.movable) mouse.dest += 300;
        mouse.delta = -300;
    }
    if (e.keyCode == 39) {
        if (stage.movable) mouse.dest -= 300;
        mouse.delta = 300;
    }
    if (e.keyCode == 27){
        if($('.reveal').hasClass('is_open')){
            player.stopVideo();
            anim.closePopup();
        } else {
            const oIdx = openedIndex();
            if (oIdx != -1) anim.closeEvent(oIdx);
        }
    }
});

var mc = new Hammer(scrollbar);
mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }));
mc.on('pan', handleDrag);
let lastPosX = 0;

function handleDrag(ev) {
    if (openedIndex() == -1){
        const scrollContainerWidth = document.querySelector('.timeline_years').offsetWidth - rConfig.paddings();

        // DRAG STARTED
        // here, let's snag the current position
        // and keep track of the fact that we're dragging
        if (!isDragging) {
            isDragging = true;
            lastPosX = scrollbar.offsetLeft;
        }

        // we simply need to determine where the x,y of this
        // object is relative to where it's "last" known position is
        // NOTE: 
        //    deltaX and deltaY are cumulative
        // Thus we need to always calculate 'real x and y' relative
        // to the "lastPosX/Y"
        let posX = ev.deltaX + lastPosX;
        const endPos = scrollContainerWidth - scrollbar.offsetWidth;
        if (posX < 0 && lastPosX >= 0) posX = 0;
        if (posX > endPos && lastPosX <= endPos) posX = endPos;
        mouse.delta = ev.deltaX;

        if (posX >= 0 && posX <= endPos) {
            // scrollbar.style.left = `${posX}px`;
            const percentPos = posX * 100 / endPos;
            mouse.dest = rConfig.graphEnd() * percentPos / 100;
            if (main.dataset.visible == 'true') {
                if(isMobile()){
                    anim.hideMain();
                    main.dataset.visible = false;
                }
                stage.movable = true;
            }
        }
        // move our element to that position
        // elem.style.left = posX + "px";

        // DRAG ENDED
        // this is where we simply forget we are dragging
        if (ev.isFinal) isDragging = false;
    }
}


// Graph scrolling 
if(isTablet()){
    const content = document.querySelector('.content');
    const hammertime = new Hammer(content);
    // const deltaX = 0;

    hammertime.on('pan', e => {
        if (e.pointerType == 'touch' && main.dataset.visible == 'true'){
            // const delta = deltaX + e.deltaX;
            var direction = e.offsetDirection;
            // console.log(e)
            if (main.dataset.step == '1' && isMobile() && direction === 8){
                mouse.delta = 10;
            }
            if (main.dataset.step == '2' && isMobile() && (direction === 16 || direction === 4)) {
                anim.mobileStep(main.dataset.step, 'prev')
                console.log(mouse.delta, direction)
            }
            // console.log(mouse.delta + delta)
            if ((direction === 2) && (e.deltaY < 50 && e.deltaY > -50)) {
                // if (stage.movable) {
                //     mouse.dest += !mouse.isFinal ? mouse.delta + delta : 0;
                //     mouse.isFinal = e.isFinal;
                // }
                mouse.delta = -e.deltaX;
            }
            // console.log(e)
        }
    });

    const offcanv = document.querySelector('.js-off-canvas-overlay');
    const hammeroffc = new Hammer(offcanv);
    hammeroffc.on('panright', e => {
        $('.header_hamb').removeClass('active');
        TweenLite.to('#menu', 0.5, { x: '100%' })
        TweenLite.to('.js-off-canvas-overlay', 0.5, { autoAlpha: 0 })
    })

    const options = {
        listener: canvas,
        multiplier: 2,
        cursorDown: true
    };
    const drag = new Drag(options);

    drag.on(event => {
        if (stage.movable) {
            mouse.dest += event.X;
        }
        mouse.delta = -event.X;
    });
    
}

// Switch steps mobile
if(isMobile()) {
    $('.main_down').click(() => {
        anim.mobileStep(1)
    })
    $('.main_button').click(() => {
        anim.mobileStep(main.dataset.step)
    })
}

export { onTick };