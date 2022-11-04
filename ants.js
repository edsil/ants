"use strict";
export { Ant };
const a0 = 90;
const a1 = -90;
const a2 = 90;
const hsls = [{ h: 0, s: 50, l: 100 }, { h: 73, s: 50, l: 50 }, { h: 104, s: 50, l: 50 }, { h: 151, s: 50, l: 50 }, { h: 218, s: 50, l: 0 }, { h: 277, s: 50, l: 50 }, { h: 318, s: 50, l: 50 }, { h: 341, s: 50, l: 50 }, { h: 359, s: 50, l: 0 }];
const types = [
    { move: { 0: a0, 1: a1, 2: a2, 3: a2, 4: a2, 5: a2, 6: a2, 7: a2, 8: a2 }, change: { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a1, 3: a2, 4: a2, 5: a2, 6: a2, 7: a2, 8: a2 }, change: { 0: 2, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a2, 3: a1, 4: a2, 5: a2, 6: a2, 7: a2, 8: a2 }, change: { 0: 3, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a2, 3: a2, 4: a1, 5: a2, 6: a2, 7: a2, 8: a2 }, change: { 0: 4, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a2, 3: a2, 4: a2, 5: a1, 6: a2, 7: a2, 8: a2 }, change: { 0: 5, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a2, 3: a2, 4: a2, 5: a2, 6: a1, 7: a2, 8: a2 }, change: { 0: 6, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a2, 3: a2, 4: a2, 5: a2, 6: a2, 7: a1, 8: a2 }, change: { 0: 7, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } },
    { move: { 0: a0, 1: a2, 2: a2, 3: a2, 4: a2, 5: a2, 6: a2, 7: a2, 8: a1 }, change: { 0: 8, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 } }
];

class Ant {
    constructor(posX, posY, type, gridSize, gridColArray, ctx, vx = 0, vy = 1, gridHSL) {
        this.posX = posX;
        this.posY = posY;
        this.type = types[type];
        this.gridSize = gridSize;
        this.gridColArray = gridColArray;
        this.ctx = ctx;
        this.gridHSL = gridHSL;

        this.iniX = posX;
        this.iniY = posY;
        this.typeN = type;
        this.w = this.ctx.canvas.width;
        this.h = this.ctx.canvas.height;
        this.vx = vx; //vx, vy - can be -1, 0 or 1
        this.vy = vy;
        this.cols = Math.ceil(this.w / this.gridSize);
        this.rows = Math.ceil(this.h / this.gridSize);
        this.cycles = 0;
        this.stuck = 0;
    }

    updateSize(gridSize = false) {
        if (gridSize != false) this.gridSize = gridSize;
        this.w = this.ctx.canvas.width;
        this.h = this.ctx.canvas.height;
        this.cols = Math.ceil(this.w / this.gridSize);
        this.rows = Math.ceil(this.h / this.gridSize);
    }

    reset() {
        this.posX = this.iniX;
        this.posY = this.iniY;
    }

    turn(angle) {
        if (angle == 0) return 1;
        while (angle > 360) angle -= 360;
        while (angle < 0) angle += 360;
        if (angle % 90 == 0) {
            if (angle == 90) {
                [this.vx, this.vy] = [-this.vy, this.vx];
                return 0;
            }
            if (angle == 180) {
                [this.vx, this.vy] = [-this.vx, -this.vy];
                return 0;
            }
            if (angle == 270) {
                [this.vx, this.vy] = [this.vy, -this.vx];
                return 0;
            }
        } else
            if (angle % 45 == 0) {
                [this.vx, this.vy] = turn45(this.vx, this.vy, angle);
            }
        return 1;

        function turn45(x, y, angle) {
            const mx = x;
            const my = y;
            if (angle == 45) {
                y = (my == 0) ? (mx) : ((mx == -my) ? 0 : my);
                x = (mx == 0) ? (-my) : ((my == mx) ? 0 : mx);
                return [x, y];
            }
            if (angle == 135) {
                y = (my == 0) ? (mx) : ((mx == my) ? 0 : -my);
                x = (mx == 0) ? (-my) : ((mx == -my) ? 0 : -mx);
                return [x, y];
            }
            if (angle == 225) {
                y = (my == 0) ? (-mx) : ((mx == -my) ? 0 : -my);
                x = (mx == 0) ? (my) : ((mx == my) ? 0 : -mx);
                return [x, y];
            }
            if (angle == 315) {
                y = (my == 0) ? (-mx) : ((mx == my) ? 0 : my);
                x = (mx == 0) ? (my) : ((mx == -my) ? 0 : mx);
                return [x, y];
            }
        }
    }

    move() {
        this.cycles += 1;
        const pos = this.posY * this.cols + this.posX;
        const currColor = this.gridColArray[0][pos];
        if (this.type.change[currColor] !== undefined) {
            this.gridColArray[0][pos] = this.type.change[currColor];
        }
        if (this.type.move[currColor] !== undefined) {
            this.turn(this.type.move[currColor]);
        }

        const color2 = this.gridColArray[0][pos];
        /*
        const x1 = Math.cos((this.gridHSL[0][pos] / 180) * Math.PI) * this.gridHSL[1][pos];
        const y1 = Math.sin((this.gridHSL[0][pos] / 180) * Math.PI) * this.gridHSL[1][pos];
        const x2 = Math.cos((hsls[color2].h / 180) * Math.PI) * hsls[color2].s;
        const y2 = Math.sin((hsls[color2].h / 180) * Math.PI) * hsls[color2].s;
        const x = x1 + x2;
        const y = y1 + y2;
        
        const h = (360 + Math.atan2(y, x) * 180 / Math.PI) % 360;
        const s = Math.sqrt(x * x + y * y);
        const l = Math.min(Math.max(this.gridHSL[2][pos], hsls[color2].l), 50);
        */
        const h = (this.gridHSL[0][pos] + hsls[color2].h) / 2;
        const s = (this.gridHSL[1][pos] + hsls[color2].s) / 2;
        const l = Math.min(Math.max(this.gridHSL[2][pos], hsls[color2].l), 50);

        this.gridHSL[0][pos] = h;
        this.gridHSL[1][pos] = s;
        this.gridHSL[2][pos] = l;
        this.posY += this.vy;
        if (this.posY < 0) this.posY = this.rows - 1;
        if (this.posY >= this.rows) this.posY = 0;
        this.posX += this.vx;
        if (this.posX < 0) this.posX = this.cols - 1;
        if (this.posX >= this.cols) this.posX = 0;
    }
}