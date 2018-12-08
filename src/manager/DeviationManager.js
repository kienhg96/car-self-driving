var DirectionManager = {};
const 
	HARD_LEFT = "HARD_LEFT",
	HARD_RIGHT = "HARD_RIGHT",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	STRAIGHT = "STRAIGHT"
	
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

DirectionManager.Straight = function(x) {
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

DirectionManager.get_dependencies = function(x) {
	const dependencies = []
	const fuzzy_sets_dep_func = [DirectionManager.FarLeft, DirectionManager.Left, DirectionManager.Straight, DirectionManager.Right, DirectionManager.FarRight];
	const fuzzy_sets_name = [HARD_LEFT, LEFT, MIDDLE, RIGHT, HARD_RIGHT]
	for (var i = 0; i < fuzzy_sets_name.length; ++i) {
		const func = fuzzy_sets_dep_func[i];
		const name = fuzzy_sets_name[i];
		if (func(x) > 0) {
			dependencies.push({"type": name, "value": func(x)});
		}
	}
	return dependencies;
}