function setup() {
	canvas.generate();
	game.start();


	frameRate(4);
}

function draw() {
	background("pink");

	drawSprites();

	game.step();
}