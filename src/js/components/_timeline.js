import Konva from 'konva';
import { TweenMax, TimelineMax, Power0 } from 'gsap/TweenMax';
import '../plugins/_GSDevTools';
import '../plugins/_KonvaPlugin';
import * as events from '../data/events';

const palette = {
    blue: '#69d6ff',
    yellow: '#fbff33'
}

const parent = document.querySelector('.timeline_scroll');
const graphParams = {
    blueWidth: 6755,
    blueHeight: 422,
    yellowWidth: 826,
    yellowHeight: 317
}




const halfScreen = parent.offsetWidth / 2;

document.querySelector('.timeline_large').style.width = halfScreen + graphParams.blueWidth + graphParams.yellowWidth;

// first we need to create a stage
const stage = new Konva.Stage({
    container: 'timeline',   // id of container <div>
    width: parent.offsetWidth,
    height: (graphParams.blueHeight + graphParams.yellowHeight - 43)
});

// then create layer
const graph = new Konva.Layer();
const lines = new Konva.Layer();
// const dots = new Konva.Layer();

Konva.Image.fromURL('/assets/img/blue_line.svg', line => {
    line.setAttrs({
        x: halfScreen - 2,
        y: stage.height() - graphParams.blueHeight - 118,
        // shadowColor: palette.blue,
        // shadowBlur: 25,
    });
    graph.add(line);
    graph.batchDraw();
});

Konva.Image.fromURL('/assets/img/yellow_line.svg', line => {
    line.setAttrs({
        x: halfScreen + graphParams.blueWidth,
        y: stage.height() - (graphParams.blueHeight + graphParams.yellowHeight - 43) - 118,
        // shadowColor: palette.yellow,
        // shadowBlur: 25,
    });
    graph.add(line);
    graph.batchDraw();
});

const lineBottom = stage.height() - 120;
const graphLine = new Konva.Line({
    points: [0, lineBottom, halfScreen, lineBottom],
    stroke: palette.blue,
    strokeWidth: 2,
    shadowColor: palette.blue,
    shadowBlur: 25,
});
graph.add(graphLine);


const previews = new Konva.Layer();
const dotParams = [
    {
        x: -25,
        y: -50,
        opacity: 0.05
    },
    {
        x: 0,
        y: -50,
        opacity: 0.2
    },
    {
        x: 25,
        y: -50,
        opacity: 0.1
    },
    {
        x: -25,
        y: -28,
        opacity: 0.2
    },
    {
        x: 0,
        y: -28,
        opacity: 1
    },
    {
        x: 25,
        y: -28,
        opacity: 0.1
    },
    {
        x: -25,
        y: -6,
        opacity: 0.1
    },
    {
        x: 0,
        y: -6,
        opacity: 0.05
    },
    {
        x: 25,
        y: -6,
        opacity: 0.2
    }
]
const cornerPoints = [
    {
        points: [0, 3, 0, 0, 3, 0],
        initial: {
            x: 0,
            y: 0
        },
        hover: {
            x: 6,
            y: 3
        }
    },
    {
        points: [0, 0, 3, 0, 3, 3],
        initial: {
            x: 135,
            y: 0
        },
        hover: {
            x: 129,
            y: 3
        }
    },
    {
        points: [0, 0, 0, 3, 3, 3],
        initial: {
            x: 0,
            y: 135
        },
        hover: {
            x: 6,
            y: 132
        }
    },
    {
        points: [3, 0, 3, 3, 0, 3],
        initial: {
            x: 135,
            y: 135
        },
        hover: {
            x: 129,
            y: 132
        }
    }
]


// const opacity = [0.05, 0.1, 0.2];
// const dotsAnim = target => {
//     // TweenMax.to(target, 1, {
//     //     konva: {
//     //         opacity: opacity[Math.floor(Math.random() * opacity.length)],
//     //     },
//     //     ease: Linear.easeNone,
//     //     onComplete: dotsAnim,
//     //     onCompleteParams: [target]
//     // })
//     var tween = new Konva.Tween({
//         node: target,
//         opacity: opacity[Math.floor(Math.random() * opacity.length)],
//         duration: 1,
//         onFinish: function () {
//             tween.destroy();
//             dotsAnim(target)
//         }
//     });
//     tween.play();
// }

