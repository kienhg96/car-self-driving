var MapLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		this._lockMap = false;
		this._isRunning = false;
		this._trafficLights = [];
		this.renderBackground();
		this.renderDrawNode();
		this.renderCar();
		// this.setScale(1.5);
		this.renderStartEndPoints();
	},

	onEnter: function() {
		this._super();
		// this.renderSample();
		this.initEvents();
		var self = this;
		var mapHeight = this._bg.height;
		// Edit nodes position
		CarController.instance.setCar(Car.instance);
		var nodes = CarController.instance.nodes();
		nodes.forEach(function(node, index) {
			node.y = mapHeight - node.y;
			self.drawDot(node);
			self.drawText(index.toString(), cc.p(node.x, node.y + 10));
		});
		CarController.instance.edges().forEach(function(edge) {
			self.drawLine(nodes[edge.x], nodes[edge.y]);
		});
		// CarController.instance.run();
		// this.showRoundBorders();
	},

	toggleLockMap: function() {
		if (this._lockMap) {
			this.unscheduleUpdate();
			this._lockMap = false;
		} else {
			this.scheduleUpdate();
			this._lockMap = true;
		}
	},

	centerTo: function(point) {
		var scale = this.getScale();
		this.setPosition((-point.x + cc.winSize.width / 2) * scale, (-point.y + cc.winSize.height / 2) * scale);
	},

	renderBackground: function() {
		this._bg = new cc.Sprite(res.map);
		this._bg.setPosition(this._bg.width / 2, this._bg.height / 2);
		this.addChild(this._bg);
	},

	renderCar: function() {
		Car.instance = new Car();
		this.addChild(Car.instance);
	},

	renderDrawNode: function() {
		this._drawNode = new cc.DrawNode();
		this.addChild(this._drawNode);
	},

	drawDot: function(position, color) {
		this._drawNode.drawDot(position, 2, color || cc.color.RED);
	},

	drawLine: function(f, t, color) {
		this._drawNode.drawSegment(f, t, 1, color || cc.color.BLUE);
	},

	drawSector: function(origin, radius, start_radian, angle_radian, num_of_points, borderColor) {
		var start = cc.p(origin.x + radius, origin.y);
		var angle_step = angle_radian / num_of_points;
		var lstP = null;
		// circle.push(origin);
		for (var i = 0; i < num_of_points; i++) {
			var rads = start_radian + angle_step * i;
			var p = cc.p(
				origin.x + radius * Math.cos(rads),
				origin.y + radius * Math.sin(rads)
			);
			if (lstP !== null) {
				this.drawLine(lstP, p, borderColor);
			}
			lstP = p;
		}
	},

	drawText: function(text, position, color, fontSize) {
		var text = new cc.LabelTTF(text, "Arial", fontSize || 14);
		text.setFontFillColor(color || cc.color.RED);
		text.setPosition(position);
		this.addChild(text);
		return text;
	},

	drawRoute: function(route) {
		if (route instanceof StraightRoute) {
			var borders = route.borders();
			this.drawDot(borders.right.P1);
			this.drawDot(borders.right.P2);
			this.drawLine(borders.right.P1, borders.right.P2, cc.color.RED);

			this.drawDot(borders.left.P1);
			this.drawDot(borders.left.P2);
			this.drawLine(borders.left.P1, borders.left.P2, cc.color.GREEN);

			this.drawLine(route._baseLine.P1, route._baseLine.P2, cc.color.BLUE);
		} else {
			this.drawSector(route._center, route._r, route._startAngle, route._angle, 30, cc.color.BLUE);
			this.drawSector(route._center, route._r + Values.laneWidth, route._startAngle, route._angle, 50, cc.color.WHITE);
			this.drawSector(route._center, route._r - Values.laneWidth, route._startAngle, route._angle, 10, cc.color.WHITE);
			this.drawDot(route._center);
			// Draw Traffic line
			this._trafficLights.push(route.trafficLight());
			this.addChild(route.trafficLight());
		}
	},

	initEvents: function() {
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded
		}, this);
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: this.onKeyPressed,
			onKeyReleased: this.onKeyReleased
		}, this);
	},

	onTouchBegan: function(touch, event) { return true; },
	onTouchMoved: function(touch, event) {
		var delta = touch.getDelta();
		var target = event.getCurrentTarget();
		target.x += delta.x;
		target.y += delta.y;
	},
	onTouchEnded: function(touch, event) {},

	onKeyPressed: function(key, event) {
		var target = event.getCurrentTarget();
		switch (key) {
			case 90:
				target.scale += 0.1;
				break;
			case 88:
				target.scale -= 0.1;
				break;
		}
	},
	onKeyReleased: function(key, event) {},

	showRoundBorders: function() {
		var routes = CarAssistant.instance.routes();
		for (var i = 0; i < routes.length; i++) {
			this.drawRoute(routes[i]);
		}
	},

	toggleMapRoutes: function() {
		this._drawNode.setVisible(!this._drawNode.isVisible());
	},

	clearRoundBorders: function() {
		this._drawNode.clear();
	},

	renderSample: function() {
		var traffic = new TrafficLight();
		this.addChild(traffic);
		traffic.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
	},

	update: function(dt) {
		var position = Car.instance.getPosition();
		this.centerTo(position);
	},

	renderStartEndPoints: function() {
		var start = new FlagPointSprite(res.icon_start);
		var end = new FlagPointSprite(res.icon_end);
		start.setPosition(0, 0);
		end.setPosition(this._bg.width, this._bg.height);
		this.addChild(start);
		this.addChild(end);
		this._startPoint = start;
		this._endPoint = end;
	},

	toggleStart: function() {
		if (this._isRunning) {
			this._isRunning = false;
			this._startPoint.setVisible(true);
			this._endPoint.setVisible(true);
			CarController.instance.stop();
			this.unscheduleUpdate();
			this._trafficLights.forEach(function(light) {
				light.removeFromParent(true);
				light.release();
			});
			this._trafficLights = [];
		} else {
			this._isRunning = true;
			var start = this._startPoint.getPosition();
			var end = this._endPoint.getPosition();
			this._startPoint.setVisible(false);
			this._endPoint.setVisible(false);
			CarController.instance.run(start, end);
		}
	},

	onStop: function() {
		this._isRunning = false;
		this._startPoint.setVisible(true);
		this._endPoint.setVisible(true);
		this._lockMap = false;
		this.unscheduleUpdate();
	}
});
