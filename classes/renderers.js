const rocketRenderer = (x, y, rocketWidth, rocketHeight, accentColor) => {
	let triOriginY = y;
	// nose
	push();
	noStroke();
	triOriginY = y + 3;
	fill(color(accentColor));
	triangle(x, triOriginY, x + rocketWidth / 2, triOriginY - rocketHeight / 2, x + rocketWidth, triOriginY);
	pop();

	// body
	push();
	noStroke();
	fill(color(255));
	rect(x, y, rocketWidth, rocketHeight);
	pop();

	// fins
	push();
	noStroke();
	triOriginY = y + rocketHeight;
	fill(color(accentColor));
	triangle(x, triOriginY, x - rocketWidth / 2, triOriginY, x, triOriginY - rocketHeight / 2);
	triangle(
		x + rocketWidth,
		triOriginY,
		x + rocketWidth + rocketWidth / 2,
		triOriginY,
		x + rocketWidth,
		triOriginY - rocketHeight / 2
	);
	pop();
};

const tailRenderer = (x, y, rocketWidth, rocketHeight) => {
	push();
	const originY = y + rocketHeight;
	fill(color(random([ 'red', 'orange', 'yellow' ])));
	beginShape();
	vertex(x, originY);
	vertex(x - rocketWidth * 1.1, originY + rocketHeight / 4 + random(-1, 5));
	vertex(x + rocketWidth / 4, originY + rocketHeight / 8 + random(-1, 5));
	vertex(x + rocketWidth / 2, originY + rocketHeight / 2 + random(-1, 5));
	vertex(x + 3 * (rocketWidth / 4), originY + rocketHeight / 8 + random(-1, 5));
	vertex(x + rocketWidth + rocketWidth * 1.1, originY + rocketHeight / 4 + random(-1, 5));
	vertex(x + rocketWidth, originY);
	endShape(CLOSE);
	pop();
};

const galaxyRenderer = () => {
	galaxyShapes.forEach((s) => {
		push();

		fill(s.c);
		noStroke();
		ellipse(s.x, s.y, s.rx, s.ry);
		pop();
	});
};

const showSpecs = () => {
	if (frameCount % 60 === 0) {
		fr = round(frameRate());
	}
	push();
	noStroke();
	fill(color('white'));
	textFont(font);
	textAlign(LEFT, CENTER);

	textSize(10);
	text(fr, 5, height - 10);

	// text('rockets: ' + game.rockets.length, 25, height - 50);
	pop();
};

const showEarthStats = () => {
	let { population } = game;

	push();
	stroke(color('white'));
	strokeWeight(2);
	noStroke();
	fill(color(bg));
	textFont(font);
	textAlign(CENTER, CENTER);

	textSize(24);

	const truncatedPop = (population / 1000).toString(); // millions
	const firstChar = population > 1000000000 ? truncatedPop[0] : '0';
	const popString = `${firstChar}.${truncatedPop.substring(1, truncatedPop.length - 3)} Billion`;
	text(`🚶 ${popString}`, width / 2, 25);
	pop();
};

const showInventory = () => {
	let { inventory, inventoryFollowsMouse } = game.player;

	push();
	stroke(0);
	strokeWeight(2);

	fill(255);
	textFont(font);

	textAlign(inventoryFollowsMouse ? CENTER : LEFT);

	if (!inventoryFollowsMouse) {
		textSize(20);
		text(`Inventory`, 10, 25);
	}

	textSize(16);

	let step = 0;
	Object.keys(inventory).forEach((item, i) => {
		const iteration = (i + 1) * 50 - step;
		step += 25;

		const x = inventoryFollowsMouse ? mouseX : 10;
		const y = inventoryFollowsMouse ? mouseY + iteration : iteration;

		let symbol;

		switch (item) {
			case 'mines':
				symbol = `🌌`;
				break;
			case 'bombs':
				symbol = `💣`;
				break;
		}

		text(`${symbol} ${inventory[item].toLocaleString()}`, x, y);
	});

	pop();
};

const showScore = () => {
	let { score, highscore } = game.player;
	let { total, hits, limit } = game;
	const misses = total - hits;

	push();
	stroke(0);
	strokeWeight(2);

	fill(255);

	textFont(font);
	textSize(20);

	textAlign(RIGHT);

	text(`Stage ${limit}`, width - 10, 25);

	textSize(16);
	text(`${hits} 💥`, width - 10, 50);

	fill(color('orange'));
	text(`${misses} ❌`, width - 10, 75);

	fill(255);
	text(`${score.toLocaleString()} ✴️`, width - 10, 100);

	text(`${highscore.toLocaleString()} 🏆`, width - 10, 125);

	pop();
};

const showStageScreen = () => {
	let { limit } = game;
	push();
	background('orange');

	fill(0);

	textFont(font);
	textSize(40);
	textAlign(CENTER, CENTER);
	text(`Stage ${limit}`, width / 2, height / 2);
	pop();

	noLoop();

	setTimeout(() => {
		shownStage = true;
		loop();
	}, 5000);
};

const showGameOver = () => {
	let newHighScore = false;
	if (game.player.highscore < game.player.score) {
		game.player.highscore = game.player.score;
		try {
			localStorage.setItem(game.player.highscoreKey, game.player.highscore);
		} catch (err) {
			// do nothing
		}
		newHighScore = true;
	}

	push();
	background('orange');

	fill(0);

	textFont(font);
	textSize(40);
	textAlign(CENTER, CENTER);
	text(
		`Game Over!
	Score: ${game.player.score.toLocaleString()}
	Highscore: ${game.player.highscore.toLocaleString()}
	${newHighScore ? `New High Score!` : ''}`,
		width / 2,
		height / 2
	);

	fill(0);
	rect(width / 2 - 100, height - 100, 200, 100);

	fill(color('orange'));
	textSize(24);
	text('Try Again', width / 2, height - 50);
	pop();
	noLoop();
};

const showStartScreen = () => {
	push();
	background(0);

	rocketSeeksMouse();

	textFont(font);
	textAlign(CENTER);

	fill(color('orange'));
	textSize(40);
	text('Speed Rockets', width / 2, height / 2);

	fill(color('orange'));
	rect(width / 2 - 100, height - 100, 200, 85);

	fill(0);
	textSize(24);
	text('New Game', width / 2, height - 50);

	fill(color('orange'));
	rect(25, height - 75, 50, 50);

	fill(0);
	textSize(16);
	textAlign(CENTER, CENTER);
	text('Help', 50, height - 50);

	pop();
};