const konvaEvents = [];


events.events.forEach((event, i) => {
    if (i < 15) {

    const previewCenterX = ((parent.clientWidth - 1280) / 2) + event.left + 57;
    const previewCenterY = lineBottom - event.prvBottom - 2;

    konvaEvents[i] = new Konva.Group({
        x: previewCenterX,
        y: previewCenterY,
        // visible: false
    });



    const cornerArray = [];

    const rightLine = new Konva.Path({
        x: 0,
        y: -112,
        data: 'M0 112L56 112L56 7.09L49.12 0L0 0',
        stroke: palette.blue,
        strokeWidth: 2,
        // shadowColor: palette.blue,
        // shadowBlur: 25,
    });
    const leftLine = new Konva.Path({
        x: -56,
        y: -112,
        data: 'M56 112L6.88 112L0 104.91L0 0L56 0',
        stroke: palette.blue,
        strokeWidth: 2,
        // shadowColor: palette.blue,
        // shadowBlur: 25,
    });

    const rightLineLen = rightLine.getLength();
    rightLine.dashOffset(rightLineLen);
    rightLine.dash([rightLineLen]);
    const leftLineLen = leftLine.getLength();
    leftLine.dashOffset(leftLineLen);
    leftLine.dash([leftLineLen]);

    const poly = new Konva.Line({
        points: [
            56, 0,
            56, -104,
            48, -112,
            -56, -112,
            -56, -8,
            -48, 0
        ],
        fill: '#02122a',
        stroke: palette.blue,
        strokeWidth: 2,
        closed: true,
        opacity: 0 
        // shadowColor: palette.blue,
        // shadowBlur: 25,
    });
    // const poly2 = new Konva.Line({
    //     points: [
    //         57, 1,
    //         57, -105,
    //         49, -113,
    //         -57, -113,
    //         -57, -8,
    //         -49, 1
    //     ],
    //     fill: '#02122a',
    //     closed: true
    // });


    const corners = new Konva.Group({
        x: -69,
        y: -125,
        opacity: 0
    });

    cornerPoints.forEach((corner, j) => {
        cornerArray[j] = new Konva.Line({
            points: corner.points,
            x: corner.hover.x,
            y: corner.hover.y,
            stroke: palette.blue,
            strokeWidth: 2
        });
        corners.add(cornerArray[j]);
    })


    const image = new Konva.Group({
        x: -50,
        y: -106,
        clipFunc: ctx => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(93, 0);
            ctx.lineTo(100, 7);
            ctx.lineTo(100, 100);
            ctx.lineTo(7, 100);
            ctx.lineTo(0, 93);
            ctx.closePath();
        },
        opacity: 0
    });

    Konva.Image.fromURL(`/assets/img/events/preview/${i + 1}@2x.jpg`, img => {
        img.setAttrs({
            scaleX: 0.5,
            scaleY: 0.5,
        });
        image.add(img);
        previews.batchDraw();
    });


        konvaEvents[i].add(corners, poly, image, rightLine, leftLine);


    const dotCenterX = ((parent.clientWidth - 1280) / 2) + event.left + 57;
    const dotCenterY = lineBottom - event.dotBottom - 28;
    const line = new Konva.Line({
        points: [dotCenterX, dotCenterY, dotCenterX, dotCenterY],
        stroke: palette.blue,
        strokeWidth: 1,
        dash: [4, 2]
    });


    const dotGroup = new Konva.Group({
        x: ((parent.clientWidth - 1280) / 2) + event.left + 57,
        y: lineBottom - event.dotBottom,
    });
    dotParams.forEach(dot => {
        const dotPolygon = new Konva.RegularPolygon({
            x: dot.x,
            y: dot.y,
            sides: 4,
            radius: 4,
            fill: palette.blue,
            opacity: dot.opacity
        });
        dotGroup.add(dotPolygon);
    });



    //     // if (j != 4) dotsAnim(dotPolygon)

    lines.add(line);
    // previews.add();
    graph.add(konvaEvents[i], dotGroup);
    const tl = new TimelineMax();
    tl
        .to(line, 0.5, {
            konva: {
                points: [dotCenterX, dotCenterY, dotCenterX, previewCenterY],
            },
            ease: Power0.easeNone
        }, (0 + i) / 2)
        .to([rightLine, leftLine], 1, {
            konva: {
                dashOffset: 0
            },
            ease: Power0.easeNone
        })
        .to([image, poly, corners], 1, {
            konva: {
                opacity: 1
            }
        })
        .to([rightLine, leftLine], {
            konva: {
                opacity: 0
            }
        }, '-=1')
    cornerArray.forEach((c, i) => {
        tl.to(c, 1, {
            konva: {
                x: cornerPoints[i].initial.x,
                y: cornerPoints[i].initial.y
            }
        }, '-=1')
    })

    tl.timeScale(1.5)
    

    image
        .on('mouseenter', () => {
            TweenMax.to(poly, 0.3, {
                konva: {
                    stroke: palette.yellow,
                    // shadowColor: palette.yellow
                }
            })
            cornerArray.forEach((c, i) => {
                TweenMax.to(c, 0.3, {
                    konva: {
                        x: cornerPoints[i].hover.x,
                        y: cornerPoints[i].hover.y,
                        stroke: palette.yellow
                    }
                })
            })

            TweenMax.to(line, 0.3, {
                konva: {
                    stroke: palette.yellow
                }
            })
            dotGroup.getChildren().forEach(dot => {
                TweenMax.to(dot, 0.3, {
                    konva: {
                        fill: palette.yellow
                    }
                })
            })
            // TweenMax.to(rightLine, 1, {
            //     konva: {
            //         stroke: palette.yellow
            //     }
            // })
        })
        .on('mouseleave', () => {
            TweenMax.to(poly, 0.3, {
                konva: {
                    stroke: palette.blue,
                    // shadowColor: palette.blue
                }
            })
            cornerArray.forEach((c, i) => {
                TweenMax.to(c, 0.3, {
                    konva: {
                        x: cornerPoints[i].initial.x,
                        y: cornerPoints[i].initial.y,
                        stroke: palette.blue
                    }
                })
            })
            TweenMax.to(line, 0.3, {
                konva: {
                    stroke: palette.blue
                }
            })
            dotGroup.getChildren().forEach(dot => {
                TweenMax.to(dot, 0.3, {
                    konva: {
                        fill: palette.blue
                    }
                })
            })
        })
    }
})

