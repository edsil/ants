"use strict";
import { Ant } from "./ants.js";

const numbOfAnts = 10;
var gridSize = 4; // cell size
const cyclesPerDraw = 55;

const gridColArray = [];
const mouse = { left: false, right: false, x: 0, y: 0 };
const colors = ['white', 'blue', 'red', 'green', 'black'];
const ants = [];
var canvas, ctx;
var h, w;
var timer = 0;
var startTimer = 0;
var frame = 0;
var runs = 0;
var momFPS = 0;
var momFrame = 0;
var cols, rows;

window.onload = function () {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "1px";
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);
    w = window.innerWidth - 5;
    h = window.innerHeight - 5;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    cols = Math.ceil(w / gridSize);
    rows = Math.ceil(h / gridSize);
    addEvents();
    fillGridArr();
    createAnts(numbOfAnts, 0);
    createAnts(numbOfAnts, 1);
    createAnts(numbOfAnts, 2);

    timer = performance.now();
    startTimer = timer;
    requestAnimationFrame(updateDraw);
};

function addEvents() {
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousemove", mouseMove);
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
    gridColArray.length = 0;
    for (var i = 0; i < rows * cols; i += 1) {
        gridColArray.push(0);
    }
};

function createAnts(number, type) {
    for (var i = 0; i < number; i++) {
        const posX = Math.round(Math.random() * (cols - 1));
        const posY = Math.round(Math.random() * (rows - 1));
        const ant = new Ant(posX, posY, type, gridSize, gridColArray, ctx);
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
    ctx.clearRect(0, 0, w, h);
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            const pos = r * cols + c;
            const color = gridColArray[pos];
            if (color != 0) {
                ctx.fillStyle = colors[color];
                ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
            }
        }
    }
    for (var i = 0; i < cyclesPerDraw; i++) {
        runs++;
        for (const ant of ants) {
            ant.move();
        }
    }

    ctx.fillStyle = 'black';
    ctx.font = "15px Arial";
    ctx.fillText("FPS: " + Math.round(1000 * frame / (timer - startTimer)), 10, 20);
    ctx.fillText("Cycles/Sec: " + Math.round(1000 * runs / (timer - startTimer)), 10, 35);
    requestAnimationFrame(updateDraw);
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