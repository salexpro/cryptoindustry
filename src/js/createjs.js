/* global createjs */
import './lib/foundation-explicit-pieces';

import Ticker from './lib/ticker'; // quiet
import TweenLite from 'gsap/TweenLite';
import { Power0 } from 'gsap/EasePack';
// import './plugins/_ColorPlugin';
import * as eventsData from './data/events';
import { TimelineLite } from 'gsap/TweenMax';

const mouse = {
    init: function () {
        window.addEventListener('wheel', this, { pasive: true });
        window.addEventListener('mousemove', this, true);
    },
    handleEvent: function ({ type }) {
        switch (type) {
            case 'wheel': {
                this.wheelFunction(event);
                break;
            }
            case 'mousemove': {
                this.moveFunction(event);
                break;
            }
        }
    },
    wheelFunction: function ({ deltaY, deltaX }) {
        if (deltaY != 0) {
            this.dest -= deltaY * 1.5;
        } else if (deltaX != 0){
            this.dest -= deltaX * 1.5;
        }
    },
    moveFunction: function ({ clientX, clientY }) {
        this.mouse = {
            x: clientX,
            y: clientY,
        };
    },
    dest: 0,
    fin: 0,
    mouse: { x: 0, y: 0 },
};

const events = [];
const shapes = [];
const corners = [];
const lines = [];
const dots = [];

const palette = {
    blue: '#69d6ff',
    yellow: '#fbff33'
}
const opacity = [0.05, 0.1, 0.2];

