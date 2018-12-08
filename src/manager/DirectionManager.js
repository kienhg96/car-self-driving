var DirectionManager = {};

function _norm(v) {
	if (v < 0) {
		return 0;
	}
	if (v > 1) {
		return 1;
	}
	return v;
}

DirectionManager.FarLeft = function(x) {
	if (x < 0.25) {
		return 1;
	}
	if (x <= 0.4) {
		return _norm(-6.67 * x + 2.67);
	}
	return 0;
}

DirectionManager.Left = function(x) {
	if (x < 0.25) {
		return 0;
	}
	if (x <= 0.4) {
		return _norm(6.67 * x - 1.67);
	}
	if (x <= 0.5) {
		return _norm(-10 * x + 5);
	}
	return 0;
}

DirectionManager.Middle = function(x) {
	if (x < 0.4) {
		return 0;
	}
	if (x <= 0.5) {
		return _norm(10 * x - 4);
	}
	if (x <= 0.6) {
		return _norm(-10 * x + 6);
	}
	return 0;
}

DirectionManager.Right = function(x) {
	if (x < 0.5) {
		return 0;
	}
	if (x <= 0.6) {
		return _norm(10 * x - 5);
	}
	if (x < 0.75) {
		return _norm(-6.67 * x + 5);
	}
	return 0;
}

DirectionManager.FarRight = function(x) {
	if (x < 0.6) {
		return 0;
	}
	if (x < 0.75) {
		return _norm(6.67 * x - 4);
	}
	return 1;
}
