const game = new garlic(800, 900);

const canvas = game.canvas;
const player = game.player;
function render() {
	canvas.create();
}
function draw() {

	canvas.clear();

	canvas.drawBackground("#ffbff3");

	canvas.drawText(`FPS: ${game.currentFramerate}`, 0, 32, "#fff", "32px monospace")

	canvas.cursor("/img/crosshair_invert.png");

}
render();

canvas.render(draw);