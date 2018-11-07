var CarAssistant = cc.Class.extend({
	init: function(position) {
		for (var i = 0; i < this._routes.length; i++) {
			if (this._routes[i].isPointInside(position)) {
				this._currentRoute = this._routes[i];
				this._currentRouteIndex = i;
				// Find initial directions
				return this._currentRoute.direction(position);
			}
		}
		cc.log("WARNING: NO ROUTE DETECTED");
		return cc.p(1, 0);
	},

	distance: function(position, direction) {
		if (this._currentRoute && !this._currentRoute.isPointInside(position)) {
			this._currentRoute = null;
			// Find next
			var nextRoute = this._routes[this._currentRouteIndex + 1];
			if (nextRoute && nextRoute.isPointInside(position)) {
				this._currentRoute = nextRoute;
				this._currentRouteIndex++;
			}
			// Find previous
			if (!this._currentRoute) {
				var prevRoute = this._routes[this._currentRouteIndex - 1];
				if (prevRoute && prevRoute.isPointInside(position)) {
					this._currentRoute = prevRoute;
					this._currentRouteIndex--;
				}
			}
			// Find all
			if (!this._currentRoute) {
				for (var i = 0; i < this._routes.length; i++) {
					if (this._routes[i].isPointInside(position)) {
						this._currentRoute = this._routes[i];
						this._currentRouteIndex = i;
					}
				}
			}
		}
		if (!this._currentRoute) {
			cc.log("WARNING: NO ROUTE DETECTED", JSON.stringify(position));
			return null;
		}
		return this._currentRoute.distanceToBorders(position, direction);
	},

	computeCentroid: function(E, A, F) {
		var vAE = cc.v(A, E);
		var vAF = cc.v(A, F);

		var cosA = cc.dot(vAE, vAF) / (cc.len(vAE) * cc.len(vAF));
		var tanAp2 = Math.sqrt((1 - cosA) / (1 + cosA));

		var d = (4 / 3) * (Values.laneWidth / tanAp2);
		var AE = cc.distance(A, E);
		var AF = cc.distance(A, F);

		var B = cc.p(
			A.x + d * (E.x - A.x) / AE,
			A.y + d * (E.y - A.y) / AE
		);

		var D = cc.p(
			A.x + d * (F.x - A.x) / AF,
			A.y + d * (F.y - A.y) / AF
		);

		var C1, C2;
		if (A.y === B.y) {
			C1 = cc.p(
				B.x,
				B.y + d * tanAp2
			);
			C2 = cc.p(
				B.x,
				B.y - d * tanAp2
			);
		} else {
			var k = (B.x - A.x) / (B.y - A.y);
			var t = Math.sqrt(1 / (1 + k * k));
			C1 = cc.p(
				B.x + d * tanAp2 * t,
				B.y - d * tanAp2 * t * k
			);
			C2 = cc.p(
				B.x - d * tanAp2 * t,
				B.y + d * tanAp2 * t * k
			);
		}

		var vAC = cc.v(A, C1);
		var ccw = (vAC.x * vAE.y - vAE.x * vAC.y) * (vAC.x * vAF.y - vAF.x * vAC.y);
		// cc.log("ccw", ccw);
		var C;
		if (ccw > 0) {
			C = C2;
		} else {
			C = C1;
		}

		// Check the distance 
		var dAE = cc.distanceToLine(C, A, E);
		var dAF = cc.distanceToLine(C, A, F);
		if (Math.abs(dAF - dAE) > 1) {
			if (C === C1) {
				C = C2;
			} else {
				C = C1;
			}
		}

		return {
			C: C,	
			B: B,
			D: D,
		};
	},

	buildRoutes: function(verts) {
		var curveRoutes = [];
		var linePoints = [verts[0]];

		for (var i = 0; i < verts.length - 2; i++) {
			var E = verts[i];
			var A = verts[i + 1];
			var F = verts[i + 2];
			var result = this.computeCentroid(E, A, F);
			linePoints.push(result.B, result.D);
			curveRoutes.push(new CurveRoute(result.C, result.B, result.D));
		}

		linePoints.push(verts[verts.length - 1]);

		var firstPoint = linePoints[0];
		var lastPoint = linePoints[linePoints.length - 1];
		if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
			var E = linePoints[linePoints.length - 2];
			var A = firstPoint;
			var F = linePoints[1];
			var result = this.computeCentroid(E, A, F);
			var curveRoute = new CurveRoute(result.C, result.B, result.D);
			curveRoutes.push(curveRoute);
			linePoints[linePoints.length - 1] = result.B;
			linePoints[0] = result.D;
		}

		var routes = [];
		for (var i = 0; i < linePoints.length; i += 2) {
			var route = new StraightRoute(linePoints[i], linePoints[i + 1]);
			routes.push(route);
			if (curveRoutes.length > 0) {
				var curveRoute = curveRoutes.shift();
				// cc.log("cuver", JSON.stringify(curveRoute));
				routes.push(curveRoute);
			}
		}

		this._routes = routes;

		return routes;
	},

	routes: function() {
		return this._routes;
	},

	hintDirection: function(position) {
		return this._currentRoute.direction(position);
	}
});
