var Line = cc.Class.extend({
	ctor: function(P1, P2) {
		this.P1 = P1;
		this.P2 = P2;
	},

	distance: function(P) {
		return cc.distanceToLine(P, this.P1, this.P2);
	}
});

var Route = cc.Class.extend({
	isPointInside: function(P) {},
	distanceToBorders: function(position, vDirection) {},
	direction: function(position) {}
});

var CurveRoute = Route.extend({
	ctor: function(center, P1, P2) {
		this._center = center;
		this._v1 = cc.v(center, P1);
		this._v2 = cc.v(center, P2);
		this._r = cc.distance(center, P1);
		this._vPP = cc.v(P1, P2);
		this.computeAngles();
		this.createTrafficLight();
	},

	computeAngles: function() {
		this._angle = cc.angleOf2Vectors(this._v1, this._v2);
		this._startAngle = cc.angleOfVector(this._v1);
		if (this._angle >= 0) {
			this._lowBound = this._startAngle;
			this._highBound = this._startAngle + this._angle;
		} else {
			this._highBound = this._startAngle;
			this._lowBound = this._startAngle + this._angle;
		}
		var vMid = cc.p(
			this._v1.x + this._v2.x,
			this._v1.y + this._v2.y
		);
		var lenMid = cc.len(vMid);
		vMid.x = vMid.x * this._r / lenMid;
		vMid.y = vMid.y * this._r / lenMid;
		this._M = cc.p(
			this._center.x + vMid.x,
			this._center.y + vMid.y
		);
	},

	isPointInside: function(P) {
		var vCP = cc.v(this._center, P);
		var angle = cc.angleOfVector(vCP);
		if (!this.angleIsInside(angle, this._lowBound, this._highBound)) {
			return false;
		}
		var CP = cc.len(vCP);
		return (
			CP >= this._r - Values.laneWidth 
			&& CP <= this._r + Values.laneWidth
		);
	},

	angleIsInside: function(angle, start, end) {
		if (angle > end) {
			angle -= 2 * Math.PI;
		}
		if (angle < start) {
			angle += 2 * Math.PI;
		}
		if (angle > end || angle < start) {
			return false;
		}
		return true;
	},

	distanceToBorders: function(position, vDirection) {
		vDirection = vDirection || this._vPP;
		var vPC = cc.v(position, this._center);
		var PC = cc.len(vPC);
		var smallDistance = PC - this._r + Values.laneWidth;
		var bigDistance = 2 * Values.laneWidth - smallDistance;
		if (vDirection.x * vPC.y - vDirection.y * vPC.x < 0) {
			// Right is small
			return {
				right: smallDistance,
				left: bigDistance
			}
		} else {
			// Left is small
			return {
				right: bigDistance,
				left: smallDistance
			}
		}
	},

	direction: function(position) {
		var vCP = cc.v(this._center, position);
		var vDir = cc.p(vCP.y, -vCP.x);
		var CP = cc.len(vCP);
		vDir.x /= CP;
		vDir.y /= CP;

		if (cc.dot(this._vPP, vDir) < 0) {
			vDir.x *= -1;
			vDir.y *= -1;
		}
		return vDir;
	},

	createTrafficLight: function() {
		this._trafficLight = new TrafficLight();
		this._trafficLight.retain();
		this._trafficLight.setPosition(this._M);
	},

	middle: function() {
		return this._M;
	},

	trafficLight: function() {
		return this._trafficLight;
	}
});

var StraightRoute = Route.extend({
	ctor: function(startP, endP) {
		this._baseLine = new Line(startP, endP);
		this.computeBorders();
		this.computeDirection();
	},

	computeBorders: function() {
		var P1 = this._baseLine.P1;
		var P2 = this._baseLine.P2;

		var v = cc.v(P1, P2);
		var n = cc.p(v.y, -v.x);
		var len = cc.len(n);
		
		// calculate transform vector
		n.x = n.x / len * Values.laneWidth;
		n.y = n.y / len * Values.laneWidth;

		var P1_1 = cc.movePoint(P1, n);
		var P2_1 = cc.movePoint(P2, n);

		var P1_2 = cc.movePoint(P1, n, -1);
		var P2_2 = cc.movePoint(P2, n, -1);

		this._border1 = new Line(P1_1, P2_1);
		this._border2 = new Line(P1_2, P2_2);
		this._v = v;
	},

	computeDirection: function() {
		var direction = cc.v(this._baseLine.P1, this._baseLine.P2);
		var len = cc.len(direction);
		direction.x /= len;
		direction.y /= len;
		this._direction = direction;
	},

	borders: function(vDirection) {
		vDirection = vDirection || this._v;
		if (cc.dot(vDirection, this._v) >= 0) {
			return {
				right: this._border1,
				left: this._border2
			}
		} else {
			return {
				right: this._border2,
				left: this._border1
			}
		}
	},

	isPointInside: function(P) {
		var vAP = cc.v(this._baseLine.P1, P);
		var vBP = cc.v(this._baseLine.P2, P);
		var vAB = cc.v(this._baseLine.P1, this._baseLine.P2);
		var vBA = cc.p(-1  * vAB.x, -1 * vAB.y);
		if (cc.dot(vAP, vAB) < 0 || cc.dot(vBP, vBA) < 0) {
			return false;
		}
		return this._baseLine.distance(P) <= Values.laneWidth;
	},

	distanceToBorders: function(position, vDirection) {
		var borders = this.borders(vDirection);
		return {
			left: borders.left.distance(position),
			right: borders.right.distance(position)
		}
	},

	direction: function(position) {
		return this._direction;
	}
});
