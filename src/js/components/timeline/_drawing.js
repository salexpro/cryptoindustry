/* global createjs */
import Ticker from '../../lib/_ticker'; // quiet
import { graphParams, palette, events, canvas, stage, mouse, dotParams, isTablet, isMobile, rConfig } from './_config';
import { anim } from './_anim';
import { onTick } from './_actions';
import * as eventsData from '../../data/events';


stage.scaleX = window.devicePixelRatio;
stage.scaleY = window.devicePixelRatio;
const w = canvas.offsetWidth;
const h = canvas.offsetHeight;
canvas.width = w * window.devicePixelRatio;
canvas.height = h * window.devicePixelRatio;

mouse.init();

const graph = new createjs.Container();
const cLines = new createjs.Container();
const blueLine = new createjs.Bitmap('/assets/img/blue_line.svg');
blueLine.x = rConfig.halfScreen();
blueLine.y = h - graphParams.blueHeight - rConfig.bottomMargin() + 2;
blueLine.shadow = new createjs.Shadow(palette.blue, 0, 0, 25);

const yellowLine = new createjs.Bitmap('/assets/img/yellow_line.svg');
yellowLine.x = blueLine.x + graphParams.blueWidth - 1;
yellowLine.y = h - (graphParams.blueHeight + graphParams.yellowHeight - 43) - rConfig.bottomMargin() + 2;
yellowLine.shadow = new createjs.Shadow(palette.yellow, 0, 0, 25);


const bottomLine = new createjs.Shape();
bottomLine.graphics
    .ss(2)
    .s(palette.blue)
    .mt(0, h - rConfig.bottomMargin())
    .lt(blueLine.x, h - rConfig.bottomMargin())
    .es()
bottomLine.shadow = new createjs.Shadow(palette.blue, 0, 0, 25);

graph.addChild(blueLine, yellowLine, bottomLine);