// eslint-disable-next-line no-undef
// GSDevTools.create();
// add the layer to the stage
stage.add(lines, graph);

// const 

const scrollContainer = document.querySelector('.timeline_scroll');
function repositionStage() {
    var dx = scrollContainer.scrollLeft;
    stage.container().style.transform = `translateX(${dx}px)`;
    stage.x(-dx);
    // stage.y(-dy);
    stage.batchDraw();
}
scrollContainer.addEventListener('scroll', repositionStage);
repositionStage();



// draw the image
// graph.draw();
// dots.draw();

// const hideUnused = () => {
//     const ovf = document.querySelector('.timeline_overflow').scrollLeft;
//     const mrg = (parent.clientWidth - 1280) / 2;
//     events.events.forEach((el, i) => {
//         // if (i < 15) {
//             const elOffset = (el.left + mrg + 114);
//             // 
//             if ((ovf > elOffset) || ((ovf + parent.clientWidth) < (el.left + mrg))) {
//                 if (konvaEvents[i].visible()) {
//                     konvaEvents[i].hide();
//                     previews.batchDraw();
//                 }
//             } else if (!konvaEvents[i].visible()) {
//                 konvaEvents[i].show();
//                 previews.batchDraw();
//             }
//         // }
//     });
// }

// hideUnused();

// document.querySelector('.timeline_overflow').addEventListener('scroll', hideUnused);










// import './_scroll';

// $('.timeline_event').click(function () {
//     $(this).addClass('selected')
//     const contentHeight = $('.timeline_event_content', this).height() + 24;
//     const itemHeight = (contentHeight > 164) ? contentHeight : 164;

