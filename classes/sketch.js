let game;
let canvas;

let followRocket;

let gravity;
let earth;
let img;
let missedRed = false;

let lastExplosionSound;

let font = 'Staatliches';

let shownStage = false;

let galaxyShapes = [];

let bg = 'black';

fr = 0;

preload = () => {
	earth = new Image(windowWidth + 50, 125);
	earth.src = './assets/earth.png';
};

setup = () => {
	canvas = createCanvas(windowWidth, windowHeight);
	gravity = createVector(0, 0.1);

	game = new Game();
	game.generateStars();

	followRocket = new FollowRocket();

	const helpBody = document.getElementById('help');
	helpBody.style.display = 'flex';
};

reset = () => {
	delete game;

	game = new Game();
	game.generateStars();

	followRocket = new FollowRocket();
	shownStage = false;
	loop();
};

draw = () => {
	if (game) {
		if (game.started) {
			if (!game.isGameOver()) {
				background(color(bg));

				galaxyRenderer();

				game.render();

				showEarthStats();
				showScore();
				showInventory();

				showSpecs();
			} else {
				showGameOver();
			}
		} else {
			showStartScreen();
		}
	} else {
		showStartScreen();
	}
};

const getRandomColor = () => {
	return color(random(50, 255), random(50, 255), random(100, 255));
};

const rocketSeeksMouse = () => {
	let seek;
	if (mouseX < width && mouseX > 0 && mouseY > 0 && mouseY < height) {
		const mouse = createVector(mouseX, mouseY);
		seek = followRocket.arrive(mouse);
	} else {
		const center = createVector(width / 2, height / 2 - 100);
		seek = followRocket.arrive(center);
	}
	followRocket.applyForce(seek);
	followRocket.update();
	followRocket.draw();
};
