var fuzzylogic = require('fuzzylogic'); 

var SteeringManager = {};
const 
	HARD_LEFT = "HARD_LEFT",
	HARD_RIGHT = "HARD_RIGHT",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	STRAIGHT = "STRAIGHT"

SteeringManager.HardLeft = function(x) {
	return fuzzylogic.trapezoid(x, 0, 0, 0.25, 0.4);
}

SteeringManager.Left = function(x) {
	return fuzzylogic.triangle(x, 0.25, 0.4, 0.5);
}

SteeringManager.Straight = function(x) {
	return fuzzylogic.triangle(x, 0.4, 0.5, 0.6);
}

SteeringManager.Right = function(x) {
	return fuzzylogic.triangle(x, 0.5, 0.6, 0.75);
}

SteeringManager.HardRight = function(x) {
	return fuzzylogic.trapezoid(x, 0.6, 0.75, 1, 1);
}
const SteeringFuzzyDepFuncs = [SteeringManager.FarLeft, SteeringManager.Left, SteeringManager.Straight, SteeringManager.Right, SteeringManager.FarRight];
const SteeringFuzzySetNames = SteeringFuzzyDepFuncs.map(function(func) {return func.name});

SteeringManager.get_dependencies = function(x) {
	const dependencies = []

	for (var i = 0; i < SteeringFuzzyDepFuncs.length; ++i) {
		const func = SteeringFuzzyDepFuncs[i];
		const name = func.name;
		if (func(x) > 0) {
			dependencies.push({"type": name, "value": func(x)});
		}
	}
	return dependencies;
}