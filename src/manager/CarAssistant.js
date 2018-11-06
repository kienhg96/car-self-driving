var CarAssistant = cc.Class.extend({
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

		// Check distance from A to C and C to B
		var BC = cc.distance(B, C1);
		var AC = cc.distance(A, C1);
		var C;
		if (AC > BC) {
			C = C1;
		} else {
			C = C2;
		}
		// C.B = B;
		// C.D = D;
		// C.r = BC;
		// C.d = d;

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

		var routes = [];
		for (var i = 0; i < linePoints.length; i += 2) {
			var route = new StraightRoute(linePoints[i], linePoints[i + 1]);
			routes.push(route);
			if (curveRoutes.length > 0) {
				routes.push(curveRoutes.shift());
			}
		}

		return routes;
	}
});
