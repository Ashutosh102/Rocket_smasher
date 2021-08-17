class Bomb extends Moveable {
	constructor() {
		super(width / 2, 0);
		this.vel = createVector(0, 6);

		this.radius = 2;

		this.color = color('red');
		this.color.setAlpha(150);

		this.history = [];

		const bombSound = document.getElementById('bomb');
		bombSound.play();
	}

	shouldDestroy() {
		return this.radius > width * 2;
	}

	update() {
		if (this.history.findIndex((h) => h.x === this.pos.x && h.y === this.pos.y) < 0) {
			this.history.push({ x: this.pos.x, y: this.pos.y });
		}

		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	grow() {
		this.radius *= 1.25;
		if (this.shouldDestroy()) {
			game.removeById('bombs', this.id);
		}
	}

	stop() {
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
	}

	draw() {
		this.update();
		if (this.pos.y >= height / 2) {
			this.stop();
			this.grow();

			this.explosion();
		} else {
			this.body();
			this.tail();
		}
	}

	explosion() {
		push();
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.radius);
		pop();
	}

	body() {
		push();
		fill(color('red'));
		strokeWeight(0);
		ellipse(this.pos.x, this.pos.y, 5);
		pop();
	}

	tail() {
		this.history.filter((s) => s).forEach((segment) => {
			push();
			fill(color('red'));
			strokeWeight(0);
			ellipse(segment.x, segment.y, 1);
			pop();
		});
	}
}
