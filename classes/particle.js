class Particle extends Rocket {
	constructor(x, y, radius, inheritedColor, groupId) {
		super(x, y, radius || 5);
		this.inheritedColor = inheritedColor;
		this.color = null;

		this.groupId = groupId || null;
	}
	decay() {
		this.radius *= 0.97;
	}

	shouldInherit() {
		return random() < 0.9;
	}

	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);

		if (this.radius > 0) {
			this.decay();
		}
	}

	draw() {
		if (!this.color) {
			this.color = this.inheritedColor
				? this.shouldInherit() ? this.inheritedColor : getRandomColor()
				: getRandomColor();
		}
		const { x, y } = this.pos;
		push();
		noStroke();
		fill(this.color);
		ellipse(x, y, this.radius);
		pop();
	}
}