const animations = {
    dots: dot => {
        const alpha = opacity[Math.floor(Math.random() * opacity.length)];
        TweenLite.to(dot, 1, {
            alpha: alpha,
            ease: Power0.easeNone,
            onComplete: animations.dots,
            onCompleteParams: [dot]
        })
    },
    showEvent: (coords, ld, ll, lr, img, i) => {
        if(!shapes[i].isHidden){
            const llPath = [[0, 0], [-48, 0], [-56, -8], [-56, -112], [0, -112]];
            const lrPath = [[0, 0], [56, 0], [56, -104], [48, -112], [0, -112]];

            const easing = Power0.easeNone;

            TweenLite.to(ld.graphics.lt(0, coords.dY).command, 0.5, { y: coords.pY, ease: easing })

            TweenLite.to(ll.graphics.lt(...llPath[0]).command, 0.3, {
                x: llPath[1][0], y: llPath[1][1], ease: easing,
                onComplete: () => {
                    const lc = ll.graphics.lt(...llPath[1]).command;
                    TweenLite.to(lc, 0.1, {
                        x: llPath[2][0], y: llPath[2][1], ease: easing,
                        onComplete: () => {
                            const lc = ll.graphics.lt(...llPath[2]).command;
                            TweenLite.to(lc, 0.4, {
                                x: llPath[3][0], y: llPath[3][1], ease: easing,
                                onComplete: () => {
                                    const lc = ll.graphics.lt(...llPath[3]).command;
                                    TweenLite.to(lc, 0.3, { x: llPath[4][0], y: llPath[4][1], ease: easing });
                                }
                            })
                        }
                    })
                },
                delay: 0.5
            })

            TweenLite.to(lr.graphics.lt(...lrPath[0]).command, 0.3, {
                x: lrPath[1][0], y: lrPath[1][1],
                onComplete: () => {
                    const lc = lr.graphics.lt(...lrPath[1]).command;
                    TweenLite.to(lc, 0.4, {
                        x: lrPath[2][0], y: lrPath[2][1],
                        onComplete: () => {
                            const lc = lr.graphics.lt(...lrPath[2]).command;
                            TweenLite.to(lc, 0.1, {
                                x: lrPath[3][0], y: lrPath[3][1],
                                onComplete: () => {
                                    const lc = lr.graphics.lt(...lrPath[3]).command;
                                    TweenLite.to(lc, 0.3, { x: lrPath[4][0], y: lrPath[4][1] });
                                }
                            })
                        }
                    })
                },
                delay: 0.5
            })

            TweenLite.to(img, 0.5, { 
                alpha: 1,
                delay: 1.6
            })

            TweenLite.to(corners[i][0], 0.5, { x: 0, y: coords.pY - 56, alpha: 1, delay: 1.6 });
            TweenLite.to(corners[i][0].cmd2, 0.5, { w: 138, h: 138, delay: 1.6 });
            TweenLite.to(corners[i][1].cmd1, 0.5, { x: 0, y: 0, delay: 1.6 });
            TweenLite.to(corners[i][1].cmd2, 0.5, { x: 136, y: 0, delay: 1.6 });
            TweenLite.to(corners[i][1].cmd3, 0.5, { x: 0, y: 136, delay: 1.6 });
            TweenLite.to(corners[i][1].cmd4, 0.5, { x: 136, y: 136, delay: 1.6 });
            TweenLite.set(img[1], {hoverable: true, delay: 1.6})
        }
    },
    mouseOver: (el, i) => {
        [lines[i].ll.cmd, lines[i].lr.cmd, lines[i].ld.cmd].forEach(cmd => {
            createjs.Tween.get(cmd).to({ style: palette.yellow }, 300)
        });
        dots[i].forEach(d => {
            createjs.Tween.get(d.cmd).to({ style: palette.yellow }, 300)
        })


        createjs.Tween.get(corners[i][0].cmd).to({ style: palette.yellow }, 300)
        TweenLite.to(corners[i][0], 0.3, { x: 5, y: corners[i][0].pY - 54 });
        TweenLite.to(corners[i][0].cmd2, 0.3, { w: 128, h: 134 });

        TweenLite.to(corners[i][1].cmd1, 0.3, { x: 5, y: 2 });
        TweenLite.to(corners[i][1].cmd2, 0.3, { x: 131, y: 2 });
        TweenLite.to(corners[i][1].cmd3, 0.3, { x: 5, y: 134 });
        TweenLite.to(corners[i][1].cmd4, 0.3, { x: 131, y: 134 });


        canvas.style.cursor = 'pointer';
    },
    mouseOut: (el, i) => {
        [lines[i].ll.cmd, lines[i].lr.cmd, lines[i].ld.cmd].forEach(cmd => {
            createjs.Tween.get(cmd).to({
                style: palette.blue
            }, 300)
        });
        dots[i].forEach(d => {
            createjs.Tween.get(d.cmd).to({ style: palette.blue }, 300)
        })

        createjs.Tween.get(corners[i][0].cmd).to({ style: palette.blue }, 300)
        TweenLite.to(corners[i][0], 0.3, { x: 0, y: corners[i][0].pY - 56 });
        TweenLite.to(corners[i][0].cmd2, 0.3, { w: 138, h: 138 });

        TweenLite.to(corners[i][1].cmd1, 0.3, { x: 0, y: 0 });
        TweenLite.to(corners[i][1].cmd2, 0.3, { x: 136, y: 0 });
        TweenLite.to(corners[i][1].cmd3, 0.3, { x: 0, y: 136 });
        TweenLite.to(corners[i][1].cmd4, 0.3, { x: 136, y: 136 });

        canvas.style.cursor = 'default';
    }
}

const dx = 112;
const dy = 112;
const accRate = 10;

