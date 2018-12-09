var LightStatus = {};
var LightDistance = {};

LightStatus.Green = function(x) {
	if (x < 0.25) {
		return 1;
	} 
	if (x <= 0.4) {
		return _norm(-6.67 * x + 2.67);
	}
	return 0;
}

LightStatus.LessGreen = function(x) {
	if (x < 0.33) {
		return 0;
	}
	if (x <= 0.417) {
		return _norm(11.5 * x - 3.795);
	}
	if (x <= 0.542) {
		return _norm(-8 * x + 4.336);
	}
	return 0;
}

LightStatus.Yellow = function(x) {
	if (x < 0.458) {
		return 0;
	}
	if (x <= 0.542) {
		return _norm(11.9 * x - 5.45);
	}
	if (x <= 0.708) {
		return _norm(-6 * x + 4.25);
	}
	return 0;
}

LightStatus.Red = function(x) {
	if (x < 0.625) {
		return 0;
	}
	if (x <= 0.67) {
		return _norm(22.22 * x - 13.89);
	}
	if (x <= 0.83) {
		return 1;
	}
	if (x <= 0.9) {
		return _norm(-14.29 * x + 12.86);
	}
	return 0;
}

LightStatus.LessRed = function(x) {
	if (x < 0.83) {
		return 0;
	}
	if (x < 1) {
		return _norm(11.49 * x - 9.54);
	}
	return 1;
}

LightDistance.Near = function(x) {
	if (x < 10) {
		return 1;
	}
	if (x < 40) {
		return _norm(-0.033 * x + 1.33);
	}
	return 0;
}

LightDistance.Medium = function(x) {
	if (x < 10) {
		return 0;
	}
	if (x <= 20) {
		return _norm(0.1 * x - 1);
	}
	if (x <= 50) {
		return 1;
	}
	if (x <= 70) {
		return _norm(-0.05 * x + 3.5);
	}
	return 0;
}

LightDistance.Far = function(x) {
	if (x < 40) {
		return 0;
	}
	if (x <= 70) {
		return _norm(0.033 * x - 1.33);
	}
	return 1;
}
