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
        this.overheadHeight = 10;
        this.ctx = ctx;
        this.alive = true;

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
                } else {
                    _this.dragxstart = clickx - _this.x;
                    _this.dragystart = clicky - _this.y;
                    _this.dragging = true;

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

                console.log("dragging");
                _this.x = clickx - _this.dragxstart;
                _this.y = clicky - _this.dragystart;

                _this.draw(_this.ctx);
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

    clicked(x, y) {
        console.log(x + ',' + y);
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
        if (this.alive) {
            this.ctx.translate(0.5, 0.5);

            //draws menu bar and content box respectivly
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.strokeRect(this.x, this.y - this.overheadHeight, this.w, this.h + 10); // menu
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y - 3);
            this.ctx.lineTo(this.x + this.w - 10, this.y - 3);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y - 7);
            this.ctx.lineTo(this.x + this.w - 10, this.y - 7);
            this.ctx.stroke();
            this.ctx.strokeRect(this.x, this.y, this.w, this.h); // content

            // draws x in upper right
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.w - 10, this.y);
            this.ctx.lineTo(this.x + this.w, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w - 10, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w, this.y);
            this.ctx.lineTo(this.x + this.w - 10, this.y - this.overheadHeight);
            this.ctx.lineTo(this.x + this.w - 10, this.y);
            this.ctx.stroke();

            this.ctx.translate(-0.5, -0.5);

            if (!this.focused) {
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 1);
                this.ctx.globalAlpha = 1.0;
            }
        }
    }
}