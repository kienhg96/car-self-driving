var MapLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		this.renderBackground();
		this.renderDrawNode();
		this.renderCar();
		this.setScale(2.0);
	},

	onEnter: function() {
		this._super();
		// this.renderSample();
		this.initEvents();
		var self = this;
		var mapHeight = this._bg.height;
		// Edit nodes position
		CarController.instance.setCar(Car.instance);
		CarController.instance.nodes().forEach(function(node, index) {
			node.y = mapHeight - node.y;
			self.drawDot(node);
			self.drawText(index.toString(), cc.p(node.x, node.y + 10));
		});
		CarController.instance.run();
		this.showRoundBorders();
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
			// this.addChild(route.trafficLight());
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

	renderSample: function() {
		var traffic = new TrafficLight();
		this.addChild(traffic);
		traffic.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
	}
});
