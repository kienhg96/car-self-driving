var MapLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		// this.renderBackground();
		this.renderDrawNode();
		this.renderCar();
	},

	onEnter: function() {
		this._super();
		// this.renderSample();
		this.initEvents();
		CarController.instance.setCar(Car.instance);
		CarController.instance.run();
		this.showRoundBorders();
	},

	renderBackground: function() {
		this._bg = new cc.Sprite(res.map);
		this.addChild(this._bg);
	},

	renderCar: function() {
		Car.instance = new Car();
		this.addChild(Car.instance);
	},

	renderDrawNode: function() {
		this._drawNode = new cc.DrawNode();
		// this._drawNode.setScale(1.5);
		this.addChild(this._drawNode);
		// var center = cc.p(
		// 	cc.winSize.width / 2,
		// 	cc.winSize.height / 2
		// );
		// this._drawNode.setPosition(center);
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

	renderSample: function() {
		var verts = [cc.p(0, 40), cc.p(60, 80), cc.p(180, 0), cc.p(200, 100)];
		var routes = CarAssistant.instance.buildRoutes(verts);
		for (var i = 0; i < routes.length; i++) {
			this.drawRoute(routes[i]);
		}
	}
});
