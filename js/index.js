const game = new garlic(800, 900);

const canvas = game.canvas;
const player = game.entity;
function render() {
	canvas.create();
}

function draw() {

	canvas.clear();

	canvas.drawBackground("#ffbff3");
	canvas.drawText(`${game.currentFramerate} fps`, 0, 32, "#777", "16px monospace");
	canvas.cursor("/img/crosshair_invert.png");
	canvas.drawRect(player.x, player.y, player.width, player.height, "#fff");

	for (const key in keyState) {
		switch (key) {
			case "w":
				player.y -= player.speed;
				break;
			case "a":
				player.x -= player.speed;
				break;
			case "s":
				player.y += player.speed;
				break;
			case "d":
				player.x += player.speed;
				break;

			case "-":
				player.speed -= 0.1;
				break;
			case "=":
				player.speed += 0.1;
				break;
			
		}
	}

	canvas.canvas.addEventListener("click", (e) => {
		console.log(e);
	});
}
render();

canvas.render(draw);