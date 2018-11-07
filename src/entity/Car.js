var Car = cc.Sprite.extend({
	ctor: function() {
		this._super(res.car);
	},

	run: function(verts) {
		var position = this.getPosition();
		CarAssistant.instance.buildRoutes(verts);
		this._direction = CarAssistant.instance.init(position);
		this._speed = 1;
		this.scheduleUpdate();
	},

	update: function(dt) {
		var position = this.getPosition();
		var distances = CarAssistant.instance.distance(position, this._direction);
		var result = CarController.instance.onTick(dt, this._direction, this._speed, distances);
		if (!result) {
			return;
		}
		this._direction = result.direction;
		this._speed = result.speed;
		var angle = cc.angleOfVector(this._direction);
		this.setRotation(-angle * 180 / Math.PI);

		this.x += this._speed * Values.carBaseSpeed * dt * this._direction.x;
		this.y += this._speed * Values.carBaseSpeed * dt * this._direction.y;
	},

	stop: function() {
		this.unscheduleUpdate();
	}
});
