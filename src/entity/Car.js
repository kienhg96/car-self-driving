var BASE_SPEED = 50;
var LIGHT_STATUS = ['RED', 'YELLO', 'GREEN'];

var Car = cc.Sprite.extend({
	ctor: function() {
		this._super(res.car);
		this.setScale(0.5);
	},

	run: function(verts) {
		var position = this.getPosition();
		CarAssistant.instance.buildRoutes(verts);
		this._direction = CarAssistant.instance.init(position);
		this._speed = BASE_SPEED;
		this.scheduleUpdate();
	},

	update: function(dt) {
		var position = this.getPosition();
		var distances = CarAssistant.instance.distance(position, this._direction);
		var nextTrafficLight = CarAssistant.instance.nextTrafficLight();
		var trafficLight = {};
		if (nextTrafficLight) {
			trafficLight.distance = cc.distance(position, nextTrafficLight.getPosition());
			trafficLight.time = nextTrafficLight.remainTime();
			trafficLight.light = LIGHT_STATUS[nextTrafficLight.status()];
		} else {
			trafficLight.distance = 10000;
			trafficLight.time = 10000;
			trafficLight.light = LIGHT_STATUS[2];
		}
		var rock = this._rocks[0];
		let currentDistance, distance;
		if (rock) {
			currentDistance = cc.distance(position, rock.position);
			for (let i = 1; i < this._rocks.length; i++) {
				distance = cc.distance(position, this._rocks[i].position);
				if (distance < currentDistance) {
					currentDistance = distance;
					rock = this._rocks[i];
				}
			}
		}
		var result = CarController.instance.onTick(
			dt, this._direction, this._speed, distances, trafficLight, 
			rock && rock.side, currentDistance);
		if (!result) {
			return;
		}
		this._direction = result.direction;
		this._speed = result.speed;
		var angle = cc.angleOfVector(this._direction);
		this.setRotation(-angle * 180 / Math.PI);

		this.x += this._speed * dt * this._direction.x;
		this.y += this._speed * dt * this._direction.y;
	},

	stop: function() {
		this.unscheduleUpdate();
	},

	setRocks: function(rocks) {
		this._rocks = rocks;
	},
});