const onTick = () => {
    const graphEnd = -7580 + (document.body.offsetWidth / 2);
    if (mouse.dest > 0) mouse.dest = 0;
    if (mouse.dest < graphEnd) mouse.dest = graphEnd;

    mouse.fin += (mouse.dest - mouse.fin) / accRate;
    if (Math.abs(mouse.fin - mouse.dest) < 0.005) mouse.fin = mouse.dest;

    stage.x = mouse.fin;

    const { x, y } = mouse.mouse;

    shapes.forEach((el, i) => {
        if (x - mouse.fin > el.x && 
            x - mouse.fin < el.x + dx && 
            (y - 58 - stage.y) > el.y && 
            (y - 58 - stage.y) < el.y + dy &&
            el.hoverable) {
            el.hovered = true;
        } else {
            el.hovered = false;
        }
        if (!el.hovered && el.changed) {
            animations.mouseOut(el, i);
            el.changed = false;
        }
        if (el.hovered && !el.changed) {
            animations.mouseOver(el, i);
            el.changed = true;
        }
    });

    if (mouse.fin < -950 && mouse.fin > -2300){
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
    // console.log( x, y, mouse.fin)

    // shapes.forEach((el, i) => {
        
    // });

    stage.update();
}


const canvas = document.getElementById('canvas');
const stage = new createjs.Stage('canvas');
// stage.scaleX = window.devicePixelRatio;
// stage.scaleY = window.devicePixelRatio;
const w = canvas.offsetWidth;
const h = canvas.offsetHeight;
// canvas.width = w * window.devicePixelRatio;
// canvas.height = h * window.devicePixelRatio;
canvas.width = w;
canvas.height = h;
// createjs.Ticker.setFPS(60);
mouse.init();

const tl = new TimelineLite({ paused: true });
const tl2 = new TimelineLite({ paused: true });
const tl3 = new TimelineLite({ paused: true });
const tl4 = new TimelineLite({ paused: true });

const corr = (canvas.height > 662) ? (canvas.height - 662) / 2.5 : 0;

tl.to(stage, 1, { y: 250 - corr})
tl2.to(stage, 1, {y: 180 - corr})
tl3.to(stage, 1, {y: 300 - corr})
tl4.to(stage, 1, {y: 350 - corr})

const graphParams = {
    blueWidth: 6755,
    blueHeight: 422,
    yellowWidth: 826,
    yellowHeight: 317
}

const openEvent = (el, i) => {
    console.log(shapes[i], lines[i]);
    TweenLite.to(el, 0.3, { x: el.pX - 294, y: el.pY - 162 });
    // TweenLite.to(el.graphics._fill, 0.3, { style: 'red' });
    TweenLite.to(el.graphics._activeInstructions[0], 0.3, { x: 8, y: 162 });
    TweenLite.to(el.graphics._activeInstructions[1], 0.3, { x: 0, y: 154 });

    TweenLite.to(el.graphics._activeInstructions[3], 0.3, { x: 580, y: 0 });
    TweenLite.to(el.graphics._activeInstructions[4], 0.3, { x: 588, y: 8 });
    TweenLite.to(el.graphics._activeInstructions[5], 0.3, { x: 588, y: 162 });


    const llPath = [{x: 0, y: 0}, {x: -286, y: 0}, {x: -294, y: -8}, {x: -294, y: -162}, {x: 0, y: -162}]
    const lrPath = [{x: 0, y: 0}, {x: 294, y: 0}, {x: 294, y: -154}, {x: 286, y: -162}, {x: 0, y: -162}]

    lines[i].ll.graphics._activeInstructions.forEach((l, j) => {    
        TweenLite.to(l, 0.3, llPath[j]);
        TweenLite.to(lines[i].lr.graphics._activeInstructions[j], 0.3, lrPath[j]);
    })


    el.opened = true;

    shapes.forEach((el, i) => {
        el.hoverable = false;
        if (!el.opened){
            TweenLite.to(events[i], 0.3, {alpha: 0});
            TweenLite.to(lines[i].ld, 0.3, {alpha: 0});

            el.alpha = 0;
            el.isHidden = true;
            el.visible = false;
        }
    })

}

canvas.addEventListener('click', () => {

    const { x, y } = mouse.mouse;
    
    shapes.forEach((el, i) => {
        if (x - mouse.fin > el.x &&
            x - mouse.fin < el.x + dx &&
            (y - 58 - stage.y) > el.y &&
            (y - 58 - stage.y) < el.y + dy &&
            el.hoverable) {

            openEvent(el, i)
        }
    });
})

// const mainContainer = floodShapes();
const graph = new createjs.Container();
const cLines = new createjs.Container();

const blueLine = new createjs.Bitmap('/assets/img/blue_line.svg');
blueLine.x = w / 2;
blueLine.y = h - graphParams.blueHeight - 118;
blueLine.shadow = new createjs.Shadow(palette.blue, 0, 0, 25);

const yellowLine = new createjs.Bitmap('/assets/img/yellow_line.svg');
yellowLine.x = (w / 2) + graphParams.blueWidth - 1;
yellowLine.y = h - (graphParams.blueHeight + graphParams.yellowHeight - 43) - 118;
yellowLine.shadow = new createjs.Shadow(palette.yellow, 0, 0, 25);


const bottomLine = new createjs.Shape();
bottomLine.graphics
    .ss(2)
    .s(palette.blue)
    .mt(0, h - 120)
    .lt(canvas.offsetWidth / 2, h - 120)
    .es()
// bottomLine.shadow = new createjs.Shadow(palette.blue, 0, 0, 25);


const dotParams = [
    {
        x: -25,
        y: -22,
        opacity: 0.05
    },
    {
        x: 0,
        y: -22,
        opacity: 0.2
    },
    {
        x: 25,
        y: -22,
        opacity: 0.1
    },
    {
        x: -25,
        y: 0,
        opacity: 0.2
    },
    {
        x: 0,
        y: 0,
        opacity: 1
    },
    {
        x: 25,
        y: 0,
        opacity: 0.1
    },
    {
        x: -25,
        y: 22,
        opacity: 0.1
    },
    {
        x: 0,
        y: 22,
        opacity: 0.05
    },
    {
        x: 25,
        y: 22,
        opacity: 0.2
    }
]

eventsData.events.forEach((event, i) => {

    const coords = {
        pX: ((w - 1280) / 2) + event.left + 57,
        pY:  h - 120 - event.prvBottom - 2,
        dY:  h - 120 - event.dotBottom - 28
    }

    const eventCont = new createjs.Container();
    eventCont.x = coords.pX;
    dots[i] = [];
    dotParams.forEach((dot, j) => {
        const dotShape = new createjs.Shape();
        dotShape.y = coords.dY;
        dotShape.cmd = dotShape.graphics.f(palette.blue).command;
        dotShape.graphics.dp(dot.x, dot.y, 4, 4, 0, -90)
        dotShape.alpha = dot.opacity;

        if (j != 4) animations.dots(dotShape)
        dots[i].push(dotShape);

        eventCont.addChild(dotShape);
    });

    const line = new createjs.Shape();
    line.cmd = line.graphics.beginStroke(palette.blue).command;
    line.x = coords.pX;
    line.graphics
        .ss(1)
        .sd([4, 2])
        .mt(0, coords.dY);


    const lineLeft = new createjs.Shape();
    lineLeft.y = coords.pY;
    lineLeft.cmd = lineLeft.graphics.beginStroke(palette.blue).command;
    lineLeft.graphics
        .ss(2)
        .mt(0, 0)

    
    const lineRight = new createjs.Shape();
    lineRight.y = coords.pY;
    lineRight.cmd = lineRight.graphics.beginStroke(palette.blue).command;
    lineRight.graphics
        .ss(2)
        .mt(0, 0)

    
    const bg = new createjs.Shape();
    bg.x = coords.pX - 56;
    bg.y = coords.pY - 112;
    bg.pX = coords.pX;
    bg.pY = coords.pY;
    bg.alpha = 0;
    bg.graphics.f('#02122a')
        .mt(8, 112)
        .lt(0, 104)
        .lt(0, 0)
        .lt(104, 0)
        .lt(112, 8)
        .lt(112, 112)
        .cp();
    shapes.push(bg);

    const imageX = -50;
    const imageY = coords.pY - 106;

    const imageMask = new createjs.Shape();
    imageMask.x = imageX;
    imageMask.y = imageY;

    imageMask.graphics
        .mt(0, 0)
        .lt(93, 0)
        .lt(100, 7)
        .lt(100, 100)
        .lt(7, 100)
        .lt(0, 93)
        .cp();


    const image = new createjs.Bitmap(`/assets/img/events/preview/${i + 1}@2x.jpg`);
    image.x = imageX;
    image.y = imageY;
    image.scaleX = 0.5;
    image.scaleY = 0.5;
    image.mask = imageMask;
    image.alpha = 0;


    const cornersMask = new createjs.Shape();
    cornersMask.x = -70;
    cornersMask.y = coords.pY - 126;
    cornersMask.cmd1 = cornersMask.graphics.dr(5, 2, 4, 4).command;
    cornersMask.cmd2 = cornersMask.graphics.dr(131, 2, 4, 4).command;
    cornersMask.cmd3 = cornersMask.graphics.dr(5, 134, 4, 4).command;
    cornersMask.cmd4 = cornersMask.graphics.dr(131, 134, 4, 4).command;
    // cornersMask.graphics
    //     .dr(0, 0, 4, 4)
    //     .dr(136, 0, 4, 4)
    //     .dr(0, 136, 4, 4)
    //     .dr(136, 136, 4, 4)

    const cCorners = new createjs.Shape();
    cCorners.x = 5;
    cCorners.y = coords.pY - 54;
    cCorners.pY = coords.pY
    cCorners.regX = 69;
    cCorners.regY = 69;
    cCorners.alpha = 0;
    cCorners.graphics.ss(2)
    cCorners.cmd = cCorners.graphics.s(palette.blue).command;
    cCorners.cmd2 = cCorners.graphics.dr(0, 0, 128, 134).command;
    cCorners.mask = cornersMask;
    corners.push([cCorners, cornersMask]);

    
    lines.push({
        ll: lineLeft, 
        lr: lineRight,
        ld: line
    });

    eventCont.addChild(cCorners, cornersMask, lineLeft, lineRight, image);
    cLines.addChild(line);
    graph.addChild(bg, eventCont);

    events.push(eventCont);

    setTimeout(() => {
        animations.showEvent(coords, line, lineLeft, lineRight, [image, shapes[i]], i)
    }, 0 + (i * 1000) / 2);
});

graph.addChild(blueLine, yellowLine, bottomLine);
stage.addChild(cLines, graph);

Ticker.addListener((event) => onTick(event));

createjs.ColorPlugin.install();


const repositionElems = (w, h) => {
    blueLine.x = w / 2;
    blueLine.y = h - graphParams.blueHeight - 118;
    yellowLine.x = (w / 2) + graphParams.blueWidth - 1;
    yellowLine.y = h - (graphParams.blueHeight + graphParams.yellowHeight - 43) - 118;
    bottomLine.graphics
        .ss(2)
        .s(palette.blue)
        .mt(0, h - 120)
        .lt(canvas.offsetWidth / 2, h - 120)
        .es();
        
    const lineBottom = h - 120;
    eventsData.events.forEach((event, i) => {

        const coords = {
            pX: ((w - 1280) / 2) + event.left + 57,
            pY: lineBottom - event.prvBottom - 2,
            dY: lineBottom - event.dotBottom - 28
        }

        events[i].x = coords.pX;

        lines[i].ld.x = coords.pX;

        shapes[i].x = coords.pX - 56;

    });
    
}


window.addEventListener('resize', () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    // canvas.width = w * window.devicePixelRatio;
    // canvas.height = (h > 662) ? h * window.devicePixelRatio : 662;
    canvas.width = w;
    canvas.height = (h > 662) ? h : 662;
    repositionElems(w, h);
})