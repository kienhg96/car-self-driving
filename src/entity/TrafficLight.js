var TrafficLight = cc.Sprite.extend({
	ctor: function() {
		this._super(res.light_red);
		this.randomStatus();
		this.renderTimeNumber();
		this._time.setFontFillColor(cc.color.RED);
	},

	onEnter: function() {
		this._super();
		this.setStatus(this._status);
		this.scheduleUpdate();
	},

	randomStatus: function() {
		var status = Math.round(Math.random() * 10) % 3;
		var time = 0;
		if (status === TrafficLight.RED) {
			time = Math.random() * 20;
		} else if (status === TrafficLight.YELLOW) {
			time = Math.random() * 3;
		} else {
			time = Math.random() * 15;
		}
		this._remainTime = time;
		this._status = status;
	},

	renderTimeNumber: function() {
		this._time = new cc.LabelTTF("0", 'Arial', 16);
		var contentSize = this.getContentSize();
		this._time.setPosition(contentSize.width / 2, contentSize.height + 10);
		this.addChild(this._time);
		this._time.setFontFillColor(cc.color.GREEN);
	},

	setStatus: function(status) {
		this._status = status;
		switch (status) {
			case TrafficLight.RED:
				this.setTexture(res.light_red);
				this._time.setFontFillColor(cc.color.RED);
				break;
			case TrafficLight.YELLOW:
				this.setTexture(res.light_yellow);
				this._time.setFontFillColor(cc.color.YELLOW);
				break;
			case TrafficLight.GREEN:
				this.setTexture(res.light_green);
				this._time.setFontFillColor(cc.color.GREEN);
				break;
			default:
				this.setTexture(res.light_red);
				this._time.setFontFillColor(cc.color.RED);
				this._status = TrafficLight.RED;
		}
	},

	update: function(dt) {
		this._remainTime -= dt;
		if (this._remainTime < 0) {
			this.changeStatus();
		}
		this._time.setString(Math.floor(this._remainTime));
	},

	changeStatus: function() {
		if (this._status === TrafficLight.RED) {
			this.setStatus(TrafficLight.GREEN);
			this._remainTime += 15;
		} else if (this._status === TrafficLight.YELLOW) {
			this.setStatus(TrafficLight.RED);
			this._remainTime += 20;
		} else {
			this.setStatus(TrafficLight.YELLOW);
			this._remainTime += 3;
		}
	},

	remainTime: function() {
		return this._remainTime;
	},

	status: function() {
		return this._status;
	}
});

TrafficLight.RED = 0;
TrafficLight.YELLOW = 1;
TrafficLight.GREEN = 2;
