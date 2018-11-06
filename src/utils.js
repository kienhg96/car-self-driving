cc.v = function(A, B) {
	return cc.p(
		B.x - A.x,
		B.y - A.y
	);
}

cc.distance = function(A, B) {
	return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
}

cc.dot = function(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y;
}

cc.len = function(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y);
}

cc.angle = function(A, B) {
	var v;
	if (!B) {
		v = A;
	} else {
		v = cc.v(A, B);
	}

	return Math.acos(v.x / cc.len(v));
}

cc.movePoint = function(A, v, sign) {
	sign = sign || 1;
	return cc.p(A.x + sign * v.x, A.y + sign * v.y);
}

// Distance from Point P to line AB
cc.distanceToLine = function(P, A, B) {
	var vPA = cc.v(P, A);
	var vPB = cc.v(P, B);
	var PA = cc.len(vPA);
	var PB = cc.len(vPB);
	if (PA === 0 || PB === 0) {
		return 0;
	}
	var AB = cc.distance(A, B);

	var cosP = cc.dot(vPA, vPB) / (PA  * PB);
	var sinP = Math.sqrt(1 - cosP * cosP);
	var d = PA * PB * sinP / AB;
	return d;
}

cc.angleOfVector = function(v) {
	return cc.angleOf2Vectors(cc.p(1, 0), v);
}

cc.angleOf2Vectors = function(v1, v2) {
	var cosA = cc.dot(v1, v2) / (cc.len(v1) * cc.len(v2));
	var angle = Math.acos(cosA);
	if (v1.x * v2.y - v1.y * v2.x < 0) {
		angle *= -1;
	}
	return angle;
}
