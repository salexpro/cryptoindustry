/* global player */
import $ from 'jquery';
import { TimelineLite } from 'gsap/TimelineLite';

import { dx, dy, events, accRate, canvas, stage, mouse, gEvents } from './_config';
import { anim } from './_anim';
import * as eventsData from '../../data/events';


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