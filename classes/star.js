class Star {
	constructor(x, y, radius1, radius2, npoints) {
		this.x = x;
		this.y = y;
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.npoints = npoints;
	}

	draw() {
		push();
		fill('white');
		var angle = TWO_PI / this.npoints;
		var halfAngle = angle / 2.0;
		beginShape();
		for (var a = 0; a < TWO_PI; a += angle) {
			var sx = this.x + cos(a) * this.radius2;
			var sy = this.y + sin(a) * this.radius2;
			vertex(sx, sy);
			sx = this.x + cos(a + halfAngle) * this.radius1;
			sy = this.y + sin(a + halfAngle) * this.radius1;
			vertex(sx, sy);
		}
		endShape(CLOSE);
		pop();
	}
}
