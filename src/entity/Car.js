var Car = cc.Sprite.extend({
	ctor: function() {
		this._super(res.car);
	},

	run: function(verts) {
		var position = this.getPosition();
		CarAssistant.instance.buildRoutes(verts);
		this._direction = CarAssistant.instance.init(position);
		this.scheduleUpdate();
	},

	update: function(dt) {
		var position = this.getPosition();
		var distances = CarAssistant.instance.distance(position, this._direction);
		this._direction = CarController.instance.onTick(dt, this._direction, distances);
		if (!this._direction) {
			return;
		}
		var angle = cc.angleOfVector(this._direction);
		this.setRotation(-angle * 180 / Math.PI);

		this.x += Values.carBaseSpeed * dt * this._direction.x;
		this.y += Values.carBaseSpeed * dt * this._direction.y;
	},

	stop: function() {
		this.unscheduleUpdate();
	}
});
