/* global player */
import $ from 'jquery';
import { TimelineLite } from 'gsap/TimelineLite';

import { dx, dy, events, accRate, canvas, stage, mouse, gEvents, main, ranges, controls } from './_config';
import { anim } from './_anim';
import * as eventsData from '../../data/events';

let prevInd = 0;

const onTick = () => {
    const w = document.body.offsetWidth;
    const graphEnd = -7580 + (w / 2);

    if (stage.movable) {
        if (mouse.dest > 0) mouse.dest = 0;
        if (mouse.dest < graphEnd) mouse.dest = graphEnd;

        mouse.fin += (mouse.dest - mouse.fin) / accRate;
        if (Math.abs(mouse.fin - mouse.dest) < 0.005) mouse.fin = mouse.dest;

        stage.x = mouse.fin;
    }

    const { x, y } = mouse.mouse;

    events.forEach(({ shape, button }, i) => {
        const corrX = x - mouse.fin;
        const corrY = y - 58 - stage.y;
        if (corrX > shape.x &&
            corrX < shape.x + dx &&
            corrY > shape.y &&
            corrY < shape.y + dy) {
            shape.hovered = true;
        } else {
            shape.hovered = false;
        }
        if (!shape.hovered && shape.changed && shape.hoverable && !shape.opened) {
            anim.mouseOut(i);
            shape.changed = false;
        }
        if (shape.hovered && !shape.changed && shape.hoverable && !shape.opened) {
            anim.mouseOver(i);
            shape.changed = true;
        }

        if (shape.opened && button){
            const buttonX = shape.x + 173 + button.x;
            const buttonY = shape.y + 11 + button.y - 35;
            if (corrX > buttonX &&
                corrX < buttonX + button.buttonWidth &&
                corrY > buttonY &&
                corrY < buttonY + 35) {
                    button.hovered = true;
                } else {
                    button.hovered = false;
                }

                if (button.hovered && !button.changed){
                    anim.buttonOver(i)
                    button.changed = true;
                }
                if (!button.hovered && button.changed){
                    anim.buttonOut(i)
                    button.changed = false;
                }
        }

        if (shape.x < (Math.abs(mouse.fin) + w) && !shape.revealed && !shape.revealing && ((shape.pX - 60) > w)){
            const gid = gEvents.findIndex(({ group }) => group.includes(i));
            if (gid != -1){
                anim.changeEvent(gid)
            } else {
                anim.revealEvent(i)
            }
        }
    });
    if (mouse.fin > -950) {
        stage.y = 0;
    }
    if (mouse.fin < -950 && mouse.fin > -2300) {
        // stage.y = mouse.fin ;
        tl.progress(Math.abs(mouse.fin + 950) / 1350)
    }
    if (mouse.fin < -2300 && mouse.fin > -3600) {
        // stage.y = mouse.fin ;
        tl2.progress(Math.abs(mouse.fin + 2300) / 1300)
    }

    if (mouse.fin < -4100 && mouse.fin > -5700) {
        tl3.progress(Math.abs(mouse.fin + 4100) / 1600)
    }

    if (mouse.fin < -6300 && mouse.fin > -6860) {
        tl4.progress(Math.abs(mouse.fin + 6300) / 560)
    }

    let rLabel = ranges[0].label;
    let activeControls = controls[0];
    let ind = 0;
    if (mouse.fin > ranges[1].x){
        rLabel = ranges[0].label;
        activeControls = controls[0];
        ind = 0;
    }
    if (mouse.fin <= ranges[1].x && mouse.fin > ranges[2].x){
        rLabel = ranges[1].label;
        activeControls = controls[1];
        ind = 1;
    }
    if (mouse.fin <= ranges[2].x && mouse.fin > ranges[3].x){
        rLabel = ranges[2].label;
        activeControls = controls[1];
        ind = 2;
    }
    if (mouse.fin <= ranges[3].x && mouse.fin > ranges[4].x){
        rLabel = ranges[3].label;
        activeControls = controls[1];
        ind = 3;
    }
    if (mouse.fin <= ranges[4].x && mouse.fin > ranges[5].x){
        rLabel = ranges[4].label;
        activeControls = controls[1];
        ind = 4;
    }
    if (mouse.fin == ranges[5].x){
        rLabel = ranges[5].label;
        activeControls = controls[2];
        ind = 5;
    }
    if(prevInd !== ind){
        $('#menu li').removeClass('active');
        $(`#menu li:eq(${ind})`).addClass('active')
        $('.timeline_years_button span').text(rLabel);
        $('.timeline_controls_inner').html(
            activeControls.reduce((acc, el, j) => {
                return acc + (el.length ? `<button class="timeline_control timeline_control--${(j == 0) ? 'back' : 'forward'}" data-x="${el[0]}">
                    ${(j == 0) ? '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="8" viewBox="0 0 17 8"><use fill="currentColor" xlink:href="./assets/img/icons.svg#arrow_left"></use></svg> ' : ''}
                    ${el[1]}
                    ${(j == 1) ? ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 16 8"><use fill="currentColor" xlink:href="./assets/img/icons.svg#arrow_right"></use></svg>' : ''}
                    </button>` : '<i></i>')
            }, '')
        )

        if (ind == 5){
            anim.showEnd()
        } else {
            anim.hideEnd()
        }

        prevInd = ind;
    }

    stage.update();
}