//     TweenMax.to($('.timeline_event_item', this), 0.6, { width: 590, height: itemHeight, x: '-238px', y: (itemHeight - 114) / -2, ease: Elastic.easeOut.config(1, 0.75) });
//     TweenMax.to($('.timeline_event_item_inner', this), 0.6, { padding: '10px 20px 10px 10px', justifyContent: 'center', ease: Elastic.easeOut.config(1, 0.75) });
//     TweenMax.to($('.timeline_event_preview', this), 0.6, { width: 140, ease: Elastic.easeOut.config(1, 0.75) });
//     TweenMax.to($('.timeline_event_content', this), 0.6, { opacity: 1 });
//     // TweenMax.to('.timeline_event', 0.4, { autoAlpha: 0});
// })`


// const timeline = document.querySelector('.timeline_overflow');
// /* We define our function 🕹 */
// function replaceVerticalScrollByHorizontal(event) {
//     if (event.deltaY != 0) {
//         // manually scroll horizonally instead
//         timeline.scroll(timeline.scrollLeft + event.deltaY * 1.5, 0);
//     } else if (event.deltaX != 0) {
//         timeline.scroll(timeline.scrollLeft + event.deltaX * 2, 0);    
//     }
//     return;
// }

// /* Listener on timeline once we start scrolling, we run our function 💨 */
// timeline.addEventListener('wheel', replaceVerticalScrollByHorizontal);
// timeline.addEventListener('scroll', () => {
//     TweenMax.set('.timeline_graph', {
//         x: -timeline.scrollLeft
//     });
// });

// const tl = new TimelineMax({ repeat: -1, ease: Linear.easeNone});
// tl
//     .set('.timeline_event_dot_square', {
//         boxShadow: `-33.5px 2.5px 0 rgba(105, 214, 255, 0.05),
//                     -15.5px -15.5px 0 rgba(105, 214, 255, 0.2),
//                     2px -33px 0 rgba(105, 214, 255, 0.1),
//                     -18px 18px 0 rgba(105, 214, 255, 0.2),
//                     17.5px -17.5px 0 rgba(105, 214, 255, 0.1),
//                     -2.5px 33.5px 0 rgba(105, 214, 255, 0.1),
//                     15.5px 16px 0 rgba(105, 214, 255, 0.05),
//                     33px -2px 0 rgba(105, 214, 255, 0.2)`})
//     .to('.timeline_event_dot_square', 1, {
//         boxShadow: `-33.5px 2.5px 0 rgba(105, 214, 255, 0.1),
//                     -15.5px -15.5px 0 rgba(105, 214, 255, 0.05),
//                     2px -33px 0 rgba(105, 214, 255, 0.2),
//                     -18px 18px 0 rgba(105, 214, 255, 0.05),
//                     17.5px -17.5px 0 rgba(105, 214, 255, 0.2),
//                     -2.5px 33.5px 0 rgba(105, 214, 255, 0.2),
//                     15.5px 16px 0 rgba(105, 214, 255, 0.1),
//                     33px -2px 0 rgba(105, 214, 255, 0.05)`
//     })
//     .to('.timeline_event_dot_square', 1, {
//         boxShadow: `-33.5px 2.5px 0 rgba(105, 214, 255, 0.2),
//                     -15.5px -15.5px 0 rgba(105, 214, 255, 0.1),
//                     2px -33px 0 rgba(105, 214, 255, 0.05),
//                     -18px 18px 0 rgba(105, 214, 255, 0.1),
//                     17.5px -17.5px 0 rgba(105, 214, 255, 0.05),
//                     -2.5px 33.5px 0 rgba(105, 214, 255, 0.05),
//                     15.5px 16px 0 rgba(105, 214, 255, 0.2),
//                     33px -2px 0 rgba(105, 214, 255, 0.1)`
//     })
//     .to('.timeline_event_dot_square', 1, {
//         boxShadow: `-33.5px 2.5px 0 rgba(105, 214, 255, 0.05),
//                     -15.5px -15.5px 0 rgba(105, 214, 255, 0.2),
//                     2px -33px 0 rgba(105, 214, 255, 0.1),
//                     -18px 18px 0 rgba(105, 214, 255, 0.2),
//                     17.5px -17.5px 0 rgba(105, 214, 255, 0.1),
//                     -2.5px 33.5px 0 rgba(105, 214, 255, 0.1),
//                     15.5px 16px 0 rgba(105, 214, 255, 0.05),
//                     33px -2px 0 rgba(105, 214, 255, 0.2)`})