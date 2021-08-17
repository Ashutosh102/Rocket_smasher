mousePressed = (evt) => {
	evt.preventDefault();

	if (game.started) {
		if (game.isGameOver()) {
			if (mouseIntersectsGui(width / 2 - 100, width / 2 + 100, height - 100, height)) {
				reset();
			}
		} else {
			if (evt.button === 2) {
				if (game.player.inventory.mines) {
					game.addMine(mouseX, mouseY);
				}
			} else {
				game.mouseExplode();
			}
		}
	} else {
		if (mouseIntersectsGui(25, 75, height - 75, height - 25)) {
			const helpBody = document.getElementById('help');
			helpBody.scrollIntoView({ behavior: 'smooth' });
		}
		if (mouseIntersectsGui(width / 2 - 100, width / 2 + 100, height - 100, height - 15)) {
			game.started = true;
		}
	}
};

keyPressed = (evt) => {
	const { key } = evt;
	if (key === ' ') {
		evt.preventDefault();
		if (game.player.inventory.bombs) {
			game.addBomb();
		}
	}
	if (key === 'i') {
		evt.preventDefault();
		game.player.inventoryFollowsMouse = !game.player.inventoryFollowsMouse;
	}
};

const mouseIntersectsGui = (xMin, xMax, yMin, yMax) => {
	if (mouseX > xMin) {
		if (mouseX < xMax) {
			if (mouseY > yMin) {
				if (mouseY < yMax) {
					return true;
				}
			}
		}
	}
	return false;
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	earth = new Image(windowWidth + 50, 125);
	earth.src = './assets/earth.png';

	game.stars = [];
	game.generateStars();
}
