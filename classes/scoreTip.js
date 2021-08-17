class ScoreTip extends Moveable {
	constructor(x, y, score, type) {
		super(x, y);
		// this.pos = createVector(x, y);
		this.vel = createVector(0, -2);
		// this.acc = createVector();

		this.lifespan = 50;

		this.color = score > 600 ? '0,255,0' : score > 400 ? '255,255,0' : '255,0,0';

		this.score = score;

		this.id = random();

		this.type = type;
	}

	// applyForce(force) {
	// 	this.acc.add(force);
	// }

	// update() {
	// 	this.vel.add(this.acc);
	// 	this.pos.add(this.vel);
	// 	this.acc.mult(0);
	// }

	draw() {
		const ls = map(this.lifespan, 0, 50, 0, 100, true);

		if (this.lifespan > 0) {
			push();
			fill(`rgba(${this.color},${ls / 100})`);

			textFont(font);
			textSize(14);

			stroke(0);

			textAlign(CENTER);
			text(`${this.score}`, this.pos.x, this.pos.y);
			pop();
			this.lifespan--;
		} else {
			if (this.type === 'score') {
				game.removeById('scoreTips', this.id);
				// game.scoreTips = game.scoreTips.filter((s) => s.id !== this.id);
			} else {
				game.removeById('missTips', this.id);
			}
		}
	}
}