eventsData.events.forEach(({ left, prvBottom, prvBottomMob, dotBottom, content, rate, button }, i) => {

    const coords = {
        pX: (!isTablet() ? ((w - 1280) / 2) : 0) + left + 57,
        pY: h - rConfig.bottomMargin() - (isMobile() ? prvBottomMob : prvBottom) + 2,
        dY: h - rConfig.bottomMargin() - dotBottom - 28
    }

    const eventGroup = new createjs.Container();
    eventGroup.x = coords.pX;

    const line = new createjs.Shape();
    line.x = coords.pX;
    line.graphics
        .s(palette.blue)
        .ss(1)
        .sd([4, 2])
        .mt(0, coords.dY);

    // const llPath = [[0, 0], [-48, 0], [-56, -8], [-56, -112], [0, -112]];
    const lineLeft = new createjs.Shape();
    lineLeft.y = coords.pY;
    lineLeft.graphics
        .s(palette.blue)
        .ss(2)
        .mt(0, 0)
    // lineLeft.shadow = new createjs.Shadow(palette.blue, 0, 0, 25);


    const lineRight = new createjs.Shape();
    lineRight.y = coords.pY;
    lineRight.graphics
        .s(palette.blue)
        .ss(2)
        .mt(0, 0)

    // lineRight.shadow = new createjs.Shadow(palette.blue, 0, 0, 25);


    const bg = new createjs.Shape();
    bg.x = coords.pX - rConfig.shapeHalf();
    bg.y = coords.pY - rConfig.shapeSize();
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
        .mt(8, rConfig.shapeSize())
        .lt(0, rConfig.shapeSize() - 8)
        .lt(0, 0)
        .lt(rConfig.shapeSize() - 8, 0)
        .lt(rConfig.shapeSize(), 8)
        .lt(rConfig.shapeSize(), rConfig.shapeSize())
        .cp();

    const imageX = -rConfig.imageSize() / 2;
    const imageY = coords.pY - rConfig.shapeSize() + 6;

    const imageMask = new createjs.Shape();
    imageMask.x = imageX;
    imageMask.y = imageY;

    imageMask.graphics
        .mt(0, 0)
        .lt(rConfig.imageSize() - 7, 0)
        .lt(rConfig.imageSize(), 7)
        .lt(rConfig.imageSize(), rConfig.imageSize())
        .lt(7, rConfig.imageSize())
        .lt(0, rConfig.imageSize() - 7)
        .cp();


    const image = new createjs.Bitmap(`/assets/img/events/preview/${i + 1}@2x.jpg`);
    image.x = imageX;
    image.y = imageY;
    image.scaleX = isMobile() ? 0.4 : 0.5;
    image.scaleY = isMobile() ? 0.4 : 0.5;
    image.mask = imageMask;
    image.alpha = 0;


    const cornersMask = new createjs.Shape();
    cornersMask.x = -rConfig.shapeHalf() - 8;
    cornersMask.y = coords.pY - rConfig.shapeSize() - 11;
    cornersMask.graphics
        .dr(0, 0, 4, 4)
        .dr(rConfig.shapeSize() + 12, 0, 4, 4)
        .dr(0, rConfig.shapeSize() + 18, 4, 4)
        .dr(rConfig.shapeSize() + 12, rConfig.shapeSize() + 18, 4, 4)

    const cCorners = new createjs.Shape();
    cCorners.x = -rConfig.shapeHalf() - 7;
    cCorners.y = coords.pY - rConfig.shapeSize() - 10;
    cCorners.alpha = 0;
    cCorners.graphics
        .ss(2)
        .s(palette.blue)
        .dr(0, 0, rConfig.shapeSize() + 14, rConfig.shapeSize() + 20)
    cCorners.mask = cornersMask;

    const text = new createjs.Text();
    text.set({
        x: 0,
        font: isMobile() ? '400 14px Ubuntu' : '300 16px Ubuntu',
        letterSpacing: isMobile() ? 0.49 : 0.56,
        lineHeight: isMobile() ? 16.8 : 19.2,
        lineWidth: isMobile() ? 256 : 393,
        text: content,
        color: 'white',
        // alpha: 0,
    })

    const textHeight = text.getBounds().height;
    text.regY = textHeight / 2;
    
    const buttonHeight = button ? 35 + (isMobile() ? 16 : 22) : 0;
    const totalHeight = textHeight + buttonHeight;
    const eventMinHeight = isMobile() ? 100 : 140;
    const eventHeight = (totalHeight > eventMinHeight) ? totalHeight : eventMinHeight;
    
    const posText = (eventHeight == eventMinHeight && buttonHeight) ? eventHeight - 35 : buttonHeight ? textHeight : eventHeight;
    text.y = posText / 2;

    const cContainerMask = new createjs.Shape();
    cContainerMask.x = rConfig.shapeHalf() + 16;
    cContainerMask.y = coords.pY - rConfig.shapeHalf();
    cContainerMask.regY = rConfig.imageSize() / 2;
    cContainerMask.graphics
        .dr(0, 0, 0, rConfig.imageSize())
    
    const cContainer = new createjs.Container();
    cContainer.x = 72;
    cContainer.y = coords.pY - rConfig.shapeHalf();
    cContainer.regY = eventHeight / 2;
    cContainer.mask = cContainerMask;
    cContainer.alpha = 0;
    cContainer.eventHeight = eventHeight;

    cContainer.addChild(text);

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
        content: cContainer,
        lines: {
            ll: lineLeft,
            lr: lineRight,
            ld: line,
            rLd: lineRate,
            rLl: lineLeftRate,
            rLr: lineRightRate
        },
        dots: [],
    });
    const dContainer = new createjs.Container();
    dContainer.x = coords.pX;
    dContainer.y = coords.dY;

    dotParams.forEach((dot, j) => {
        const dotShape = new createjs.Shape();
        dotShape.graphics
            .f(palette.blue)
            .dp(dot.x, dot.y, 4, 4, 0, -90)
        dotShape.alpha = dot.opacity;

        if (j != 4) anim.dots(dotShape)
        events[i].dots.push(dotShape);

        dContainer.addChild(dotShape);
    });
    events[i].dContainer = dContainer;
    cLines.addChild(dContainer);

    if (button) {
        const buttonText = new createjs.Text();
        buttonText.set({
            y: eventHeight - 17,
            font: '500 12px Ubuntu',
            letterSpacing: 0.56,
            lineHeight: isMobile() ? 16 : 14,
            text: button.toUpperCase(),
            color: palette.yellow,
        })
        const buttonTextWidth = buttonText.getBounds().width + 25;
        // const buttonTextHeight = buttonText.getBounds().height;
        const buttonWidth = (buttonTextWidth > 104) ? buttonTextWidth : 104;

        buttonText.x = text.lineWidth - (buttonWidth / 2);
        buttonText.regX = buttonText.getBounds().width / 2;
        buttonText.regY = isMobile() ? 8 : buttonText.getBounds().height / 2;

        const buttonShape = new createjs.Shape();
        buttonShape.x = text.lineWidth - buttonWidth;
        buttonShape.y = eventHeight;
        buttonShape.buttonWidth = buttonWidth;
        buttonShape.graphics
            .f('transparent')
            .s(palette.yellow)
            .ss(2)
            .mt(8, 0)
            .lt(buttonWidth, 0)
            .lt(buttonWidth, -27)
            .lt(buttonWidth - 8, -35)
            .lt(0, -35)
            .lt(0, -8)
            .cp();

        events[i].button = buttonShape;
        events[i].buttonText = buttonText;

        cContainer.addChild(buttonShape, buttonText);
    }

    eventGroup.addChild(cCorners, cornersMask, lineLeft, lineRight, image, cContainer);
    cLines.addChild(line);
    graph.addChild(lineRate, bg, eventGroup, rBg, lineLeftRate, lineRightRate, rText);

    // if ((coords.pX - 60) < w) {
    //     setTimeout(() => {
    //         if (!events[i].shape.revealed && !events[i].shape.revealing) {
    //             const gid = gEvents.findIndex(({ group }) => group.includes(i));
    //             if (gid != -1) {
    //                 // console.log(i)
    //                 anim.changeEvent(gid)
    //             } else {
    //                 anim.revealEvent(i)
    //             }
    //         }
    //     }, 0 + (i * 1000) / 2);
    // }
});

