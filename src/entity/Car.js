var Car = cc.Sprite.extend({
	ctor: function() {
		this._super(res.car);
		this._direction = cc.p(1, 0);
	},

	onEnter: function() {
		this._super();
		this.scheduleUpdate();
	},

	update: function(dt) {
		var position = this.getPosition();
		
		// CarController.instance.onTick(dt, this._direction, )
	}
});
