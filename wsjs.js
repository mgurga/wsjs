class wsjs {

    constructor(x, y, w, h, c, ctx) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.canvas = c;
        this.focused = false;
        this.dragging = false;
        this.dragxstart = 0;
        this.dragystart = 0;
        this.minimizeData = {
            "minimized": false,
            "minimizing": false,
            "x": 0,
            "y": 0
        };
        this.windowTab = {
            "created": false,
            "name": "tabName",
            "x": Number.MAX_SAFE_INTEGER,
            "y": Number.MAX_SAFE_INTEGER,
            "w": 0,
            "h": 0
        }
        this.overheadHeight = 20;
        this.overheadOptionsWidth = this.overheadHeight * 2;
        this.ctx = ctx;
        this.alive = true;
        this.windowName = "Window";
        this.windowOptions = "minimize,close"; //not in use TODO
        this.elements = [];
        this.primaryColor = "#55FF55";
        this.backgroundColor = "#0000FF"

        //enable clicking
        var _this = this;

        this.canvas.addEventListener('mousedown', function(e) {
            var clickx = Math.round(getMousePos(_this.canvas, e).x);
            var clicky = Math.round(getMousePos(_this.canvas, e).y);

            if (clickx > _this.x + _this.w - _this.overheadHeight && clickx < _this.x + _this.w &&
                clicky > _this.y - _this.overheadHeight && clicky < _this.y) {
                _this.destroy();

            }

            if (clickx > _this.x + _this.w - (_this.overheadHeight * 2) && clickx < _this.x + _this.w - (_this.overheadHeight * 1) &&
                clicky < _this.y && clicky > _this.y - _this.overheadHeight) {
                console.log("minimizing");
                _this.minimize();

            }

            if (clickx > _this.windowTab.x && clickx < _this.windowTab.x + _this.windowTab.w &&
                clicky > _this.windowTab.y && clicky < _this.windowTab.y + _this.windowTab.h) {
                //console.log("tab clicked");
                _this.focused = true;
                _this.draw();
                if (_this.minimizeData.minimized) {
                    _this.unminimize();
                }
            }

            if (clickx > _this.x && clickx < _this.x + _this.w - _this.overheadOptionsWidth && clicky > _this.y - _this.overheadHeight && clicky < _this.y) {
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
                //console.log('clicked');
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

    createElement(elementData) {
        if (elementData.id == undefined) {
            console.warn("The element you just created does not have an 'id', the element is still visible but you will not be able to edit or delete it");
        }
        if (elementData.type == "button") {
            elementData.clicked = false;
        }
        this.elements[this.elements.length] = elementData;
    }

    editElement(id, property, newValue) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id) {
                this.elements[i][property] = newValue;
            }
        }
    }

    deleteElement(id) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id) {
                splice(i, 1);
            }
        }
    }

    setWindowTab(x, y, w, h, name) {
        this.windowTab.x = x;
        this.windowTab.y = y;
        this.windowTab.w = w;
        this.windowTab.h = h;
        this.windowTab.name = name;
        this.windowTab.created = true;
    }

    clicked(x, y) {
        console.log("clicked: " + (x - this.x) + ',' + (y - this.y));
        //relx and rely are the mouseclicks reletive to the window, not full canvas
        var relx = (x - this.x);
        var rely = (y - this.y);

        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].type == "button") {
                var eleData = this.elements[i];
                if (eleData.x < relx && eleData.x + eleData.w > relx &&
                    eleData.y < rely && eleData.y + eleData.h > rely) {
                    eval(eleData.onclick);
                    this.elements[i].clicked = true;
                }
            }
        }
    }

    drawWindowFrame() {
        this.fillStyle = "#000000";
        this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 2);

        this.strokeStyle = this.primaryColor;
        this.ctx.strokeRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 2);

        this.ctx.strokeRect(this.x, this.y, this.w, this.h);

    }

    destroy() {
        //draw black box over window
        this.ctx.fillRect(this.x - 10, this.y - this.overheadHeight - 10, this.w + 20, this.h + this.overheadHeight + 20);

        //dont draw it again
        this.alive = false;
        this.x = Number.MAX_SAFE_INTEGER;
        this.y = Number.MAX_SAFE_INTEGER;
        this.w = 0;
        this.h = 0;

        this.windowTab.created = false;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.windowTab.x - 10, this.windowTab.y - 10, this.windowTab.w + 20, this.windowTab.h + 10);
        this.draw();
    }

    minimize() {
        this.minimizeData.x = this.x;
        this.minimizeData.y = this.y;
        this.minimizeData.minimizing = true;

        var speed = 1;
        var _this = this;
        var animationInterval = setInterval(function() {
            if (_this.y < _this.canvas.height + _this.h) {
                _this.y += speed;
                console.log("falling");
                _this.ctx.fillStyle = "#000000";
                _this.ctx.drawImage(_this.canvas, _this.x - 10, _this.y - _this.overheadHeight - speed - 10, _this.w + 20, _this.h + 20, _this.x - 10, _this.y - _this.overheadHeight - 10, _this.w + 20, _this.h + speed);
                _this.ctx.fillRect(_this.x - 10, _this.y - _this.overheadHeight - speed - 10, _this.w + 20, speed + 10);
                speed += speed / 2;
            } else {
                window.clearInterval(animationInterval);
                _this.minimizeData.minimizing = false;
                _this.minimizeData.minimized = true;
            }
        }, 50);
    }

    unminimize() {
        //this.x = this.minimizeData.x;
        //this.y = this.minimizeData.y;
        this.y = -this.h;

        var speed = 1;
        var _this = this;
        var animationInterval = setInterval(function() {
            if (_this.y < _this.minimizeData.y) {
                _this.y += speed;
                console.log("unminimizing");
                _this.ctx.fillStyle = "#000000";
                _this.ctx.drawImage(_this.canvas, _this.x - 10, _this.y - _this.overheadHeight - speed - 10, _this.w + 20, _this.h + 20, _this.x - 10, _this.y - _this.overheadHeight - 10, _this.w + 20, _this.h + speed);
                _this.ctx.fillRect(_this.x - 10, _this.y - _this.overheadHeight - speed - 10, _this.w + 20, speed + 10);
                speed += speed / 2;
            } else {
                window.clearInterval(animationInterval);

                _this.ctx.fillStyle = "#000000";
                _this.ctx.fillRect(_this.x - 10, _this.y, _this.w + 20, _this.h + speed);

                _this.x = _this.minimizeData.x;
                _this.y = _this.minimizeData.y;
                _this.minimizeData.minimized = false;
            }
        }, 50);
    }

    drawShadedRect(x, y, w, h, lines) {
        //console.log(lines);
        //draws over it with black rect to prevent overdraw
        var prevFillStyle = this.ctx.fillStyle;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x, y, w, h);

        //draw edge
        this.ctx.strokeRect(x, y, w, h);

        //calcualte number of lines if "lines" in not defined
        var numOfLines = 0;
        if (isNaN(lines)) {
            numOfLines = h / 5;
        } else {
            numOfLines = lines;
        }

        //draw lines
        for (var i = 0; i < numOfLines; i++) {
            this.ctx.beginPath();
            //console.log(y + (i * (numOfLines / h)));
            //y is the height divided by number of lines times the
            //current line draw number and plus the starting y
            this.ctx.moveTo(x, y + (i * (h / numOfLines)));
            this.ctx.lineTo(x + w, y + (i * (h / numOfLines)));
            this.ctx.stroke();
        }

        this.ctx.fillStyle = prevFillStyle;
    }

    drawContent() {
        //MAIN LOOP THAT GOES THROUGH ELEMENTS
        //dispatches elemets to appropriate functions
        for (var i = 0; i < this.elements.length; i++) {
            var eleData = this.elements[i];
            if (eleData.type == "button") {
                //button type
                drawButtonFromElement(this, eleData);
                this.elements[i].clicked = false;
            }
            if (eleData.type == "label") {
                drawLabelFromElement(this, eleData);
            }
        }

        function drawLabelFromElement(_this, eleData) {
            //DRAW TEXT LABELS
            //willDraw determines wether you draw the button or not
            var willDraw = true;

            if (_this.x > _this.x + eleData.x) { // checks far left
                willDraw = false;
            }

            if (_this.y > _this.y + eleData.y) { // checks far above
                willDraw = false;
            }

            if (willDraw) {
                _this.ctx.fillStyle = _this.primaryColor;

                if (!eleData.textAlign == undefined) {
                    _this.ctx.textAlign = "start";
                }

                if (eleData.font == undefined) {
                    _this.ctx.font = "20px Monospace";
                } else {
                    _this.ctx.font = eleData.font;
                }
                _this.ctx.fillText(eleData.text, eleData.x + _this.x, eleData.y + _this.y);
            }
        }

        function drawButtonFromElement(_this, eleData) {
            //DRAW BUTTON
            //willDraw determines wether you draw the button or not
            var willDraw = true;
            //console.log(eleData);
            //console.log(_this);

            if (_this.x > _this.x + eleData.x) { // checks far left
                willDraw = false;
            }

            if (_this.y > _this.y + eleData.y) { // checks far above
                willDraw = false;
            }

            if (_this.x + _this.w < _this.x + eleData.x + eleData.w) { // checks far right
                willDraw = false;
            }

            if (_this.y + _this.h < _this.y + eleData.y + eleData.h) { //checks far down
                willDraw = false;
            }

            if (willDraw) {
                _this.ctx.fillStyle = "#000000";
                _this.ctx.strokeStyle = _this.primaryColor;
                if (eleData.clicked == true) {
                    //draw both shaded and stroked on top of eachother to simulate a button being clicked
                    _this.drawShadedRect(_this.x + eleData.x + 5, _this.y + eleData.y + 5, eleData.w, eleData.h);
                    _this.ctx.fillRect(_this.x + eleData.x + 5, _this.y + eleData.y + 5, eleData.w, eleData.h);
                    _this.ctx.strokeRect(_this.x + eleData.x + 5, _this.y + eleData.y + 5, eleData.w, eleData.h);
                } else {
                    //default shaded rect offset by 5 to imitate a shadow
                    _this.drawShadedRect(_this.x + eleData.x + 5, _this.y + eleData.y + 5, eleData.w, eleData.h);
                    _this.ctx.fillRect(_this.x + eleData.x, _this.y + eleData.y, eleData.w, eleData.h);
                    _this.ctx.strokeRect(_this.x + eleData.x, _this.y + eleData.y, eleData.w, eleData.h);
                }
            }
        }
    }

    draw() {

        if (this.alive && !this.dragging && !this.minimizeData.minimizing) {

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
            this.ctx.fillStyle = this.primaryColor;

            this.ctx.textAlign = "start";
            this.ctx.fillText(this.windowName, this.x, this.y, this.w - this.overheadHeight * 2);
            this.ctx.fillStyle = "#000000";
            this.ctx.strokeStyle = this.primaryColor;
            this.ctx.strokeRect(this.x, this.y - this.overheadHeight, this.w, this.h + this.overheadHeight); // menu

            // lines between name and options
            var lineEnd = this.x + this.w - this.overheadOptionsWidth;
            if (startingX < lineEnd) {
                //console.log("start: " + startingX + " to: " + lineEnd);
                var numOfLines = this.overheadHeight / 5;
                for (var i = 0; i < numOfLines; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(startingX, this.y - (i * this.overheadHeight / numOfLines));
                    this.ctx.lineTo(lineEnd, this.y - (i * this.overheadHeight / numOfLines));
                    this.ctx.stroke();
                }
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

            // draws _ in upper right
            var rightSpaces = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.w - this.overheadHeight * rightSpaces, this.y);
            this.ctx.lineTo(this.x + this.w - this.overheadHeight * rightSpaces, this.y - this.overheadHeight);
            this.ctx.moveTo(this.x + this.w - this.overheadHeight * rightSpaces + 1, this.y);
            this.ctx.lineTo(this.x + this.w - this.overheadHeight * rightSpaces + 1, this.y - this.overheadHeight);
            this.ctx.moveTo(this.x + this.w - this.overheadHeight * rightSpaces + (this.overheadOptionsWidth / rightSpaces) / 3, this.y - this.overheadHeight / 3);
            this.ctx.lineTo(this.x + this.w - this.overheadHeight * rightSpaces + ((this.overheadOptionsWidth / rightSpaces) / 3) * 2, this.y - this.overheadHeight / 3);
            this.ctx.stroke();

            this.ctx.translate(xTrans * -1, yTrans * -1);

            if (!this.focused) {
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(this.x, this.y - this.overheadHeight, this.w + 1, this.h + this.overheadHeight + 1);
                this.ctx.globalAlpha = 1.0;
            }
        }

        if (this.alive && !this.dragging) {
            this.drawContent();
        }

        if (this.windowTab.created && this.alive) {
            //DRAWS TAB
            var boxStrokeBackground = this.primaryColor;
            var boxFillBackground = "#000000";
            var tabNameColor = this.primaryColor;

            if (this.minimizeData.minimized) {
                boxStrokeBackground = "#000000"
                boxFillBackground = this.primaryColor;
                tabNameColor = "#000000";
            }

            this.ctx.fillStyle = boxFillBackground;
            this.ctx.fillRect(this.windowTab.x, this.windowTab.y, this.windowTab.w, this.windowTab.h);
            this.ctx.strokeStyle = boxStrokeBackground;
            this.ctx.strokeRect(this.windowTab.x, this.windowTab.y, this.windowTab.w, this.windowTab.h);
            this.ctx.textAlign = "start";
            this.ctx.font = (this.windowTab.h / 3) * 2 + "px Monospace";
            this.ctx.fillStyle = tabNameColor;
            this.ctx.fillText(this.windowTab.name, this.windowTab.x, this.windowTab.y + this.windowTab.h);

        }

        this.ctx.fillStyle = "#000000";
        this.ctx.strokeStyle = this.primaryColor;

    }
}