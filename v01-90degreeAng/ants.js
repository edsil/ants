"use strict";
export { Ant };
const colors = ['white', 'blue', 'red', 'green', 'black'];
const types = [
    { move: { 0: -90, 1: 90, 2: 180 }, change: { 0: 1, 1: 0, 3: 0, 2: 4, 4: 0 } },
    { move: { 0: 90, 2: -90, 3: 180 }, change: { 0: 2, 2: 0, 1: 0, 3: 4, 4: 0 } },
    { move: { 0: -90, 3: 90, 1: 180 }, change: { 0: 3, 3: 0, 2: 0, 1: 4, 4: 0 } }];

class Ant {
    constructor(posX, posY, type, gridSize, gridColArray, ctx) {
        this.posX = posX;
        this.posY = posY;
        this.type = types[type];
        this.gridSize = gridSize;
        this.gridColArray = gridColArray;
        this.ctx = ctx;

        this.w = this.ctx.canvas.width;
        this.h = this.ctx.canvas.height;
        this.vx = 0; //vx, vy - can be -1, 0 or 1
        this.vy = 1;
        this.cols = Math.ceil(this.w / this.gridSize);
        this.rows = Math.ceil(this.h / this.gridSize);
        this.cycles = 0;
    }

    updateSize(gridSize = false) {
        if (gridSize != false) this.gridSize = gridSize;
        this.w = this.ctx.canvas.width;
        this.h = this.ctx.canvas.height;
        this.cols = Math.ceil(this.w / this.gridSize);
        this.rows = Math.ceil(this.h / this.gridSize);
    }

    turn(angle) {
        if (angle == 90 || angle == -270) {
            [this.vx, this.vy] = [-this.vy, this.vx];
            return 0;
        }
        if (angle == 180 || angle == -180) {
            [this.vx, this.vy] = [-this.vx, -this.vy];
            return 0;
        }
        if (angle == 270 || angle == -90) {
            [this.vx, this.vy] = [this.vy, -this.vx];
            return 0;
        }
        return 1;
    }

    move() {
        this.cycles += 1;
        const pos = this.posY * this.cols + this.posX;
        const currColor = this.gridColArray[pos];
        if (this.type.change[currColor] !== undefined) {
            this.gridColArray[pos] = this.type.change[currColor];
        }
        if (this.type.move[currColor] !== undefined) {
            this.turn(this.type.move[currColor]);
        }
        this.posY += this.vy;
        if (this.posY < 0) this.posY = this.rows - 1;
        if (this.posY >= this.rows) this.posY = 0;
        this.posX += this.vx;
        if (this.posX < 0) this.posX = this.cols - 1;
        if (this.posX >= this.cols) this.posX = 0;
    }
}