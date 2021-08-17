class FollowRocket extends Moveable {
	constructor() {
		super(random(0, width), random(0, height));
	}

	draw() {
		this.renderRocket();
	}

	renderRocket() {
		var theta = this.vel.heading() + radians(90);

		push();
		translate(this.pos.x, this.pos.y);
		rotate(theta);
		rocketRenderer(0, 0, 5, 20, getRandomColor());
		tailRenderer(0, 0, 5, 20);
		pop();
	}
}
