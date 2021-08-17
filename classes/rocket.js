class Rocket extends Moveable {
	constructor(x, y, radius) {
		super(x, y);
		draw = draw || true;

		this.id = random();
		this.radius = radius;

		this.rocketWidth = this.radius / 2;
		this.rocketHeight = this.radius * 2;

		this.exploded = false;
		this.particles = [];

		this.pos = createVector(x, y);
		this.acc = createVector();
		this.vel = createVector(0, -0.1);

		this.accentColor = getRandomColor();

		this.score = 1000;

		this.draw();
	}

	intersectsMouse() {
		let intersectingX = false,
			intersectingY = false;
		const { x, y } = this.pos;
		const left = x - 10;
		const right = x + this.rocketWidth + 10;
		const top = y - this.rocketHeight / 2;
		const bottom = y + this.rocketHeight + 10;
		if (mouseX > left && mouseX < right) {
			intersectingX = true;
		}
		if (mouseY > top && mouseY < bottom) {
			intersectingY = true;
		}
		return intersectingX && intersectingY;
	}

	draw() {
		const { x, y } = this.pos;

		this.score = round(this.score * 0.995);

		const theta = this.rotation();

		push();
		translate(this.pos.x, this.pos.y);
		rotate(theta);
		rocketRenderer(0, 0, this.rocketWidth, this.rocketHeight, this.accentColor);

		tailRenderer(0, 0, this.rocketWidth, this.rocketHeight);
		pop();

		// push();
		// rotate(rotation);
		// rocketRenderer(x, y, this.rocketWidth, this.rocketHeight, this.accentColor);

		// tailRenderer(x, y, this.rocketWidth, this.rocketHeight);
		// pop();
	}

	update() {
		if (this.exploded && this.isFinished()) {
			// console.log('finished');
			game.removeById('rockets', this.id);
		} else if (this.hitEarth()) {
			// console.log('explode');
			this.explode();
		} else {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}
	}

	isFinished() {
		return min(this.particles.map((p) => p.radius)) < 1;
	}

	// applyForce(force) {
	// 	this.acc.add(force);
	// }

	hitEarth() {
		const yMax = height + 1;
		// const yMin = random(25, height / 4); //random in top quarter of screen
		const yMin = 75;
		const xMin = 25;
		const xMax = width - 25;
		return !this.exploded && (this.pos.y >= yMax || this.pos.y <= yMin || this.pos.x < xMin || this.pos.x > xMax);
	}

	explode() {
		if (!this.hitEarth()) {
			game.player.updateScore(this.score);
		} else {
			game.decreasePopulation();
		}

		this.exploded = true;

		game.total++;

		shownStage = false;

		game.increased = false;

		const { x, y } = this.pos;
		while (this.particles.length < 100) {
			const particle = new Particle(x, y, 5, this.accentColor);
			const force = createVector(random(-1, 1), random(-1, 0.25));
			force.setMag(random(1, 6));
			particle.applyForce(force);
			this.particles.push(particle);
			setTimeout(() => {
				particle.acc.mult(0);
				particle.vel.mult(0);
			}, 250);
		}
		this.explosionSound();
	}

	explosionSound() {
		if (lastExplosionSound === 1) {
			const explosion = document.getElementById('explosion2');
			explosion.play();
			lastExplosionSound = 2;
		} else {
			const explosion = document.getElementById('explosion1');
			// console.log(explosion);
			explosion.play();
			lastExplosionSound = 1;
		}
	}
}
