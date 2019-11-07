// import { anim } from './_anim';

/* global createjs */
const events = [];

const gEvents = [
    {
        counter: 0,
        group: [12, 13]
    },
    {
        counter: 0,
        group: [15, 16]
    },
    {
        counter: 0,
        group: [17, 18, 19]
    },
    {
        counter: 0,
        group: [20, 21, 22]
    },
    {
        counter: 0,
        group: [26, 27]
    },
    {
        counter: 0,
        group: [34, 35]
    },
    {
        counter: 0,
        group: [39, 40]
    },
    {
        counter: 0,
        group: [43, 44]
    },
    {
        counter: 0,
        group: [45, 46]
    },
    {
        counter: 0,
        group: [48, 49, 52]
    },
    {
        counter: 0,
        group: [50, 51, 52]
    },
    {
        counter: 0,
        group: [55, 56]
    },
    {
        counter: 0,
        group: [60, 59, 58]
    },
    {
        counter: 0,
        group: [61, 62, 63, 64]
    },
    {
        counter: 0,
        group: [65, 66, 67]
    },
    {
        counter: 0,
        group: [68, 69, 70]
    },
    {
        counter: 0,
        group: [71, 72]
    },
    {
        counter: 0,
        group: [78, 79]
    },
    {
        counter: 0,
        group: [80, 81, 82]
    },
]

const palette = {
    blue: '#69d6ff',
    yellow: '#fbff33'
}

const dx = 112;
const dy = 112;
const accRate = 10;

const graphParams = {
    blueWidth: 6755,
    blueHeight: 422,
    yellowWidth: 826,
    yellowHeight: 317
}

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

const main = document.querySelector('.main');
const canvas = document.getElementById('canvas');
const stage = new createjs.Stage('canvas');
stage.movable = false;

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
        if (stage.movable) {
            if (deltaY != 0) {
                this.dest -= deltaY * 1.5;
            } else if (deltaX != 0) {
                this.dest -= deltaX * 1.5;
            }
        }
        this.delta = deltaX || deltaY;
        // if ((deltaY > 0 || deltaX > 0) && main.dataset.visible == 'true') {
        //     // console.log('hide main')
        //     anim.hideMain();
        //     main.dataset.visible = false;
        // }
        // if (stage.movable && main.dataset.visible == 'false' && mouse.fin == 0 && (deltaY < 0 || deltaX < 0)) {
        //     // console.log('show main')
        //     anim.showMain();
        //     main.dataset.visible = true;
        // }
    },
    moveFunction: function ({ clientX, clientY }) {
        this.mouse = {
            x: clientX,
            y: clientY,
        };
    },
    dest: 0,
    fin: 0,
    delta: 0,
    mouse: { x: 0, y: 0 },
};

const rndInt = (min, range) => {
    return Math.floor((Math.random() * (range + 1)) + min)
}

const ranges = [
    {
        label: 'Начало',
        x: 0
    },
    {
        label: '2011 – 2012',
        x: -(((canvas.offsetWidth - 1280) / 2) + 1093 - 20)
    },
    {
        label: '2013 – 2014',
        x: -(((canvas.offsetWidth - 1280) / 2) + 1621 - 20)
    },
    {
        label: '2015 – 2016',
        x: -(((canvas.offsetWidth - 1280) / 2) + 3967 - 20)
    },
    {
        label: '2017 – 2018',
        x: -(((canvas.offsetWidth - 1280) / 2) + 5430 - 20)
    },
    {
        label: 'Наши дни',
        x: -7580 + (canvas.offsetWidth / 2)
    }
]
const controls = [
    [
        [],
        [(-7580 + (canvas.offsetWidth / 2)) / 2, 'Cередина']
    ],
    [
        [0, 'Начало'],
        [-7580 + (canvas.offsetWidth / 2), 'Наши дни']
    ],
    // [
    //     [(-7580 + (canvas.offsetWidth / 2)) / 2, 'Cередина'],
    //     [-7580 + (canvas.offsetWidth / 2), 'Наши дни']
    // ],
    [
        [(-7580 + (canvas.offsetWidth / 2)) / 2, 'Cередина'],
        []
    ]
]

export { events, palette, accRate, graphParams, canvas, stage, dx, dy, mouse, gEvents, rndInt, dotParams, ranges, controls, main};