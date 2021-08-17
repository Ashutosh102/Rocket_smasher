class Asteroid extends Moveable {
	constructor(x, y, radius) {
		super(x, y);

		this.sideDir = x < width / 2 ? random(0, 0.5) : random(-0.5, 0);
		this.vel = createVector(this.sideDir, -0.01);

		this.angle = 0;
		this.spin = random(0.01, 0.05);

		this.color = random(50, 100);

		this.health = 5;
		this.scale = radius;
		this.radius = this.getRadius();

		this.vertices = this.generateVertices();

		this.particles = [];

		this.score = 5000;
	}

	generateVertices() {
		let vertices = [];
		for (let i = 0; i < TWO_PI; i += TWO_PI / 10) {
			const rel = this.radius / 3;
			var sx = random(-rel, rel) + cos(i) * this.radius;
			var sy = random(-rel, rel) + sin(i) * this.radius;
			vertices.push({ x: sx, y: sy });
		}
		return vertices;
	}

	generateParticle() {
		const particle = new Particle(this.pos.x, this.pos.y, 8, color(random(50, 200)), this.health);
		const force = createVector(random(-1, 1), random(-1, 0.25));
		force.setMag(random(1, 6));
		particle.applyForce(force);
		return particle;
	}

	hitEarth() {
		return this.pos.y < 125;
	}

	hit() {
		this.health--;
		this.radius = this.getRadius();
		this.vertices = this.generateVertices();

		if (this.health <= 0) {
			this.destroy();
		}

		for (let i = 0; i < 10; i++) {
			const particle = this.generateParticle();
			this.particles.push(particle);

			setTimeout(() => {
				particle.acc.mult(0);
				particle.vel.mult(0);
			}, 250);
		}

		setTimeout(
			(groupId) => {
				this.particles.forEach((particle, i) => {
					if (particle.groupId === groupId) {
						delete this.particles[i];
					}
				});
				this.particles = this.particles.filter((p) => p);
			},
			1000,
			this.health
		);
	}

	destroy() {
		if (!this.hitEarth()) {
			game.hits++;
			game.player.updateScore(this.score);
		} else {
			game.decreasePopulation();
		}

		this.exploded = true;

		game.total++;

		shownStage = false;

		game.increased = false;

		game.removeById('asteroids', this.id);
	}

	getRadius() {
		let radius = this.scale * this.health;
		radius = radius < 20 ? 20 : radius;
		return radius;
	}

	draw() {
		if (this.hitEarth()) {
			// console.log('explode');
			this.hit();
		}
		this.score = round(this.score * 0.995);
		this.angle += this.spin;
		push();
		fill(this.color);
		noStroke();
		beginShape();
		translate(this.pos.x, this.pos.y);
		rotate(this.angle);
		this.vertices.forEach((v) => {
			vertex(v.x, v.y);
		});

		endShape(CLOSE);
		pop();
	}
}
