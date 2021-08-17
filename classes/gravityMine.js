class GravityMine extends Moveable {
	constructor(x, y) {
		super(x, y);
		this.waves = [];
		// this.radius = 20;
		this.radius = windowWidth * 0.033;

		this.waveRadius = this.radius * 5;

		this.health = 3;
		this.color;
		this.alpha = 100;
	}

	draw() {
		this.setColor();
		this.gravityWaves();
		push();

		fill(255);
		ellipse(this.pos.x, this.pos.y, this.radius);
		fill(50);
		ellipse(this.pos.x, this.pos.y, this.radius * 0.66);

		pop();

		this.showHealth();
	}

	setColor() {
		switch (this.health) {
			case 3:
				this.color = 'green';
				break;
			case 2:
				this.color = 'orange';
				break;
			case 1:
				this.color = 'red';
				break;
			default:
				this.color = 'white';
				break;
		}
		this.pulse();
	}

	pulse() {
		if (this.alpha) {
			this.alpha--;
		} else {
			this.alpha = 100;
		}
	}

	gravityWaves() {
		push();
		const c = color(this.color);
		c.setAlpha(this.alpha);
		fill(c);
		ellipse(this.pos.x, this.pos.y, this.waveRadius);
		pop();
	}

	showHealth() {
		push();
		textFont(font);
		textSize(12);
		textAlign(CENTER);
		fill(255);
		stroke(0);
		strokeWeight(1);
		text(this.health, this.pos.x, this.pos.y + 4);
		pop();
	}

	decreaseHealth() {
		this.health--;
		// console.log(this.health);
		if (this.shouldDie()) {
			game.removeById('mines', this.id);
		}
	}

	shouldDie() {
		return this.health <= 0;
	}
}

 class GravityWave extends Moveable {
 	constructor(x, y) {
 		super(x, y);

 		this.originalPos = createVector(x, y);

		this.radius = 2;
 	}

 	draw() {
 		push();
 		stroke(255);
 		ellipse(this.pos.x, this.pos.y, this.radius);
 		pop();
 	}

 	shouldReset(mine) {
 		return this.intersectsTarget(mine);
 	}
 }
