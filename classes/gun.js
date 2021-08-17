class Gun extends Moveable {
	constructor(target) {
		super(width / 2, 50);

		this.maxSpeed = 5;

		this.target = target;
	}

	applyForce(force) {
		this.acc.add(force);
		this.update();
	}

	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.draw();
	}

	behaviors() {
		let arrive = this.arrive(this.target);
		this.applyForce(arrive);
	}

	arrive(target) {
		let speed = this.maxSpeed;
		let desired = p5.Vector.sub(target, this.pos);
		let d = desired.mag();
		if (d < 100) {
			speed = map(d, 0, 100, 0, this.maxSpeed);
		}
		desired.setMag(speed);

		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);
		return steer;
	}

	draw() {
		push();
		fill(255);
		ellipse(this.pos.x, this.pos.y, 5);
		pop();
	}
}
