var CarController = cc.Class.extend({
	setCar: function(car) {
		this._car = car;
	},

	run: function(start, end) {
		var verts = [
			cc.p(0, 40),
			cc.p(60, 80),
			cc.p(180, 0),
			cc.p(200, 100),
			cc.p(300, 200),
			cc.p(400, 100),
			cc.p(550, 150),
			cc.p(800, 0),
		];
		this._car.setPosition(verts[0]);	
		this._car.run(verts);
	},

	onTick: function(dt, direction, distances) {
		if (!distances) {
			this._car.stop();
			cc.log("Car stoped");
			return null;
		}
		// var left = distances.left;
		// var right = distances.right;
		// cc.log("Left", left, "Right", right);

		// return direction;
		return CarAssistant.instance.hintDirection(this._car.getPosition());;
	}
});
