import $ from 'jquery';
import { TweenLite, Power0, Back, Power4} from 'gsap/TweenMax';
// import 'gsap/ColorPropsPlugin';
import '../../plugins/_ColorPropsPlugin'; // quiet
import { palette, events, canvas, stage, mouse, rndInt, gEvents, ranges, main, rConfig, isMobile } from './_config';

const opacity = [0.05, 0.1, 0.2];

const anim = {
    showMain: () => {
        main.dataset.animated = true;
        TweenLite.to('.main .block_inner', 0.3, {
            css: {
                x: 0
            }
        });
        TweenLite.to('.main', 0.3, {
            css: {
                autoAlpha: 1,
            }
        });
        // stage.movable = false;
        
        setTimeout(() => {
            main.dataset.animated = false;
        }, 300);

        events.forEach((e) => {
            e.shape.hoverable = false;
            TweenLite.to([e.group, e.lines.ld, e.shape], 0.3, { alpha: 0 });
            e.shape.fadedOut = true;
        })
    },
    hideMain: () => {
        main.dataset.animated = true;
        TweenLite.to('.main .block_inner', 0.3, {
            css: {
                x: '-=20'
            }
        });
        TweenLite.to('.main', 0.3, {
            css: {
                autoAlpha: 0,
            }
        });
        setTimeout(() => {
            main.dataset.animated = false;
            anim.revealEvents()
        }, 300);
    },
    showEnd: () => {
        TweenLite.to('.block--regards', 0.3, {
            css: {
                autoAlpha: 1,
            }
        });
        TweenLite.to('.block--regards .block_inner', 0.3, {
            css: {
                x: 0
            }
        });

        TweenLite.to('.hardworkers', 0.3, {
            css: {
                x: 0,
                autoAlpha: 1,
            },
            delay: 0.2
        });
    },
    hideEnd: () => {
        TweenLite.to('.hardworkers', 0.3, {
            css: {
                x: -20,
                autoAlpha: 0,
            },
        });

        TweenLite.to('.block--regards', 0.3, {
            css: {
                autoAlpha: 0,
            },
            delay: 0.2
        });
        TweenLite.to('.block--regards .block_inner', 0.3, {
            css: {
                x: -20
            },
            delay: 0.2
        });
    },
    revealEvents: () => {
        if (main.dataset.revealed == 'false'){
            events.some(({shape}, i) => {
                const pX = shape.pX;
                if ((pX - 60) < canvas.offsetWidth) {
                    setTimeout(() => {
                        if (!shape.revealed && !shape.revealing) {
                            const gid = gEvents.findIndex(({ group }) => group.includes(i));
                            if (gid != -1) {
                                // console.log(i)
                                anim.changeEvent(gid)
                            } else {
                                anim.revealEvent(i)
                            }
                        }
                    }, 0 + (i * 600) / 2);
                } else {
                    return true;
                }
            })
            main.dataset.revealed = true;
        } else {
            events.forEach(({ shape, group, lines }) => {
                shape.fadedOut = false;
                TweenLite.to([group, lines.ld], 0.3, { alpha: 1 });
                if (shape.revealed && shape.showed) {
                    TweenLite.to(shape, 0.3, { alpha: 1 });
                    shape.hoverable = true;
                }
            })
        }

        stage.movable = true;
    },
    dots: dot => {
        const alpha = opacity[Math.floor(Math.random() * opacity.length)];
        TweenLite.to(dot, 1, {
            alpha: alpha,
            ease: Power0.easeNone,
            onComplete: anim.dots,
            onCompleteParams: [dot]
        })
    },
    revealEvent: i => {
        const timeScale = 0.6;
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY,
        }

        events[i].shape.revealing = true;

        const llPath = [[0, 0], [-(rConfig.shapeHalf() - 8), 0], [-rConfig.shapeHalf(), -8], [-rConfig.shapeHalf(), -rConfig.shapeSize()], [0, -rConfig.shapeSize()]];
        const lrPath = [[0, 0], [rConfig.shapeHalf(), 0], [rConfig.shapeHalf(), -rConfig.shapeSize() + 8], [rConfig.shapeHalf() - 8, -rConfig.shapeSize()], [0, -rConfig.shapeSize()]];

        const easing = Power0.easeNone;

        TweenLite.to(events[i].lines.ld.graphics.lt(0, coords.dY).command, 0.5 * timeScale, { y: coords.pY, ease: easing })
        
        TweenLite.to(events[i].lines.ll.graphics.lt(...llPath[0]).command, 0.3 * timeScale, {
            x: llPath[1][0], y: llPath[1][1], ease: easing,
            onComplete: () => {
                const lc = events[i].lines.ll.graphics.lt(...llPath[1]).command;
                TweenLite.to(lc, 0.1 * timeScale, {
                    x: llPath[2][0], y: llPath[2][1], ease: easing,
                    onComplete: () => {
                        const lc = events[i].lines.ll.graphics.lt(...llPath[2]).command;
                        TweenLite.to(lc, 0.4 * timeScale, {
                            x: llPath[3][0], y: llPath[3][1], ease: easing,
                            onComplete: () => {
                                const lc = events[i].lines.ll.graphics.lt(...llPath[3]).command;
                                TweenLite.to(lc, 0.3 * timeScale, { x: llPath[4][0], y: llPath[4][1], ease: easing });
                            }
                        })
                    }
                })
            },
            delay: 0.5 * timeScale
        })

        TweenLite.to(events[i].lines.lr.graphics.lt(...lrPath[0]).command, 0.3 * timeScale, {
            x: lrPath[1][0], y: lrPath[1][1],
            onComplete: () => {
                const lc = events[i].lines.lr.graphics.lt(...lrPath[1]).command;
                TweenLite.to(lc, 0.4 * timeScale, {
                    x: lrPath[2][0], y: lrPath[2][1],
                    onComplete: () => {
                        const lc = events[i].lines.lr.graphics.lt(...lrPath[2]).command;
                        TweenLite.to(lc, 0.1 * timeScale, {
                            x: lrPath[3][0], y: lrPath[3][1],
                            onComplete: () => {
                                const lc = events[i].lines.lr.graphics.lt(...lrPath[3]).command;
                                TweenLite.to(lc, 0.3 * timeScale, { x: lrPath[4][0], y: lrPath[4][1] });
                            }
                        })
                    }
                })
            },
            delay: 0.5 * timeScale
        })

        TweenLite.to(events[i].image, 0.5 * timeScale, {
            alpha: 1,
            delay: 1.6 * timeScale
        })


        TweenLite.to(events[i].corners, 0.3 * timeScale, { x: -rConfig.shapeHalf() - 13, y: events[i].shape.pY - rConfig.shapeSize() - 13, alpha: 1, delay: 1.6 * timeScale });
        TweenLite.to(events[i].corners.graphics._activeInstructions[0], 0.3 * timeScale, { w: rConfig.shapeSize() + 26, h: rConfig.shapeSize() + 26, delay: 1.6 * timeScale });

        TweenLite.to(events[i].corners.mask, 0.3 * timeScale, { x: -rConfig.shapeHalf() - 14, y: events[i].shape.pY - rConfig.shapeSize() - 14, delay: 1.6 * timeScale });
        const cMaskPath = [
            { x: 0, y: 0 },
            { x: rConfig.shapeSize() + 24, y: 0 },
            { x: 0, y: rConfig.shapeSize() + 24 },
            { x: rConfig.shapeSize() + 24, y: rConfig.shapeSize() + 24 }
        ]

        cMaskPath.forEach((c, j) => {
            c.delay = 1.6 * timeScale;
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3 * timeScale, c)
        })

        setTimeout(() => {
            if (!events[i].shape.fadedOut) {
                TweenLite.to(events[i].shape, 0.5 * timeScale, { alpha: 1 })
                TweenLite.set(events[i].shape, { hoverable: true })
            }
            TweenLite.set(events[i].shape, { revealed: true, showed: true, revealing: false })
        }, 1600 * timeScale);

    },
    showEvent: i => {
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY,
        }
        // events[i].shape.revealing = true;
        const easing = Power0.easeNone;
        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { y: coords.pY, ease: easing })

        TweenLite.to([events[i].lines.ll, events[i].lines.lr, events[i].image], 0.5, {
            alpha: 1,
        })
        TweenLite.to(events[i].corners, 0.5, { alpha: 1 });

        TweenLite.to(events[i].shape, 0.5, { alpha: 1 })
        TweenLite.set(events[i].shape, { hoverable: true, delay: 0.5})
        TweenLite.set(events[i].shape, { showed: true })
    },
    hideEvent: i => {
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY,
        }

        // events[i].shape.revealing = true;
        // 0.3, 0.4, 0.1, 0.3
        // const llPath = [
        //     {
        //         x: 0,
        //         y: -112,
        //         delay:
        //     }, -56, -112], [-56, -8], [-48, 0], [0, 0]];
        // // const lrPath = [[0, -112], [48, -112], [56, -104], [56, 0], [0, 0]];

        const easing = Power0.easeNone;

        // llPath.forEach((c, j) => {
        //     TweenLite.to(events[i].lines.ll.graphics._activeInstructions[j], 0.5, { ...c, ease: easing })
        //     TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.5, { ...c, ease: easing })
        // })


        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { y: coords.dY, ease: easing })

        TweenLite.to([events[i].lines.ll, events[i].lines.lr, events[i].image], 0.5, {
            alpha: 0,
        })


        TweenLite.to(events[i].corners, 0.5, { alpha: 0 });

        TweenLite.to(events[i].shape, 0.5, { alpha: 0 })
        TweenLite.set(events[i].shape, { hoverable: false, showed: false })
        anim.mouseOut(i);

        // setTimeout(() => {
        //     if (!events[i].shape.fadedOut) {
        //     }
        // }, 1600);
    },
    mouseOver: i => {

        TweenLite.to([events[i].lines.ll.graphics._stroke, 
            events[i].lines.lr.graphics._stroke, 
            events[i].lines.ld.graphics._stroke
        ], 0.3, { colorProps: {style: palette.yellow} });

        events[i].dots.forEach(d => {
            TweenLite.to(d.graphics._fill, 0.3, { colorProps: { style: palette.yellow }});
        })

        TweenLite.to(events[i].corners.graphics._stroke, 0.3, { colorProps: { style: palette.yellow } });
        
        TweenLite.to(events[i].corners, 0.3, { x: -rConfig.shapeHalf() - 7, y: events[i].shape.pY - rConfig.shapeSize() - 10 });
        TweenLite.to(events[i].corners.graphics._activeInstructions[0], 0.3, { w: rConfig.shapeSize() + 14, h: rConfig.shapeSize() + 20 });

        TweenLite.to(events[i].corners.mask, 0.3, { x: -rConfig.shapeHalf() - 8, y: events[i].shape.pY - rConfig.shapeSize() - 11 });
        const cMaskPath = [
            { x: 0, y: 0 },
            { x: rConfig.shapeSize() + 12, y: 0 },
            { x: 0, y: rConfig.shapeSize() + 18 },
            { x: rConfig.shapeSize() + 12, y: rConfig.shapeSize() + 18 }
        ]

        cMaskPath.forEach((c, j) => {
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })

        canvas.style.cursor = 'pointer';
    },
    mouseOut: i => {

        TweenLite.to([
            events[i].lines.ll.graphics._stroke, 
            events[i].lines.lr.graphics._stroke, 
            events[i].lines.ld.graphics._stroke
        ], 0.3, { colorProps: {style: palette.blue} });

        events[i].dots.forEach(d => {
            TweenLite.to(d.graphics._fill, 0.3, { colorProps: { style: palette.blue }});
        })

        TweenLite.to(events[i].corners.graphics._stroke, 0.3, { colorProps: { style: palette.blue } });
        
        TweenLite.to(events[i].corners, 0.3, { x: -rConfig.shapeHalf() - 13, y: events[i].shape.pY - rConfig.shapeSize() - 13 });
        TweenLite.to(events[i].corners.graphics._activeInstructions, 0.3, { w: rConfig.shapeSize() + 26, h: rConfig.shapeSize() + 26 });

        TweenLite.to(events[i].corners.mask, 0.3, { x: -rConfig.shapeHalf() - 14, y: events[i].shape.pY - rConfig.shapeSize() - 14 });
        const cMaskPath = [
            { x: 0, y: 0 },
            { x: rConfig.shapeSize() + 24, y: 0 },
            { x: 0, y: rConfig.shapeSize() + 24 },
            { x: rConfig.shapeSize() + 24, y: rConfig.shapeSize() + 24 }
        ]

        cMaskPath.forEach((c, j) => {
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })
        if (!events.some(({ shape }) => shape.hovered)){
            canvas.style.cursor = 'default';
        }
    },
    openEvent: i => {
        if (mouse.fin <= ranges[5].x()){
            anim.hideEnd()
        }

        const isMob = isMobile();

        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY,
        }

        const centerX = Math.abs(mouse.dest) + canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2 - rConfig.bottomMargin() - 81 - (stage.y / window.devicePixelRatio);
        // const textHeight = events[i].text.getBounds().height + 22;
        // const buttonHeight = events[i].hasOwnProperty('button') ? 35 + 22 : 0;
        // const totalHeight = textHeight + buttonHeight;
        const eventWidth = isMob ? 280 : 588;
        const eventHalf = eventWidth / 2;
        const eventHeight = events[i].content.eventHeight + 22;

        // events[i].group.x = Math.abs(mouse.dest) + canvas.offsetWidth / 2;
        // events[i].shape.x = Math.abs(mouse.dest) + canvas.offsetWidth / 2 - 294;

        TweenLite.to([
            events[i].lines.ll.graphics._stroke,
            events[i].lines.lr.graphics._stroke,
            events[i].lines.ld.graphics._stroke
        ], 0.3, { colorProps: { style: palette.yellow } });

        events[i].dots.forEach(d => {TweenLite.to(d.graphics._fill, 0.3, { colorProps: { style: palette.yellow } }) })
        TweenLite.to(events[i].corners.graphics._stroke, 0.3, { colorProps: { style: palette.yellow } });

        TweenLite.to(events[i].group, 0.3, { x: centerX });
        TweenLite.to(events[i].shape, 0.3, { x: centerX - eventHalf, y: centerY });
        TweenLite.to([events[i].lines.ll, events[i].lines.lr], 0.3, { y: centerY + eventHeight });


        TweenLite.to(events[i].shape.graphics._activeInstructions[0], 0.3, { x: 8, y: eventHeight });
        TweenLite.to(events[i].shape.graphics._activeInstructions[1], 0.3, { x: 0, y: eventHeight - 8 });

        TweenLite.to(events[i].shape.graphics._activeInstructions[3], 0.3, { x: eventWidth - 8, y: 0 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[4], 0.3, { x: eventWidth, y: 8 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[5], 0.3, { x: eventWidth, y: eventHeight });


        const llPath = [{ x: 0, y: 0 }, { x: -eventHalf + 8, y: 0 }, { x: -eventHalf, y: -8 }, { x: -eventHalf, y: -eventHeight }, { x: 0, y: -eventHeight }]
        const lrPath = [{ x: 0, y: 0 }, { x: eventHalf, y: 0 }, { x: eventHalf, y: -eventHeight + 8 }, { x: eventHalf - 8, y: -eventHeight }, { x: 0, y: -eventHeight }]

        events[i].lines.ll.graphics._activeInstructions.forEach((l, j) => {
            TweenLite.to(l, 0.3, llPath[j]);
            TweenLite.to(events[i].lines.lr.graphics._activeInstructions[j], 0.3, lrPath[j]);
        });

        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { x: -events[i].lines.ld.x + centerX, y: centerY + eventHeight });
        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[0], 0.3, { x: -events[i].lines.ld.x + centerX, y: centerY + eventHeight });

        // TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { x: -events[i].lines.ld.x + centerX, y: centerY + 162 });
        const rateMargin = 20;
        const rateOffset = events[i].lines.rLd.rWidth + rateMargin;
        const leftSide = centerX - eventHalf - rateOffset;
        const rightSide = centerX + eventHalf + rateOffset;
        let rdY = events[i].lines.rLd.rdY;
        const rLineHeight = events[i].lines.rLd.rLineHeight;

        if (
            coords.pX < rightSide &&
            coords.pX > leftSide
        ) {
            // center
            if ((centerY + eventHeight) > (rdY - rLineHeight - rateMargin)){
                console.log('intersect')
                rdY = centerY + eventHeight + rLineHeight + rateMargin;
            }
            
        } else if (coords.pX < leftSide) {
            TweenLite.set([events[i].lines.ld.graphics._activeInstructions[0], events[i].lines.ld.graphics._activeInstructions[1]], {
                x: -events[i].lines.ld.x + centerX - eventHalf,
                y: centerY + 81,
                delay: 0.3
            });
            // left
        } else if (coords.pX > rightSide) {
            TweenLite.set([events[i].lines.ld.graphics._activeInstructions[0], events[i].lines.ld.graphics._activeInstructions[1]], {
                x: -events[i].lines.ld.x + centerX + eventHalf,
                y: centerY + 81,
                delay: 0.3
            });
            // right
        }
        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[0], 0.3, { x: 0, y: coords.dY, delay: 0.3 });
        
        TweenLite.set([events[i].lines.rLl, events[i].lines.rLr, events[i].rBg], { y: rdY });
        TweenLite.set(events[i].rText, { y: rdY - (rLineHeight / 2) });

        TweenLite.to(events[i].lines.rLd.graphics._activeInstructions[1], 0.3, { y: rdY, delay: 0.6 });
        TweenLite.to([events[i].lines.rLl, events[i].lines.rLr, events[i].rText, events[i].rBg], 0.3, { alpha: 1, delay: 0.6 });

        TweenLite.to(events[i].image, 0.3, { x: -eventHalf + 11, y: centerY + 11, scaleX: 0.7, scaleY: 0.7 });
        TweenLite.to(events[i].image.mask, 0.3, { x: -eventHalf + 11, y: centerY + 11 });

        TweenLite.to(events[i].content, 0.3, { alpha: 1 });
        TweenLite.to([events[i].content, events[i].content.mask], 0.3, { x: isMob ? -130 : -121, y: centerY + eventHeight / 2 });
        TweenLite.to(events[i].content.mask, 0.3, { regY: eventHeight / 2 });
        TweenLite.to(events[i].content.mask.graphics._activeInstructions[0], 0.3, { w: isMob ? 257 : 394, h: eventHeight + 1 });

        // console.log(events[i].text.getBounds());
        // events[i].text.regY = events[i].text.getBounds().height / 2;
        // const posText = (eventHeight == 162 && buttonHeight) ? eventHeight - 35 : buttonHeight ? textHeight : eventHeight;
        // TweenLite.to(events[i].text, 0.3, { alpha: 1, x: -121, y: centerY + posText / 2 });
        // if (buttonHeight){
        //     const buttonWidth = events[i].button.buttonLine.buttonWidth;
        //     TweenLite.to(events[i].button.buttonLine, 0.3, { alpha: 1, x: 272 - buttonWidth, y: centerY + eventHeight - 11 });
        //     TweenLite.to(events[i].button.buttonText, 0.3, { alpha: 1, x: 272 - buttonWidth / 2, y: centerY + eventHeight - 11 - 17});
        // }
        
        const maskPath = 
            isMob ? [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 7 },
                { x: 0, y: eventHeight - 22 },
                { x: 0, y: eventHeight - 22 },
                { x: 0, y: eventHeight - 22 - 7 }
            ] : [
                { x: 0, y: 0 },
                { x: 133, y: 0 },
                { x: 140, y: 7 },
                { x: 140, y: 140 },
                { x: 7, y: 140 },
                { x: 0, y: 133 }
            ]

        maskPath.forEach((p, j) => {
            TweenLite.to(events[i].image.mask.graphics._activeInstructions[j], 0.3, p);
        });

        TweenLite.to(events[i].corners, 0.3, { x: -eventHalf - 11, y: centerY - 13 });
        TweenLite.to(events[i].corners.graphics._activeInstructions[0], 0.3, { w: eventWidth + 23, h: eventHeight + 26 });
        TweenLite.to(events[i].corners.mask, 0.3, { x: -eventHalf - 12, y: centerY - 14 });

        const cMaskPath = [
            { x: 0, y: 0 },
            { x: eventWidth + 21, y: 0 },
            { x: 0, y: eventHeight + 24 },
            { x: eventWidth + 21, y: eventHeight + 24 }
        ]
        cMaskPath.forEach((c, j) => {
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })

        
        events[i].shape.opening = true;
        TweenLite.set(events[i].shape, { opened: true, delay: 0.6 });

        canvas.style.cursor = 'default';
        
        stage.movable = false;

        events.forEach((e, j) => {
            e.shape.hoverable = false;
            if (i !== j) {
                TweenLite.to([e.group, e.lines.ld, e.shape], 0.3, { alpha: 0 });
                e.shape.fadedOut = true;
            }
        })
        // eventsData.events[i].left 

        // console.log(mouse.dest, events[i].group.x, canvas.offsetWidth)
    },
    closeEvent: i => {
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY
        }

        TweenLite.to(events[i].group, 0.3, { x: coords.pX });
        TweenLite.to(events[i].shape, 0.3, { x: coords.pX - rConfig.shapeHalf(), y: coords.pY - rConfig.shapeSize() });
        TweenLite.to([events[i].lines.ll, events[i].lines.lr], 0.3, { y: coords.pY });

        TweenLite.to(events[i].shape.graphics._activeInstructions[0], 0.3, { x: 8, y: rConfig.shapeSize() });
        TweenLite.to(events[i].shape.graphics._activeInstructions[1], 0.3, { x: 0, y: rConfig.shapeSize() - 8 });

        TweenLite.to(events[i].shape.graphics._activeInstructions[3], 0.3, { x: rConfig.shapeSize() - 8, y: 0 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[4], 0.3, { x: rConfig.shapeSize(), y: 8 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[5], 0.3, { x: rConfig.shapeSize(), y: rConfig.shapeSize() });


        const llPath = [{ x: 0, y: 0 }, { x: -(rConfig.shapeHalf() - 8), y: 0 }, { x: -(rConfig.shapeHalf()), y: -8 }, { x: -(rConfig.shapeHalf()), y: -rConfig.shapeSize() }, { x: 0, y: -rConfig.shapeSize() }]
        const lrPath = [{ x: 0, y: 0 }, { x: rConfig.shapeHalf(), y: 0 }, { x: rConfig.shapeHalf(), y: -(rConfig.shapeSize() - 8) }, { x: rConfig.shapeHalf() - 8, y: -rConfig.shapeSize() }, { x: 0, y: -rConfig.shapeSize() }]

        events[i].lines.ll.graphics._activeInstructions.forEach((l, j) => {
            TweenLite.to(l, 0.3, llPath[j]);
            TweenLite.to(events[i].lines.lr.graphics._activeInstructions[j], 0.3, lrPath[j]);
        });

        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { x: 0, y: coords.pY });

        TweenLite.to(events[i].lines.rLd.graphics._activeInstructions[1], 0.3, { y: coords.dY });
        TweenLite.to([events[i].lines.rLl, events[i].lines.rLr, events[i].rText, events[i].rBg], 0.3, { alpha: 0 });

        TweenLite.to(events[i].image, 0.3, { x: -rConfig.imageSize() / 2, y: coords.pY - rConfig.shapeSize() + 6, scaleX: isMobile() ? 0.4 : 0.5, scaleY: isMobile() ? 0.4 : 0.5 });
        TweenLite.to(events[i].image.mask, 0.3, { x: -rConfig.imageSize() / 2, y: coords.pY - rConfig.shapeSize() + 6 });

        const maskPath = [
            { x: 0, y: 0 },
            { x: rConfig.imageSize() - 7, y: 0 },
            { x: rConfig.imageSize(), y: 7 },
            { x: rConfig.imageSize(), y: rConfig.imageSize() },
            { x: 7, y: rConfig.imageSize() },
            { x: 0, y: rConfig.imageSize() - 7 }
        ]

        maskPath.forEach((p, j) => {
            TweenLite.to(events[i].image.mask.graphics._activeInstructions[j], 0.3, p);
        });

        TweenLite.to(events[i].content, 0.3, { alpha: 0 });
        TweenLite.to([events[i].content, events[i].content.mask], 0.3, { x: rConfig.shapeHalf() + 16, y: coords.pY - rConfig.shapeHalf() });
        TweenLite.to(events[i].content.mask, 0.3, { regY: rConfig.imageSize() / 2 });
        TweenLite.to(events[i].content.mask.graphics._activeInstructions[0], 0.3, { w: 0, h: rConfig.imageSize() });

        if (mouse.fin <= ranges[5].x()) {
            setTimeout(() => {
                anim.showEnd()
            }, 300);
        }

        events[i].shape.opening = false;
        stage.movable = true;
        events[i].shape.opened = false;
        
        events.forEach(({ shape, group, lines }) => {
            if (shape.revealed && shape.showed) shape.hoverable = true;
            shape.fadedOut = false;
            if (!shape.opened) {
                TweenLite.to([group, lines.ld], 0.3, { alpha: 1 });
                if (shape.revealed && shape.showed) TweenLite.to(shape, 0.3, { alpha: 1 });
            }
        })
        
        anim.mouseOut(i);
    },
    intervalEvent: g => {
        const id = g.group[g.counter % g.group.length];
        g.group.forEach(idx => {
            if (((idx != id && !events[idx].shape.hovered) || !events[idx].shape.hovered) && (events[idx].shape.revealed || events[idx].shape.showed) && !events[id].shape.fadedOut && !events[id].shape.opened && !events[id].shape.opening) {
                anim.hideEvent(idx)
            }
        })
        if (!events[id].shape.revealing && !events[id].shape.fadedOut && !events[id].shape.opened && !events[id].shape.opening && !g.group.some(i => events[i].shape.hovered)) {
            if (!events[id].shape.revealed) {
                anim.revealEvent(id)
            } else {
                anim.showEvent(id)
            }
            g.counter++;
        }
    },
    changeEvent: gidx => {
        const g = gEvents[gidx];
        if (!g.started) {
            anim.intervalEvent(g)
            setInterval(() => {
                anim.intervalEvent(g)
            }, rndInt(3000, 3000));
            g.started = true;
        }
    },
    hideGroup: i => {
        const gid = gEvents.findIndex(({ group }) => group.includes(i));
        if(gid != -1){
            gEvents[gid].group.forEach(idx => {
                if (!events[idx].shape.hovered && (events[idx].shape.revealed || events[idx].shape.showed) && !events[idx].shape.fadedOut && !events[idx].shape.opened && !events[idx].shape.opening) anim.hideEvent(idx)
            })
        }
    },
    buttonOver: i => {
        TweenLite.to(events[i].button.graphics._fill, 0.25, {colorProps: {style: palette.yellow}})
        TweenLite.to(events[i].buttonText, 0.25, { colorProps: { color: '#004577'}})
        canvas.style.cursor = 'pointer';
    },
    buttonOut: i => {
        TweenLite.to(events[i].button.graphics._fill, 0.25, { colorProps: { style: 'transparent'}})
        TweenLite.to(events[i].buttonText, 0.25, { colorProps: { color: palette.yellow}})
        canvas.style.cursor = 'default';
    },
    openPopup: () => {
        TweenLite.to('.reveal-overlay', 0.3, {
            autoAlpha: 1
        })
        TweenLite.to('.reveal', 0.3, {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            ease: Back.easeOut.config(1.7),
            delay: 0.1
        })
        $('.reveal').addClass('is_open')
    },
    closePopup: () => {
        TweenLite.to('.reveal-overlay', 0.3, {
            autoAlpha: 0,
            delay: 0.1
        })
        TweenLite.to('.reveal', 0.3, {
            x: 0,
            y: -18,
            z: 0,
            rotationX: 8,
            ease: Back.easeIn.config(1.7)
        })
        $('.reveal').removeClass('is_open')
    },
    mobileStep: (prevStep, direction) => {
        const step = Number(prevStep) + ((direction == 'prev') ? -1 : 1);
        main.dataset.step = step;
        main.dataset.animated = true;
        const $graphLine = $('.hint--graph .hint_line');

        switch (step) {
            case 1:
                TweenLite.to('.hint--graph', 0.3, { autoAlpha: 0 });
                TweenLite.to(canvas, 0.3, { css: { opacity: 0 } });
                TweenLite.to('.timeline_years', 0.3, { autoAlpha: 0 });
                TweenLite.to('.main_button', 0.3, { autoAlpha: 0 });

                TweenLite.to('.main_inner h1', 0.3, { autoAlpha: 1, delay: 0.3 });
                TweenLite.to('.main_blocks', 0.3, { autoAlpha: 1, delay: 0.3 });
                TweenLite.to('.main .block_inner', 0.3, { css: { x: 0 }, delay: 0.3 });
                TweenLite.to('.main_down', 0.3, { autoAlpha: 1, delay: 0.3 });

                setTimeout(() => {
                    main.dataset.animated = false;
                    mouse.delta = 0;
                }, 600);
                break;
            case 2:
                TweenLite.to('.main_inner h1', 0.3, { autoAlpha: 0 });
                TweenLite.to('.main_blocks', 0.3, {autoAlpha: 0});
                TweenLite.to('.main .block_inner', 0.3, {css: {x: '-=20'}});
                TweenLite.to('.main_down', 0.3, { autoAlpha: 0 });

                if (!$graphLine.hasClass('expanded')){
                    TweenLite.to('.hint--graph', 0.3, { autoAlpha: 1 });
                    TweenLite.to('.hint--graph .hint_movable', 0.7, { x: 0, ease: Power4.easeOut, delay: 0.3 })
                    TweenLite.to($graphLine[0], 0.2, { width: $graphLine.attr('data-width'), ease: Power0.easeNone, delay: 0.3 })
                    TweenLite.to($graphLine[0], 0.5, { height: $graphLine.attr('data-height'), ease: Power0.easeNone, delay: 0.5 })
                    TweenLite.to(canvas, 0.7, { css: { opacity: 1 }, delay: 0.3  });
                    TweenLite.to('.timeline_years', 0.7, { autoAlpha: 1, delay: 0.3  });
                } else {
                    TweenLite.to('.hint--graph', 0.3, { autoAlpha: 1, delay: 0.3 });
                    TweenLite.to(canvas, 0.3, { css: { opacity: 1 }, delay: 0.3  });
                    TweenLite.to('.timeline_years', 0.3, { autoAlpha: 1, delay: 0.3  });
                }
                TweenLite.to('.main_button', 0.3, { autoAlpha: 1, delay: 0.3  });
                setTimeout(() => {
                    $graphLine.addClass('expanded');
                    main.dataset.animated = false;
                    mouse.delta = 0;
                }, 1000);
                break;
            case 3: 
                TweenLite.to('.hint--graph', 0.3, { autoAlpha: 0 });
                
                TweenLite.to('.hint--event', 0.3, { opacity: 1, delay: 0.2 })
                TweenLite.fromTo('#gEventMaskM path', 1, { drawSVG: '50% 50%' }, { drawSVG: true, delay: 0.5 })
                TweenLite.to('.hint--event .hint_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.5 })
                setTimeout(() => {
                    main.dataset.animated = false;
                    mouse.delta = 0;
                }, 1500);
                break;
            case 4:
                TweenLite.to('.hint--event', 0.3, { autoAlpha: 0 });
                TweenLite.to('.main_button', 0.3, { autoAlpha: 0, delay: 0.1 });


                TweenLite.to('.lead', 0.3, { autoAlpha: 1, delay: 0.4 })
                TweenLite.to('.lead_movable', 1, { x: 0, ease: Power4.easeOut, delay: 0.7 })
                $('.lead_line').addClass('expanded')

                anim.revealEvents();
                stage.movable = false;
                setTimeout(() => {
                    main.dataset.animated = false;
                    // main.dataset.visible = false;
                    mouse.delta = 0;
                    $('.main').addClass('backoff')
                    stage.movable = true
                }, 1600);
                break;
            case 5: 
                TweenLite.to('.lead', 0.3, { autoAlpha: 0 });
                setTimeout(() => {
                    TweenLite.set('.main', {css: {autoAlpha: 0}});
                    main.dataset.visible = false;
                    main.dataset.animated = false;
                    stage.movable = true
                }, 300);
                break;
        }
    },
    showPreloader: () => {
        TweenLite.set('.preloader', { autoAlpha: 1 })
    }
}

export {anim};