const corr = (canvas.height > 662) ? (canvas.height - 662) / 2.5 : 0;

const tl = new TimelineLite({ paused: true }).to(stage, 1, { y: 250 - corr });
const tl2 = new TimelineLite({ paused: true }).to(stage, 1, { y: 180 - corr });
const tl3 = new TimelineLite({ paused: true }).to(stage, 1, { y: 300 - corr });
const tl4 = new TimelineLite({ paused: true }).to(stage, 1, { y: 350 - corr });


canvas.addEventListener('click', () => {

    const { x, y } = mouse.mouse;
    const corrX = x - mouse.fin;
    const corrY = y - 58 - stage.y;

    events.some(({shape, content, button}, i) => {
        // console.log('_')
        const eventHeight = content.eventHeight + 22;

        if (corrX > shape.x &&
            corrX < shape.x + dx &&
            corrY > shape.y &&
            corrY < shape.y + dy &&
            shape.hoverable && shape.visible) {
            // console.log(shape.hoverable, shape.visible, i);
            anim.openEvent(i)
            // console.log('opened')
            return true;
        }
        if (!(corrX > shape.x &&
            corrX < shape.x + 588 &&
            corrY > shape.y &&
            corrY < shape.y + eventHeight)
            && shape.opened) {
            anim.closeEvent(i)
            // console.log('closed')
            return true;
        }

        if (shape.opened && button) {
            // const buttonX = shape.x + 173 + button.x;
            // const buttonY = shape.y + 11 + button.y - 35;

            if (button.hovered) {
                if (eventsData.events[i].link) {
                    window.open(eventsData.events[i].link, '_blank');
                } else {
                    console.log(`open video ${eventsData.events[i].comment}`)
                    player.loadVideoById(eventsData.events[i].comment);
                    $('#video').foundation('open');
                }
            }
        }
    });
    // console.log('_____________')
})

$('#video').on('closed.zf.reveal', () => {
    player.stopVideo();
});

$('#menu a').click(function (e) {
    e.preventDefault();
    if (main.dataset.visible == 'true') {
        anim.hideMain();
        main.dataset.visible = false;
    }
    const el = ranges[$(this).parent().index()];
    mouse.dest = el.x;
})

$('.timeline_controls_inner').on('click', 'button', function () {
    if (main.dataset.visible == 'true') {
        anim.hideMain();
        main.dataset.visible = false;
    }
    mouse.dest = $(this).data('x');
})

// const repositionElems = (w, h) => {
//     blueLine.x = w / 2;
//     blueLine.y = h - graphParams.blueHeight - 118;
//     yellowLine.x = (w / 2) + graphParams.blueWidth - 1;
//     yellowLine.y = h - (graphParams.blueHeight + graphParams.yellowHeight - 43) - 118;
//     bottomLine.graphics
//         .ss(2)
//         .s(palette.blue)
//         .mt(0, h - 120)
//         .lt(canvas.offsetWidth / 2, h - 120)
//         .es();

//     const lineBottom = h - 120;
//     eventsData.events.forEach(({ left, prvBottom, dotBottom }, i) => {

//         const coords = {
//             pX: ((w - 1280) / 2) + left + 57,
//             pY: lineBottom - prvBottom - 2,
//             dY: lineBottom - dotBottom - 28
//         }

//         events[i].group.x = coords.pX;

//         events[i].lines.ld.x = coords.pX;

//         events[i].shape.x = coords.pX - 56;

//     });

// }


// window.addEventListener('resize', () => {
//     const w = canvas.offsetWidth;
//     const h = canvas.offsetHeight;
//     // canvas.width = w * window.devicePixelRatio;
//     // canvas.height = (h > 662) ? h * window.devicePixelRatio : 662;
//     canvas.width = w;
//     canvas.height = (h > 662) ? h : 662;
//     repositionElems(w, h);
// })

export { onTick};