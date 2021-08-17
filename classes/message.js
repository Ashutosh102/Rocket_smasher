class Message extends Moveable {
	constructor(x, y, message, size) {
		super(x, y);
		this.size = size;
		this.message = message;
		this.color = color(200);
		this.alpha = 30;
		this.color.setAlpha(this.alpha);

		this.destroyed = false;
	}

	grow() {
		this.size *= 1.05;
	}

	fadeOut() {
		// console.log();
		this.alpha--;
		this.color.setAlpha(this.alpha);
	}

	shouldDestroy() {
		return this.size > 100;
	}

	destroy() {
		this.fadeOut();

		if (this.alpha <= 0) {
			this.destroyed = true;
			game.removeById('messages', this.id);
		}
	}

	draw() {
		if (this.shouldDestroy() && !this.destroyed) {
			this.destroy();
		}
		push();
		textSize(this.size);
		textFont(font);
		textAlign(CENTER, CENTER);

		fill(this.color);
		stroke(0);
		strokeWeight(2);

		text(this.message, this.pos.x, this.pos.y);
		pop();
	}
}