stage.addChild(cLines, graph);
// stage.movable = true;

Ticker.addListener((event) => onTick(event));

const repositionElems = (w, h) => {

    blueLine.x = rConfig.halfScreen();
    blueLine.y = h - graphParams.blueHeight - rConfig.bottomMargin() + 2;
    yellowLine.x = blueLine.x + graphParams.blueWidth - 1;
    yellowLine.y = h - (graphParams.blueHeight + graphParams.yellowHeight - 43) - rConfig.bottomMargin() + 2;

    const lineBottom = h - rConfig.bottomMargin();
    bottomLine.graphics._instructions[1].y = lineBottom;
    bottomLine.graphics._instructions[2].x = blueLine.x;
    bottomLine.graphics._instructions[2].y = lineBottom;

    eventsData.events.forEach(({ left, prvBottom, prvBottomMob, dotBottom }, i) => {

        const coords = {
            pX: (!isTablet() ? ((w - 1280) / 2) : 0) + left + 57,
            pY: lineBottom - (isMobile() ? prvBottomMob : prvBottom) + 2,
            dY: lineBottom - dotBottom - 28
        }

        events[i].group.x = coords.pX;
        
        events[i].shape.x = coords.pX - rConfig.shapeHalf();
        events[i].shape.y = coords.pY - rConfig.shapeSize();
        events[i].shape.pX = coords.pX;
        events[i].shape.pY = coords.pY;
        events[i].shape.dY = coords.dY;

        if (events[i].shape.revealed){

            events[i].shape.graphics._activeInstructions[0].x = 8,
            events[i].shape.graphics._activeInstructions[0].y = rConfig.shapeSize();
            events[i].shape.graphics._activeInstructions[1].x = 0, 
            events[i].shape.graphics._activeInstructions[1].y = rConfig.shapeSize() - 8
            events[i].shape.graphics._activeInstructions[3].x = rConfig.shapeSize() - 8
            events[i].shape.graphics._activeInstructions[3].y = 0
            events[i].shape.graphics._activeInstructions[4].x = rConfig.shapeSize()
            events[i].shape.graphics._activeInstructions[4].y = 8
            events[i].shape.graphics._activeInstructions[5].x = rConfig.shapeSize()
            events[i].shape.graphics._activeInstructions[5].y = rConfig.shapeSize()

            const llPath = [{ x: 0, y: 0 }, { x: -(rConfig.shapeHalf() - 8), y: 0 }, { x: -(rConfig.shapeHalf()), y: -8 }, { x: -(rConfig.shapeHalf()), y: -rConfig.shapeSize() }, { x: 0, y: -rConfig.shapeSize() }]
            const lrPath = [{ x: 0, y: 0 }, { x: rConfig.shapeHalf(), y: 0 }, { x: rConfig.shapeHalf(), y: -(rConfig.shapeSize() - 8) }, { x: rConfig.shapeHalf() - 8, y: -rConfig.shapeSize() }, { x: 0, y: -rConfig.shapeSize() }]

            events[i].lines.ll.graphics._activeInstructions.forEach((l, j) => {
                l.x = llPath[j].x;
                l.y = llPath[j].y;
                events[i].lines.lr.graphics._activeInstructions[j].x = lrPath[j].x;
                events[i].lines.lr.graphics._activeInstructions[j].y = lrPath[j].y;
            });

            const maskPath = [
                { x: 0, y: 0 },
                { x: rConfig.imageSize() - 7, y: 0 },
                { x: rConfig.imageSize(), y: 7 },
                { x: rConfig.imageSize(), y: rConfig.imageSize() },
                { x: 7, y: rConfig.imageSize() },
                { x: 0, y: rConfig.imageSize() - 7 }
            ]

            maskPath.forEach((p, j) => {
                events[i].image.mask.graphics._activeInstructions[j].x = p.x;
                events[i].image.mask.graphics._activeInstructions[j].y = p.y;
            });
        }

        events[i].lines.lr.y = coords.pY
        events[i].lines.ll.y = coords.pY
        events[i].lines.ld.x = coords.pX;
        
        events[i].lines.ld.graphics._activeInstructions[0].y = coords.dY;
        if (events[i].shape.revealed) events[i].lines.ld.graphics._activeInstructions[1].y = coords.dY;
        if (events[i].shape.showed) events[i].lines.ld.graphics._activeInstructions[1].y = coords.pY;

        const imageX = -rConfig.imageSize() / 2;
        const imageY = coords.pY - rConfig.shapeSize() + 6;
        
        events[i].image.x = imageX;
        events[i].image.y = imageY;
        events[i].image.scaleX = isMobile() ? 0.4 : 0.5;
        events[i].image.scaleY = isMobile() ? 0.4 : 0.5;
        events[i].image.mask.x = imageX;
        events[i].image.mask.y = imageY;

        events[i].corners.x = -rConfig.shapeHalf() - 13;
        events[i].corners.y = coords.pY - rConfig.shapeSize() - 13;
        events[i].corners.mask.x = -rConfig.shapeHalf() - 14;
        events[i].corners.mask.y = coords.pY - rConfig.shapeSize() - 14;

        events[i].content.y = coords.pY - rConfig.shapeHalf();
        events[i].content.mask.y = coords.pY - rConfig.shapeHalf();
        
        events[i].dContainer.x = coords.pX;
        events[i].dContainer.y = coords.dY;

        if (events[i].shape.hovered){
            events[i].corners.x = -rConfig.shapeHalf() - 7;
            events[i].corners.y = coords.pY - rConfig.shapeSize() - 10;
            events[i].corners.mask.x = -rConfig.shapeHalf() - 8;
            events[i].corners.mask.y = coords.pY - rConfig.shapeSize() - 11;
        }

        events[i].lines.rLd.x = coords.pX;
        events[i].lines.rLd.rdY = coords.dY - rConfig.shapeSize() - 15;
        events[i].lines.rLd.graphics._activeInstructions[0].y = coords.dY;
        events[i].lines.rLd.graphics._activeInstructions[1].y = coords.dY;
        events[i].lines.rLl.x = coords.pX;
        events[i].lines.rLr.x = coords.pX;
        events[i].rBg.x = coords.pX;
        events[i].rText.x = coords.pX;
        // console.log(events[i].lines.rLd);
        // TweenLite.to([events[i].lines.rLl, events[i].lines.rLr, events[i].rText, events[i].rBg], 0.3, { alpha: 0 });

    });

}

let prevBreakpoint = rConfig.currBreakpoint();

window.addEventListener('resize', () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    // canvas.width = w;
    // canvas.height = (h > contentHeight) ? h : contentHeight;
    repositionElems(w, h);
    if (prevBreakpoint != rConfig.currBreakpoint()) {
        anim.showPreloader();
        location.href = './';
    }
})