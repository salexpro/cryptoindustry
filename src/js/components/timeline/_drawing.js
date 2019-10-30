/* global createjs */
import Ticker from '../../lib/ticker';
import { graphParams, palette, events, canvas, stage, mouse, gEvents, dotParams } from './_config';
import { anim } from './_anim';
import { onTick } from './_actions';
import * as eventsData from '../../data/events';


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

graph.addChild(blueLine, yellowLine, bottomLine);

eventsData.events.forEach(({ left, prvBottom, dotBottom, content, rate }, i) => {

    const coords = {
        pX: ((w - 1280) / 2) + left + 57,
        pY: h - 120 - prvBottom - 2,
        dY: h - 120 - dotBottom - 28
    }

    const eventGroup = new createjs.Container();
    eventGroup.x = coords.pX;

    const line = new createjs.Shape();
    line.cmd = line.graphics.beginStroke(palette.blue).command;
    line.x = coords.pX;
    line.graphics
        .ss(1)
        .sd([4, 2])
        .mt(0, coords.dY);

    // const llPath = [[0, 0], [-48, 0], [-56, -8], [-56, -112], [0, -112]];
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
    bg.dY = coords.dY;
    bg.alpha = 0;
    bg.unHoverable = true;
    bg.hoverable = false;
    bg.revealed = false;
    bg.opened = false;
    bg.fadedOut = false;
    bg.graphics.f('#02122a')
        .mt(8, 112)
        .lt(0, 104)
        .lt(0, 0)
        .lt(104, 0)
        .lt(112, 8)
        .lt(112, 112)
        .cp();

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
    cornersMask.x = -64;
    cornersMask.y = coords.pY - 123;
    cornersMask.graphics
        .dr(0, 0, 4, 4)
        .dr(124, 0, 4, 4)
        .dr(0, 130, 4, 4)
        .dr(124, 130, 4, 4)

    const cCorners = new createjs.Shape();
    cCorners.x = -63;
    cCorners.y = coords.pY - 122;
    cCorners.pY = coords.pY
    cCorners.alpha = 0;
    cCorners.graphics
        .ss(2)
        .s(palette.blue)
        .dr(0, 0, 126, 132)
    cCorners.mask = cornersMask;

    const text = new createjs.Text();
    text.set({
        x: 72,
        y: coords.pY - 56,
        font: '300 16px Ubuntu',
        letterSpacing: 0.56,
        lineHeight: 19.2,
        lineWidth: 395,
        text: content,
        color: 'white',
        alpha: 0,
    })
    text.regY = text.getBounds().height / 2;


    const rdY = coords.dY - 127;

    const rText = new createjs.Text();
    rText.set({
        x: coords.pX,
        // y: rdY - 17,
        font: '500 16px Ubuntu',
        letterSpacing: 0.56,
        lineHeight: 19.2,
        text: `1 BTC ${(rate.substr(0, 1) != '~') ? (i != 84) ? '=' : '≠' : ''} ${rate}`,
        color: palette.yellow,
        alpha: 0
    })
    const rTextWidth = rText.getBounds().width / 2;
    const rTextHeight = rText.getBounds().height;
    const rLineWidth = rTextWidth + 12;
    const rLineHeight = rTextHeight + 14;
    rText.regX = rTextWidth;
    rText.regY = rTextHeight / 2;
    rText.y = rdY - (rLineHeight / 2);


    const lineRate = new createjs.Shape();
    lineRate.x = coords.pX;
    lineRate.rWidth = rLineWidth;
    lineRate.rdY = rdY;
    lineRate.rLineHeight = rLineHeight;
    lineRate.graphics
        .s(palette.yellow)
        .ss(1)
        .sd([4, 2])
        .mt(0, coords.dY)
        .lt(0, coords.dY);

    const lineLeftRate = new createjs.Shape();
    lineLeftRate.x = coords.pX;
    lineLeftRate.y = rdY;
    lineLeftRate.alpha = 0;
    lineLeftRate.graphics
        .s(palette.yellow)
        .ss(1)
        .sd([4, 2])
        .mt(0, 0)
        .lt(8 - rLineWidth, 0)
        .lt(-rLineWidth, -8)
        .lt(-rLineWidth, -rLineHeight)
        .lt(0, -rLineHeight);

    const lineRightRate = new createjs.Shape();
    lineRightRate.x = coords.pX;
    lineRightRate.y = rdY;
    lineRightRate.alpha = 0;
    lineRightRate.graphics
        .s(palette.yellow)
        .ss(1)
        .sd([4, 2])
        .mt(0, 0)
        .lt(rLineWidth, 0)
        .lt(rLineWidth, -rLineHeight + 8)
        .lt(rLineWidth - 8, -rLineHeight)
        .lt(0, -rLineHeight);

    const rBg = new createjs.Shape();
    rBg.x = coords.pX;
    rBg.y = rdY;
    rBg.alpha = 0;
    rBg.graphics.f('#02122a')
        .mt(0, 0)
        .lt(8 - rLineWidth, 0)
        .lt(-rLineWidth, -8)
        .lt(-rLineWidth, -rLineHeight)
        .lt(rLineWidth - 8, -rLineHeight)
        .lt(rLineWidth, -rLineHeight + 8)
        .lt(rLineWidth, 0)
        .lt(0, 0)
        .cp();

    events.push({
        group: eventGroup,
        shape: bg,
        corners: cCorners,
        image: image,
        text: text,
        rText: rText,
        rBg: rBg,
        lines: {
            ll: lineLeft,
            lr: lineRight,
            ld: line,
            rLd: lineRate,
            rLl: lineLeftRate,
            rLr: lineRightRate
        },
        dots: []
    });

    dotParams.forEach((dot, j) => {
        const dotShape = new createjs.Shape();
        dotShape.x = coords.pX;
        dotShape.y = coords.dY;
        dotShape.cmd = dotShape.graphics.f(palette.blue).command;
        dotShape.graphics.dp(dot.x, dot.y, 4, 4, 0, -90)
        dotShape.alpha = dot.opacity;

        if (j != 4) anim.dots(dotShape)
        events[i].dots.push(dotShape);

        cLines.addChild(dotShape);
    });

    eventGroup.addChild(cCorners, cornersMask, lineLeft, lineRight, image, text);
    cLines.addChild(line, lineRate, rBg, lineLeftRate, lineRightRate, rText);
    graph.addChild(cLines, bg, eventGroup);

    if ((coords.pX - 60) < w) {
        setTimeout(() => {
            if (!events[i].shape.revealed && !events[i].shape.revealing) {
                const gid = gEvents.findIndex(({ group }) => group.includes(i));
                if (gid != -1) {
                    // console.log(i)
                    anim.changeEvent(gid)
                } else {
                    anim.revealEvent(i)
                }
            }
        }, 0 + (i * 1000) / 2);
    }
});

stage.addChild(graph);
stage.movable = true;

Ticker.addListener((event) => onTick(event));

createjs.ColorPlugin.install();