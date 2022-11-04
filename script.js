"use strict";
import { Ant } from "./ants.js";

const numbOfAnts = 1;
var gridSize = 1; // cell size
var cyclesPerDraw = 9000;
const goalFPS = 12;

const gridCol0 = [];
const gridCol1 = [];
const gridHues = [];
const gridSats = [];
const gridLums = [];
const gridHSL = [gridHues, gridSats, gridLums];
const gridColArray = [gridCol0, gridCol1];
const mouse = { left: false, right: false, x: 0, y: 0 };
const hsls = [{ h: 0, s: 100, l: 100 }, { h: 73, s: 50, l: 50 }, { h: 104, s: 50, l: 50 }, { h: 151, s: 50, l: 50 }, { h: 218, s: 50, l: 0 }, { h: 277, s: 50, l: 50 }, { h: 318, s: 50, l: 50 }, { h: 341, s: 50, l: 50 }, { h: 359, s: 0, l: 0 }];

const ants = [];
var canvas, ctx; var h, w;
var timer = 0;
var startTimer = 0;
var multi100CyclesTimer = 0;
var frame = 0;
var runs = 0;
var momFPS = 0;
var momFrame = 0;
var cols, rows;
var toReset = 0;

window.onload = function () {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "1px";
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);
    w = Math.floor(window.innerWidth / gridSize) * gridSize;
    h = Math.floor(window.innerHeight / gridSize) * gridSize;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    cols = Math.ceil(w / gridSize);
    rows = Math.ceil(h / gridSize);
    addEvents();
    fillGridArr();
    createAnts(numbOfAnts, 0, 0, 1);
    createAnts(numbOfAnts, 1, 0, -1);
    createAnts(numbOfAnts, 2, 1, 0);
    //createAnts(numbOfAnts, 3, -1, 0);
    //createAnts(numbOfAnts, 4, 0, 1);
    //createAnts(numbOfAnts, 5, 0, -1);
    //createAnts(numbOfAnts, 6, 1, 0);
    //createAnts(numbOfAnts, 7, -1, 0);

    timer = performance.now();
    startTimer = timer;
    requestAnimationFrame(updateDraw);
};

function addEvents() {
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousemove", mouseMove);
    window.addEventListener("keyup", keydown);
    window.addEventListener('resize', () => {
        w = window.innerWidth - 5;
        h = window.innerHeight - 5;
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        cols = Math.ceil(w / gridSize);
        rows = Math.ceil(h / gridSize);
        for (const ant of ants) {
            ant.updateSize(gridSize);
        }
    });
}

function fillGridArr() {
    gridColArray[0].length = 0;
    for (var i = 0; i < rows * cols; i += 1) {
        gridColArray[0].push(0);
        gridColArray[1].push(0);
        gridHues.push(0);
        gridSats.push(100);
        gridLums.push(100);
    }
};

function createAnts(number, type, vx = 0, vy = 1) {
    for (var i = 0; i < number; i++) {
        const posY = Math.floor((i + 1 / 2) * (rows + 1) / number);
        const posX = Math.floor((type + 1 / 2) * (cols + 1) / 8);
        const ant = new Ant(posX, posY, type, gridSize, gridColArray, ctx, vx, vy, gridHSL);
        ants.push(ant);
    }
}

function trim(value, min, max) {
    if (value <= min) return min;
    if (value >= max) return max;
    return value;
}


