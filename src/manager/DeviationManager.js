var fuzzylogic = require('fuzzylogic'); 

var DeviationManager = {};

DeviationManager.FarLeft = function(x) {
	return fuzzylogic.trapezoid(x, 0, 0, 0.25, 0.4);
}

DeviationManager.Left = function(x) {
	return fuzzylogic.triangle(x, 0.25, 0.4, 0.5);
}

DeviationManager.Middle = function(x) {
	return fuzzylogic.triangle(x, 0.4, 0.5, 0.6);
}

DeviationManager.Right = function(x) {
	return fuzzylogic.triangle(x, 0.5, 0.6, 0.75);
}

DeviationManager.FarRight = function(x) {
	return fuzzylogic.trapezoid(x, 0.6, 0.75, 1, 1);
}

const DeviationFuzzyDepFuncs = [DeviationManager.FarLeft, DeviationManager.Left, DeviationManager.Straight, DeviationManager.Right, DeviationManager.FarRight];
const DeviationFuzzySetNames = DeviationFuzzyDepFuncs.map(function(func) {return func.name});

DeviationManager.get_dependencies = function(x) {
	const dependencies = []

	for (var i = 0; i < DeviationFuzzyDepFuncs.length; ++i) {
		const func = DeviationFuzzyDepFuncs[i];
		const name = func.name;
		if (func(x) > 0) {
			dependencies.push({"type": name, "value": func(x)});
		}
	}
	return dependencies;
}