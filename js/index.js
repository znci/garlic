const game = new garlic(800, 900);

const canvas = game.canvas;
const player = game.entity;
function render() {
	canvas.create();
}

function draw() {

	canvas.clear();

	canvas.drawBackground("#ffbff3");
	canvas.drawText(`FPS: ${game.currentFramerate}`, 0, 32, "#fff", "32px monospace");
	canvas.cursor("/img/crosshair_invert.png");
	canvas.drawRect(player.x, player.y, player.width, player.height, "#fff");

	player.move(canvas.mouse.x, canvas.mouse.y);

}
render();

canvas.render(draw);