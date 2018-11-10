class wsjs {

    constructor(x, y, h, w, c, ctx) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.canvas = c;
        this.focused = false;
        this.dragging = false;
        this.dragxstart = 0;
        this.dragystart = 0;
        this.overheadHeight = 20;
        this.overheadOptionsWidth = this.overheadHeight;
        this.ctx = ctx;
        this.alive = true;
        this.windowName = "Window";

        //enable clicking
        var _this = this;

        this.canvas.addEventListener('mousedown', function(e) {
            var clickx = Math.round(getMousePos(_this.canvas, e).x);
            var clicky = Math.round(getMousePos(_this.canvas, e).y);

            if (clickx > _this.x + _this.w - 10 && clickx < _this.x + _this.w &&
                clicky > _this.y - 10 && clicky < _this.y) {
                _this.destroy();

            }

            if (clickx > _this.x && clickx < _this.x + _this.w - 10 && clicky > _this.y - _this.overheadHeight && clicky < _this.y) {
                _this.focused = true;
                if (_this.dragging) {
                    _this.dragging = false;
                    console.log("stopped dragging");
                    _this.draw();

                } else {
                    _this.dragxstart = clickx - _this.x;
                    _this.dragystart = clicky - _this.y;
                    _this.dragging = true;
                    console.log("started dragging");

                }
            }

            if (clickx > _this.x && clickx < _this.x + _this.w && clicky > _this.y && clicky < _this.y + _this.h) {
                console.log('clicked');
                _this.clicked(clickx, clicky);
                _this.focused = true;

            }

            if (clickx < _this.x || clickx > this.x + this.w ||
                clicky < _this.y - _this.overheadHeight || clicky > _this.y + _this.h + this.overheadHeight) {
                _this.focused = false;
            }

        });

        this.canvas.addEventListener('mousemove', function(e) {
            if (_this.dragging) {
                var clickx = Math.round(getMousePos(_this.canvas, e).x);
                var clicky = Math.round(getMousePos(_this.canvas, e).y)

                ctx.fillRect(_this.x - 20, _this.y - _this.overheadHeight - 20, _this.w + 40, _this.h + 50);

                //console.log("dragging");
                _this.x = clickx - _this.dragxstart;
                _this.y = clicky - _this.dragystart;

                _this.drawWindowFrame();
            }
        });

        function getMousePos(canvas, evt) {
            var rect = _this.canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
    }
    // Honestly tho you dont even have it working and it is actually pointless
    clicked(x, y) {
        console.log(x + ',' + y);
    }

    drawWindowFrame() {
        this.fillStyle = "#000000";
        this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 2);

        this.strokeStyle = "#FFFFFF";
        this.ctx.strokeRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 2);

        this.ctx.strokeRect(this.x, this.y, this.w, this.h);

        //console.log("drawing window frame");
    }

    destroy() {
        //draw black box over window
        this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 2);

        //dont draw it again
        this.alive = false;
        this.x = Number.MAX_SAFE_INTEGER;
        this.y = Number.MAX_SAFE_INTEGER;
        this.w = 0;
        this.h = 0;
    }

    draw() {
        if (this.alive && !this.dragging) {

            this.fillStyle = "#000000";
            this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 2);

            var xTrans = 0.5;
            var yTrans = 0.5;

            this.ctx.translate(xTrans, yTrans);

            var fontSize = this.overheadHeight;
            this.ctx.font = fontSize + "px Monospace";
            var startingX = this.x + ctx.measureText(this.windowName).width;
            //console.log(ctx.measureText(this.windowName));
            //draws overlay bar and content box respectivly
            this.ctx.lineWidth = 1;
            this.ctx.fillStyle = "#FFFFFF";

            this.ctx.textAlign = "start";
            this.ctx.fillText(this.windowName, this.x, this.y);
            this.ctx.fillStyle = "#000000";
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.strokeRect(this.x, this.y - this.overheadHeight, this.w, this.h + this.overheadHeight); // menu

            // lines between name and options
            var numOfLines = this.overheadHeight / 5;
            for (var i = 0; i < numOfLines; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(startingX, this.y - (i * this.overheadHeight / numOfLines));
                this.ctx.lineTo(this.x + this.w - this.overheadOptionsWidth, this.y - (i * this.overheadHeight / numOfLines));
                this.ctx.stroke();
            }

            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.w - this.overheadOptionsWidth, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w - this.overheadOptionsWidth, this.y);
            this.ctx.stroke();
            this.ctx.strokeRect(this.x, this.y, this.w, this.h); // content

            // draws x in upper right
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.w - this.overheadHeight, this.y);
            this.ctx.lineTo(this.x + this.w, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w - this.overheadHeight, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w, this.y);
            this.ctx.lineTo(this.x + this.w - this.overheadHeight, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w - this.overheadHeight, this.y);
            this.ctx.stroke();

            this.ctx.translate(xTrans * -1, yTrans * -1);

            if (!this.focused) {
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 1);
                this.ctx.globalAlpha = 1.0;
            }
        }
    }
}