function updateDraw(ts) {
    frame += 1;
    timer = performance.now();
    if (frame % 30 == 0) {
        momFPS = Math.round(1000 * (frame - momFrame) / (timer - multi100CyclesTimer));
        momFrame = frame;
        multi100CyclesTimer = timer;
        cyclesPerDraw = Math.max(1, cyclesPerDraw * (momFPS / goalFPS));
    }
    /* / **************************************
    const pos = frame % gridColArray[0].length;
    const rt = Math.floor(pos / cols);
    const ct = pos - r * cols;
    ctx.fillStyle = "hsl(" + Math.round(gridHues[pos]) + ", " + Math.round(gridSats[pos]) + "%, " + Math.round(gridLums[pos]) + "%)";
    ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
    gridColArray[1][pos] = gridColArray[0][pos];
    // ************************************* */

    if (true) { //if (frame % 1000 == 0) {
        //ctx.clearRect(0, 0, w, h);
        //for (var r = 0; r < rows; r++) {
        var r = Math.round(Math.random() * rows);
        for (var c = 0; c < cols; c++) {
            const pos = r * cols + c;

            //const color = gridColArray[0][pos];
            //ctx.fillStyle = colors[color];
            ctx.fillStyle = "hsl(" + Math.round(gridHues[pos]) + ", " + Math.round(gridSats[pos]) + "%, " + Math.round(gridLums[pos]) + "%)";
            ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
            //gridColArray[1][pos] = gridColArray[0][pos];
        }
        // }
    }


    //ctx.clearRect(0, 0, w, h);
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            const pos = r * cols + c;
            const color = gridColArray[0][pos];
            if (gridColArray[1][pos] != color) {
                //ctx.fillStyle = colors[color];
                ctx.fillStyle = "hsl(" + Math.round(gridHues[pos]) + ", " + Math.round(gridSats[pos]) + "%, " + Math.round(gridLums[pos]) + "%)";
                ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
                gridColArray[1][pos] = color;
            }
        }
    }
    if (toReset > 0) {
        for (const ant of ants) {
            if (ant.typeN == (toReset - 1)) {
                ant.reset();
            }
        }
        toReset = false;
    }
    for (var i = 0; i < cyclesPerDraw; i++) {
        runs++;
        for (const ant of ants) {
            ant.move();
        }
    }
    ctx.clearRect(9, 5, 180, 70);
    ctx.fillStyle = 'black';
    ctx.font = "15px Arial";
    var timeSec = (timer - startTimer) / 1000;
    var fps = frame / timeSec;
    ctx.fillText("FPS: " + Math.round(fps) + " / " + momFPS, 10, 20);
    ctx.fillText("Cycles/Sec: " + Math.round(runs / timeSec), 10, 35);
    ctx.fillText("Cycles/Frame: " + Math.round(cyclesPerDraw), 10, 50);
    ctx.fillText("Seconds: " + Math.round(timeSec), 10, 65);
    requestAnimationFrame(updateDraw);
}

function keydown(e) {
    if (e.code == "Digit1") toReset = 1;
    if (e.code == "Digit2") toReset = 2;
    if (e.code == "Digit3") toReset = 3;
    if (e.code == "Digit4") toReset = 4;
    if (e.code == "Digit5") toReset = 5;
    if (e.code == "Digit6") toReset = 6;
    if (e.code == "Digit7") toReset = 7;
    if (e.code == "Digit8") toReset = 8;
    if (e.code == "Digit0") {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                const pos = r * cols + c;
                const color = gridColArray[0][pos];
                gridHues[pos] = hsls[color].h;
                gridSats[pos] = hsls[color].s;
                gridLums[pos] = hsls[color].l;
                ctx.fillStyle = "hsl(" + Math.round(gridHues[pos]) + ", " + Math.round(gridSats[pos]) + "%, " + Math.round(gridLums[pos]) + "%)";
                ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
                gridColArray[1][pos] = color;
            }
        }
    };


}

function mouseDown(event) {
    updateMousePos(event);
    mouse.left = event.button === 0 ? true : mouse.left;
    mouse.right = event.button === 2 ? true : mouse.right;
}

function mouseUp(event) {
    updateMousePos(event);
    mouse.left = event.button === 0 ? false : mouse.left;
    mouse.right = event.button === 2 ? false : mouse.right;
}

function mouseMove(event) {
    event.preventDefault();
    updateMousePos(event);
}

function updateMousePos(event) {
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
}