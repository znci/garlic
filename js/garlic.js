
/*
	Keybind Cooldown
*/
var keyState = {};    
window.addEventListener('keydown', (e) => {
  keyState[e.key] = true;
},true);    
window.addEventListener('keyup', (e) => {
  delete keyState[e.key];
},true);

/*
	Variables
*/

var	entities = [];
var controlling = null;

class garlic {
	constructor(canvWidth, canvHeight) {
		// Canvas Setup

		this.canvasWidth = canvWidth;
		this.canvasHeight = canvHeight;
		this.canvasID = "garlic-canvas";
		this.currentFramerate = 0;

		this.canvas = new garlic.canvas(this);
		this.utils = new garlic.utils(this);
		this.entity = new garlic.entity(this);
	}
}

garlic.utils = class {
	constructor(self) {
		this.imageRes = (img) => {
			let image = document.createElement("img");
			image.src = img;
			return [image.naturalWidth, image.naturalHeight]
		}
	}
}

garlic.canvas = class {
	constructor(self) {
		this.canvas = document.querySelector(`#${self.canvasID}`);
		this.ctx = null;
		this.canvasExists = () => {
			if(this.canvas) {
				return true;
			} else {
				return false;
			}
		}
		this.updateCanvasElement = () => {
			this.canvas = document.querySelector(`#${self.canvasID}`);
			this.ctx = this.canvas.getContext("2d");
		}
		this.create = () => {
			if (this.canvas) {
				throw new Error("Canvas already exists");
			} else {
				console.info("Canvas scene created");
				const el = document.createElement("canvas");
				el.id = self.canvasID;
				el.width = self.canvasWidth;
				el.height = self.canvasHeight;
				document.body.appendChild(el);
				this.updateCanvasElement();
			}
		}

		// Drawing

		this.drawRect = (x, y, w, h, color) => {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, w, h);
		}
		this.drawBackground = (color) => {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(0, 0, self.canvasWidth, self.canvasHeight);
		}
		this.drawImage = (img, x, y, w, h) => {
			const image = new Image();
			image.src = img;
			image.onload = (e) => {
				this.ctx.drawImage(image, x, y, w, h);
			}
		}
		this.drawText = (text, x, y, color, font) => {
			this.ctx.fillStyle = color;
			this.ctx.font = font;
			this.ctx.fillText(text, x, y);
		}

		// Events

		this.on = (event, callback) => {
			document.addEventListener(event, callback);
		}

		this.input = (key) => {
			return new Promise((resolve, reject) => {
				this.on("keyup", (e) => {
					if(e.keyCode === key) {
						resolve(true);
					}
				})	
			}).then(data => {
				return data;
			})
		}

		// Mouse

		this.mouse = {
			x: 0,
			y: 0,
			originX: 0,
			originY: 0,
			pressed: false,
			buttons: 0,
			pressedX: 0,
			pressedY: 0,
			released: false,
			releasedX: 0,
			releasedY: 0,
			dragged: false,
			draggedX: 0,
			draggedY: 0,
		};

		this.updateMouse = (e) => {
			this.mouse.x = e.layerX;
			this.mouse.y = e.layerY;
			this.mouse.buttons = e.buttons;
			
			switch (e.buttons) {
				case 1:
					console.log(e);
					this.mouse.pressed = true;
					this.mouse.pressedX = e.layerX;
					this.mouse.pressedY = e.layerY;

					if(e.timestamp)
					this.mouse.originX = e.layerX;
					this.mouse.originY = e.layerY;

					this.mouse.draggedX = e.movementX;
					this.mouse.draggedY = e.movementY;
					break;
				case 0:
					this.mouse.pressed = false;
					this.mouse.released = true;
					this.mouse.releasedX = e.layerX;
					this.mouse.releasedY = e.layerY;
					break;
			}
		}


		this.cursor = (img) => {
			const image = self.utils.imageRes(img);
			if(image[0] > 128 || image[1] > 128) {
				throw new Error("Cursor image size is too large");
			}
			this.canvas.style.cursor = `url(${img}), auto`
		}

		// Rendering

		this.fps = () => {
			let before = Date.now();
			let fps = 0;
			
			function loop() {
				let now = Date.now();
				fps = Math.round(1000 / (now - before));
				before = now;
				requestAnimationFrame(loop)
			}
			loop();

			setInterval(() => {
				self.currentFramerate = fps;
			}, 500);
		}

		this.render = (func) => {
			const fr = 1000 / self.currentFramerate;
			
			document.querySelector(`#${self.canvasID}`).addEventListener("mousemove", (e) => {
				self.canvas.updateMouse(e);
			})

			requestAnimationFrame(
				function loop() {
					func();
					setTimeout(() => {
						requestAnimationFrame(loop)
					}, fr)
				}
			);
			this.fps();
		}

		this.clear = () => {
			this.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
		}
	}
}

garlic.entity = class {
	constructor(self) {
		this.x = 0;
		this.y = 0;
		this.width = 32;
		this.height = 32;
		this.speed = 0.2;
		this.sprite = null;
		this.uuid = Math.random().toString(36).substring(2);

		entities.push(this);

		this.draw = () => {
			if(!this.sprite) {
				self.canvas.drawRect(this.x, this.y, this.width, this.height, "#fff");
			}
		}

		this.destroy = () => {
			entities.splice(entities.indexOf(this), 1);
		}

		this.move = (x, y) => {
			this.x = x;
			this.y = y;
		}

		this.moveRelative = (x, y) => {
			this.x += x;
			this.y += y;
		}

		this.moveTowards = (x, y) => {
			if(this.x < x) {
				this.x += this.speed;
			}
			if(this.x > x) {
				this.x -= this.speed;
			}
			if(this.y < y) {
				this.y += this.speed;
			}
			if(this.y > y) {
				this.y -= this.speed;
			}
		}

	}
}