import { TimelineLite } from 'gsap/TimelineLite';

import { dx, dy, events, accRate, canvas, stage, mouse, gEvents } from './_config';
import { anim } from './_anim';

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

    events.forEach(({ shape }, i) => {
        if (x - mouse.fin > shape.x &&
            x - mouse.fin < shape.x + dx &&
            (y - 58 - stage.y) > shape.y &&
            (y - 58 - stage.y) < shape.y + dy) {
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


const tl = new TimelineLite({ paused: true });
const tl2 = new TimelineLite({ paused: true });
const tl3 = new TimelineLite({ paused: true });
const tl4 = new TimelineLite({ paused: true });

const corr = (canvas.height > 662) ? (canvas.height - 662) / 2.5 : 0;

tl.to(stage, 1, { y: 250 - corr })
tl2.to(stage, 1, { y: 180 - corr })
tl3.to(stage, 1, { y: 300 - corr })
tl4.to(stage, 1, { y: 350 - corr })

canvas.addEventListener('click', () => {

    const { x, y } = mouse.mouse;

    events.some((e, i) => {
        // console.log('_')
        if (x - mouse.fin > events[i].shape.x &&
            x - mouse.fin < events[i].shape.x + dx &&
            (y - 58 - stage.y) > events[i].shape.y &&
            (y - 58 - stage.y) < events[i].shape.y + dy &&
            events[i].shape.hoverable && events[i].shape.visible) {
            // console.log(events[i].shape.hoverable, events[i].shape.visible, i);
            anim.openEvent(i)
            // console.log('opened')
            return true;
        }
        if (!(x - mouse.fin > events[i].shape.x &&
            x - mouse.fin < events[i].shape.x + 588 &&
            (y - 58 - stage.y) > events[i].shape.y &&
            (y - 58 - stage.y) < events[i].shape.y + 162)
            && events[i].shape.opened) {
            anim.closeEvent(i)
            // console.log('closed')
            return true;
        }
    });
    // console.log('_____________')
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