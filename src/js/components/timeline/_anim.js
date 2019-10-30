/* global createjs */
import TweenLite from 'gsap/TweenLite';
import { Power0 } from 'gsap/EasePack';
import { palette, events, canvas, stage, mouse, rndInt, gEvents } from './_config';

const opacity = [0.05, 0.1, 0.2];

const anim = {
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
        
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY,
        }

        events[i].shape.revealing = true;

        const llPath = [[0, 0], [-48, 0], [-56, -8], [-56, -112], [0, -112]];
        const lrPath = [[0, 0], [56, 0], [56, -104], [48, -112], [0, -112]];

        const easing = Power0.easeNone;

        TweenLite.to(events[i].lines.ld.graphics.lt(0, coords.dY).command, 0.5, { y: coords.pY, ease: easing })


        // const llPath = [
        //     {
        //         x: 0,
        //         y: 0,
        //         delay: 0.5
        //     },
        //     {
        //         x: -48,
        //         y: 0
        //     }, 
        //     {
        //         x: -56,
        //         y: -8
        //     }, 
        //     {
        //         x: -56,
        //         y: -112
        //     }, 
        //     {
        //         x: 0,
        //         y: -112
        //     }
        // ];

        
        TweenLite.to(events[i].lines.ll.graphics.lt(...llPath[0]).command, 0.3, {
            x: llPath[1][0], y: llPath[1][1], ease: easing,
            onComplete: () => {
                const lc = events[i].lines.ll.graphics.lt(...llPath[1]).command;
                TweenLite.to(lc, 0.1, {
                    x: llPath[2][0], y: llPath[2][1], ease: easing,
                    onComplete: () => {
                        const lc = events[i].lines.ll.graphics.lt(...llPath[2]).command;
                        TweenLite.to(lc, 0.4, {
                            x: llPath[3][0], y: llPath[3][1], ease: easing,
                            onComplete: () => {
                                const lc = events[i].lines.ll.graphics.lt(...llPath[3]).command;
                                TweenLite.to(lc, 0.3, { x: llPath[4][0], y: llPath[4][1], ease: easing });
                            }
                        })
                    }
                })
            },
            delay: 0.5
        })

        TweenLite.to(events[i].lines.lr.graphics.lt(...lrPath[0]).command, 0.3, {
            x: lrPath[1][0], y: lrPath[1][1],
            onComplete: () => {
                const lc = events[i].lines.lr.graphics.lt(...lrPath[1]).command;
                TweenLite.to(lc, 0.4, {
                    x: lrPath[2][0], y: lrPath[2][1],
                    onComplete: () => {
                        const lc = events[i].lines.lr.graphics.lt(...lrPath[2]).command;
                        TweenLite.to(lc, 0.1, {
                            x: lrPath[3][0], y: lrPath[3][1],
                            onComplete: () => {
                                const lc = events[i].lines.lr.graphics.lt(...lrPath[3]).command;
                                TweenLite.to(lc, 0.3, { x: lrPath[4][0], y: lrPath[4][1] });
                            }
                        })
                    }
                })
            },
            delay: 0.5
        })

        TweenLite.to(events[i].image, 0.5, {
            alpha: 1,
            delay: 1.6
        })


        TweenLite.to(events[i].corners, 0.3, { x: -69, y: events[i].corners.pY - 125, alpha: 1, delay: 1.6 });
        TweenLite.to(events[i].corners.graphics._activeInstructions[0], 0.3, { w: 138, h: 138, delay: 1.6 });

        TweenLite.to(events[i].corners.mask, 0.3, { x: -70, y: events[i].corners.pY - 126, delay: 1.6 });
        const cMaskPath = [
            { x: 0, y: 0 },
            { x: 136, y: 0 },
            { x: 0, y: 136 },
            { x: 136, y: 136 }
        ]

        cMaskPath.forEach((c, j) => {
            c.delay = 1.6;
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })

        setTimeout(() => {
            if (!events[i].shape.fadedOut) {
                TweenLite.to(events[i].shape, 0.5, { alpha: 1 })
                TweenLite.set(events[i].shape, { hoverable: true })
            }
            TweenLite.set(events[i].shape, { revealed: true, showed: true, revealing: false })
        }, 1600);

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
        [events[i].lines.ll.cmd, events[i].lines.lr.cmd, events[i].lines.ld.cmd].forEach(cmd => {
            createjs.Tween.get(cmd).to({ style: palette.yellow }, 300)
        });
        events[i].dots.forEach(d => {
            createjs.Tween.get(d.cmd).to({ style: palette.yellow }, 300)
        })

        createjs.Tween.get(events[i].corners.graphics._stroke).to({ style: palette.yellow }, 300)

        TweenLite.to(events[i].corners, 0.3, { x: -63, y: events[i].corners.pY - 122 });
        TweenLite.to(events[i].corners.graphics._activeInstructions[0], 0.3, { w: 126, h: 132 });

        TweenLite.to(events[i].corners.mask, 0.3, { x: -64, y: events[i].corners.pY - 123 });
        const cMaskPath = [
            { x: 0, y: 0 },
            { x: 124, y: 0 },
            { x: 0, y: 130 },
            { x: 124, y: 130 }
        ]

        cMaskPath.forEach((c, j) => {
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })

        canvas.style.cursor = 'pointer';
    },
    mouseOut: i => {
        [events[i].lines.ll.cmd, events[i].lines.lr.cmd, events[i].lines.ld.cmd].forEach(cmd => {
            createjs.Tween.get(cmd).to({
                style: palette.blue
            }, 300)
        });
        events[i].dots.forEach(d => {
            createjs.Tween.get(d.cmd).to({ style: palette.blue }, 300)
        })

        createjs.Tween.get(events[i].corners.graphics._stroke).to({ style: palette.blue }, 300)
        TweenLite.to(events[i].corners, 0.3, { x: -69, y: events[i].corners.pY - 125 });
        TweenLite.to(events[i].corners.graphics._activeInstructions, 0.3, { w: 138, h: 138 });

        TweenLite.to(events[i].corners.mask, 0.3, { x: -70, y: events[i].corners.pY - 126 });
        const cMaskPath = [
            { x: 0, y: 0 },
            { x: 136, y: 0 },
            { x: 0, y: 136 },
            { x: 136, y: 136 }
        ]

        cMaskPath.forEach((c, j) => {
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })

        canvas.style.cursor = 'default';
    },
    openEvent: i => {
        console.log(i)
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY,
        }

        const centerX = Math.abs(mouse.dest) + canvas.width / 2;
        const centerY = canvas.height / 2 - 120 - 81 - stage.y;
        const textHeight = events[i].text.getBounds().height + 22;
        const eventHeight = (textHeight > 162) ? textHeight : 162;

        // events[i].group.x = Math.abs(mouse.dest) + canvas.width / 2;
        // events[i].shape.x = Math.abs(mouse.dest) + canvas.width / 2 - 294;

        TweenLite.to(events[i].group, 0.3, { x: centerX });
        TweenLite.to(events[i].shape, 0.3, { x: centerX - 294, y: centerY });
        TweenLite.to([events[i].lines.ll, events[i].lines.lr], 0.3, { y: centerY + eventHeight });


        TweenLite.to(events[i].shape.graphics._activeInstructions[0], 0.3, { x: 8, y: eventHeight });
        TweenLite.to(events[i].shape.graphics._activeInstructions[1], 0.3, { x: 0, y: eventHeight - 8 });

        TweenLite.to(events[i].shape.graphics._activeInstructions[3], 0.3, { x: 580, y: 0 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[4], 0.3, { x: 588, y: 8 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[5], 0.3, { x: 588, y: eventHeight });


        const llPath = [{ x: 0, y: 0 }, { x: -286, y: 0 }, { x: -294, y: -8 }, { x: -294, y: -eventHeight }, { x: 0, y: -eventHeight }]
        const lrPath = [{ x: 0, y: 0 }, { x: 294, y: 0 }, { x: 294, y: -eventHeight + 8 }, { x: 286, y: -eventHeight }, { x: 0, y: -eventHeight }]

        events[i].lines.ll.graphics._activeInstructions.forEach((l, j) => {
            TweenLite.to(l, 0.3, llPath[j]);
            TweenLite.to(events[i].lines.lr.graphics._activeInstructions[j], 0.3, lrPath[j]);
        });

        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { x: -events[i].lines.ld.x + centerX, y: centerY + eventHeight });
        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[0], 0.3, { x: -events[i].lines.ld.x + centerX, y: centerY + eventHeight });

        // TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { x: -events[i].lines.ld.x + centerX, y: centerY + 162 });
        const rateMargin = 20;
        const rateOffset = events[i].lines.rLd.rWidth + rateMargin;
        const leftSide = centerX - 294 - rateOffset;
        const rightSide = centerX + 294 + rateOffset;
        let rdY = events[i].lines.rLd.rdY;
        const rLineHeight = events[i].lines.rLd.rLineHeight;

        if (
            coords.pX < rightSide &&
            coords.pX > leftSide
        ) {
            // default
            console.log('center')
            if ((centerY + eventHeight) > (rdY - rLineHeight - rateMargin)){
                console.log('intersect')
                rdY = centerY + eventHeight + rLineHeight + rateMargin;
            }
            
        } else if (coords.pX < leftSide) {
            TweenLite.set([events[i].lines.ld.graphics._activeInstructions[0], events[i].lines.ld.graphics._activeInstructions[1]], {
                x: -events[i].lines.ld.x + centerX - 294,
                y: centerY + 81,
                delay: 0.3
            });
            console.log('left')
        } else if (coords.pX > rightSide) {
            TweenLite.set([events[i].lines.ld.graphics._activeInstructions[0], events[i].lines.ld.graphics._activeInstructions[1]], {
                x: -events[i].lines.ld.x + centerX + 294,
                y: centerY + 81,
                delay: 0.3
            });
            console.log('right')
        }
        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[0], 0.3, { x: 0, y: coords.dY, delay: 0.3 });
        
        TweenLite.set([events[i].lines.rLl, events[i].lines.rLr, events[i].rBg], { y: rdY });
        TweenLite.set(events[i].rText, { y: rdY - (rLineHeight / 2) });

        TweenLite.to(events[i].lines.rLd.graphics._activeInstructions[1], 0.3, { y: rdY, delay: 0.6 });
        TweenLite.to([events[i].lines.rLl, events[i].lines.rLr, events[i].rText, events[i].rBg], 0.3, { alpha: 1, delay: 0.6 });

        TweenLite.to(events[i].image, 0.3, { x: -283, y: centerY + 11, scaleX: 0.7, scaleY: 0.7 });
        TweenLite.to(events[i].image.mask, 0.3, { x: -283, y: centerY + 11 });

        // console.log(events[i].text.getBounds());
        // events[i].text.regY = events[i].text.getBounds().height / 2;
        TweenLite.to(events[i].text, 0.3, { alpha: 1, x: -121, y: centerY + eventHeight / 2 });


        const maskPath = [
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

        TweenLite.to(events[i].corners, 0.3, { x: -305, y: centerY - 13 });
        TweenLite.to(events[i].corners.graphics._activeInstructions[0], 0.3, { w: 611, h: eventHeight + 26 });
        TweenLite.to(events[i].corners.mask, 0.3, { x: -306, y: centerY - 14 });

        const cMaskPath = [
            { x: 0, y: 0 },
            { x: 609, y: 0 },
            { x: 0, y: eventHeight + 24 },
            { x: 609, y: eventHeight + 24 }
        ]
        cMaskPath.forEach((c, j) => {
            TweenLite.to(events[i].corners.mask.graphics._activeInstructions[j], 0.3, c)
        })

        

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

        // console.log(mouse.dest, events[i].group.x, canvas.width)
    },
    closeEvent: i => {
        const coords = {
            pX: events[i].shape.pX,
            pY: events[i].shape.pY,
            dY: events[i].shape.dY
        }

        TweenLite.to(events[i].group, 0.3, { x: coords.pX });
        TweenLite.to(events[i].shape, 0.3, { x: coords.pX - 56, y: coords.pY - 112 });
        TweenLite.to([events[i].lines.ll, events[i].lines.lr], 0.3, { y: coords.pY });


        TweenLite.to(events[i].shape.graphics._activeInstructions[0], 0.3, { x: 8, y: 112 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[1], 0.3, { x: 0, y: 104 });

        TweenLite.to(events[i].shape.graphics._activeInstructions[3], 0.3, { x: 104, y: 0 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[4], 0.3, { x: 112, y: 8 });
        TweenLite.to(events[i].shape.graphics._activeInstructions[5], 0.3, { x: 112, y: 112 });

        const llPath = [{ x: 0, y: 0 }, { x: -48, y: 0 }, { x: -56, y: -8 }, { x: -56, y: -112 }, { x: 0, y: -112 }]
        const lrPath = [{ x: 0, y: 0 }, { x: 56, y: 0 }, { x: 56, y: -104 }, { x: 48, y: -112 }, { x: 0, y: -112 }]

        events[i].lines.ll.graphics._activeInstructions.forEach((l, j) => {
            TweenLite.to(l, 0.3, llPath[j]);
            TweenLite.to(events[i].lines.lr.graphics._activeInstructions[j], 0.3, lrPath[j]);
        });

        TweenLite.to(events[i].lines.ld.graphics._activeInstructions[1], 0.3, { x: 0, y: coords.pY });

        TweenLite.to(events[i].lines.rLd.graphics._activeInstructions[1], 0.3, { y: coords.dY });
        TweenLite.to([events[i].lines.rLl, events[i].lines.rLr, events[i].rText, events[i].rBg], 0.3, { alpha: 0 });

        TweenLite.to(events[i].image, 0.3, { x: -50, y: coords.pY - 106, scaleX: 0.5, scaleY: 0.5 });
        TweenLite.to(events[i].image.mask, 0.3, { x: -50, y: coords.pY - 106 });

        const maskPath = [
            { x: 0, y: 0 },
            { x: 93, y: 0 },
            { x: 100, y: 7 },
            { x: 100, y: 100 },
            { x: 7, y: 100 },
            { x: 0, y: 93 }
        ]

        maskPath.forEach((p, j) => {
            TweenLite.to(events[i].image.mask.graphics._activeInstructions[j], 0.3, p);
        });

        TweenLite.to(events[i].text, 0.3, { alpha: 0, x: 72, y: coords.pY - 56 });


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
    },
    intervalEvent: g => {
        const id = g.group[g.counter % g.group.length];
        g.group.forEach(idx => {
            if ((idx != id) && (events[idx].shape.revealed || events[idx].shape.showed) && !events[id].shape.fadedOut) anim.hideEvent(idx)
        })
        if (!events[id].shape.revealing && !events[id].shape.fadedOut) {
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
    }
}

export {anim};