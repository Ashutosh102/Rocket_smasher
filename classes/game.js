class Game {
	constructor() {
		this.rockets = [];
		this.mines = [];
		this.stars = [];
		this.scoreTips = [];
		this.missTips = [];
		this.bombs = [];
		this.asteroids = [];

		this.started = false;
		this.increased = false;

		this.limit = 1;

		this.population = 7530000000;

		this.missLimit = 5;
		this.hits = 0;
		this.total = 0;

		this.mineLimit = 10000;
		this.bombLimit = this.mineLimit * 2;

		this.player = new Player();

		this.messages = [];

		this.rocketCooldown = 0;
	}

	generateStars() {
		console.log('generate stars');
		for (let i = 0; i < 100; i++) {
			this.stars.push(new Star(random(0, windowWidth), random(0, windowHeight), random(1, 2), random(3, 5), 5));
		}
	}

	getMisses() {
		return this.total - this.hits;
	}

	isGameOver() {
		// return this.getMisses() >= this.missLimit;
		return this.population <= 0;
	}

	decreasePopulation() {
		// kill 1billion people for each rocket
		this.population -= 1000000000;
		bg = 'red';
		setTimeout(() => {
			bg = 'black';
		}, 250);
	}

	increasePopulation() {
		// earth's daily net population increase
		this.population += 225000;
	}

	increaseLimit() {
		this.limit++;
		this.increased = true;
	}

	mouseExplode() {
		this.rockets.forEach((rocket) => {
			if (rocket.intersectsMouse()) {
				this.explode(rocket);
			}
		});

		this.asteroids.forEach((asteroid) => {
			if (asteroid.intersectsMouse()) {
				// this.explode(rocket);
				asteroid.hit();
			}
		});
	}

	explode(rocket) {
		if (!rocket.exploded) {
			rocket.explode();
			this.hits += 1;
		}
	}

	setTotal(val) {
		this.total = val;
	}

	removeById(property, id) {
		const idx = this[property].findIndex((item) => item.id === id);
		delete this[property][idx];
		this[property] = this[property].filter((item) => item);

		// this[property] = this[property].filter((item) => item.id != id);
	}

	addScoreTip(scoreTip) {
		game.scoreTips.push(scoreTip);
	}

	addMine(x, y) {
		this.mines.push(new GravityMine(x, y));
		this.player.inventory.mines--;
	}

	addBomb() {
		this.bombs.push(new Bomb());
		this.player.inventory.bombs--;
	}

	addMessage(message) {
		this.messages.push(new Message(width / 2, height / 2, message, 24));
	}

	generaterocket() {
		if (this.rockets.length < this.limit && !this.rocketCooldown) {
			const x = random(width * 0.2, width - width * 0.2);
			const y = height;

			const rocket = new Rocket(x, y, 15 / this.limit + 15);

			this.rockets.push(rocket);

			this.rocketCooldown = 25;
		}
		return;
	}

	generateAsteroid() {
		if (this.asteroids.length < 1) {
			const x = random(width * 0.2, width - width * 0.2);
			const y = height;

			const asteroid = new Asteroid(x, y, random(10, 12));

			this.asteroids.push(asteroid);
		}
		return;
	}

	render() {
		this.rocketCooldown = this.rocketCooldown ? this.rocketCooldown - 1 : 0;

		this.increasePopulation();

		if (followRocket) {
			followRocket = null;
		}

		this.messages.forEach((message, i) => {
			if (i === 0) {
				message.draw();
				if (!message.shouldDestroy() && !message.destroyed) {
					message.grow();
				}
			}
		});

		this.scoreTips.forEach((tip) => {
			tip.applyForce(gravity);
			tip.update();
			tip.draw();
		});

		this.missTips.forEach((tip) => {
			tip.applyForce(gravity);
			tip.update();
			tip.draw();
		});

		this.stars.forEach((star) => {
			star.draw();
		});

		canvas.canvas.getContext('2d').drawImage(earth, -25, -50, earth.width, earth.height);

		if (this.total % 10 === 0 && this.total && !this.increased) {
			this.increaseLimit();
			this.generateAsteroid();
		} else {
			// if (!this.rockets.length) setTimeout(() => this.generaterocket(), random(0, 5000));

			this.asteroids.forEach((asteroid) => {
				this.mines.forEach((mine) => {
					const fwDistToMine = dist(asteroid.pos.x, asteroid.pos.y, mine.pos.x, mine.pos.y);
					if (fwDistToMine < mine.waveRadius) {
						const target = createVector(mine.pos.x, mine.pos.y);
						const seek = asteroid.seek(target);
						asteroid.applyForce(seek);
						asteroid.update();

						if (asteroid.intersectsTarget(mine)) {
							mine.decreaseHealth();
							let times = asteroid.health;
							for (let i = 1; i <= times; i++) {
								asteroid.hit();
							}
						}
					}
					mine.draw();
				});

				this.bombs.forEach((bomb) => {
					bomb.draw();

					if (asteroid.intersectsTarget(bomb)) {
						let times = asteroid.health;
						for (let i = 1; i <= times; i++) {
							asteroid.hit();
						}
					}
				});

				const force = createVector(0, random(0, -0.01));
				asteroid.applyForce(force);
				asteroid.update();
				asteroid.draw();

				asteroid.particles.forEach((particle) => {
					particle.applyForce(gravity);
					particle.update();
					particle.draw();
				});
			});

			this.generaterocket();

			this.rockets.forEach((rocket) => {
				this.mines.forEach((mine) => {
					const fwDistToMine = dist(rocket.pos.x, rocket.pos.y, mine.pos.x, mine.pos.y);
					if (fwDistToMine < mine.waveRadius) {
						const target = createVector(mine.pos.x, mine.pos.y);
						const seek = rocket.seek(target);
						rocket.applyForce(seek);
						rocket.update();

						if (rocket.intersectsTarget(mine)) {
							if (!rocket.exploded) {
								mine.decreaseHealth();
								// console.log('decrease');
							}
							this.explode(rocket);
						}
					}
					mine.draw();
				});

				this.bombs.forEach((bomb) => {
					bomb.draw();

					if (rocket.intersectsTarget(bomb)) {
						this.explode(rocket);
					}
				});

				const force = createVector(0, random(0, -0.05));
				rocket.applyForce(force);
				rocket.update();

				if (!rocket.exploded) {
					rocket.draw();
				} else {
					rocket.particles.forEach((particle) => {
						particle.applyForce(gravity);
						particle.update();
						particle.draw();
					});
				}
			});
		}
	}
}
