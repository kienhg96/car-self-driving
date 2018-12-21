var Deviation = {};

Deviation.FarLeft = function(x) {
	return fuzzylogic.reverseGrade(x, 0.25, 0.4);
}

Deviation.Left = function(x) {
	return fuzzylogic.triangle(x, 0.25, 0.4, 0.5);
}

Deviation.Middle = function(x) {
	return fuzzylogic.triangle(x, 0.4, 0.5, 0.6);
}

Deviation.Right = function(x) {
	return fuzzylogic.triangle(x, 0.5, 0.6, 0.75);
}

Deviation.FarRight = function(x) {
	return fuzzylogic.grade(x, 0.6, 0.75);
}

var Steering = {};

Steering.HardLeft = function(x) {
	return fuzzylogic.reverseGrade(x, 0.25, 0.4);
}

Steering.Left = function(x) {
	return fuzzylogic.triangle(x, 0.25, 0.4, 0.5);
}

Steering.Straight = function(x) {
	return fuzzylogic.triangle(x, 0.4, 0.5, 0.6);
}

Steering.Right = function(x) {
	return fuzzylogic.triangle(x, 0.5, 0.65, 0.75);
}

Steering.HardRight = function(x) {
	return fuzzylogic.grade(x, 0.65, 0.75);
}

Rock = {};

Rock.Near = function(x) {
	return fuzzylogic.reverseGrade(x, 0.25, 0.75);
}

Rock.Far = function(x) {
	return fuzzylogic.grade(x, 0.25, 0.75);
}

Rock.Left = function(v) {
	return v === 'LEFT' ? 1 : 0;
}

Rock.Right = function(v) {
	return v === 'RIGHT' ? 1 : 0;
}

// const DirectionRules = [
// 	{ IF: Deviation.FarLeft, THEN: Steering.HardRight },
// 	{ IF: Deviation.Left, THEN: Steering.Right },
// 	{ IF: Deviation.Middle, THEN: Steering.Straight },
// 	{ IF: Deviation.Right, THEN: Steering.Left },
// 	{ IF: Deviation.FarRight, THEN: Steering.HardLeft },
// ];

const DirectionRules = [{
	IF: [Deviation.FarLeft, Rock.Far, Rock.Left], 
	THEN: Steering.HardRight
},{ 
	IF: [Deviation.Left, Rock.Far, Rock.Left],
	THEN: Steering.HardRight
},{
	IF: [Deviation.Middle, Rock.Far, Rock.Left], 
	THEN: Steering.Right 
},{ 
	IF: [Deviation.Right, Rock.Far, Rock.Left], 
	THEN: Steering.Straight 
},{ 
	IF: [Deviation.FarRight, Rock.Far, Rock.Left], 
	THEN: Steering.Left 
},{ 
	IF: [Deviation.FarLeft, Rock.Near, Rock.Left], 
	THEN: Steering.HardRight
},{ 
	IF: [Deviation.Left, Rock.Near, Rock.Left],
	THEN: Steering.HardRight
},{
	IF: [Deviation.Middle, Rock.Near, Rock.Left], 
	THEN: Steering.HardRight 
},{ 
	IF: [Deviation.Right, Rock.Near, Rock.Left], 
	THEN: Steering.Right 
},{ 
	IF: [Deviation.FarRight, Rock.Near, Rock.Left], 
	THEN: Steering.Straight 
},
// Right Rocks
{ 
	IF: [Deviation.FarLeft, Rock.Far, Rock.Right], 
	THEN: Steering.HardRight
},{ 
	IF: [Deviation.Left, Rock.Far, Rock.Right],
	THEN: Steering.HardRight
},{
	IF: [Deviation.Middle, Rock.Far, Rock.Right], 
	THEN: Steering.Right 
},{ 
	IF: [Deviation.Right, Rock.Far, Rock.Right], 
	THEN: Steering.Straight 
},{ 
	IF: [Deviation.FarRight, Rock.Far, Rock.Right], 
	THEN: Steering.Left 
},{ 
	IF: [Deviation.FarLeft, Rock.Near, Rock.Right], 
	THEN: Steering.Straight
},{ 
	IF: [Deviation.Left, Rock.Near, Rock.Right],
	THEN: Steering.Left
},{
	IF: [Deviation.Middle, Rock.Near, Rock.Right], 
	THEN: Steering.HardLeft 
},{ 
	IF: [Deviation.Right, Rock.Near, Rock.Right], 
	THEN: Steering.HardLeft 
},{ 
	IF: [Deviation.FarRight, Rock.Near, Rock.Right], 
	THEN: Steering.HardLeft 
}];

function calcDirection(x, side, rockDistance) {
	var normRockDistance = Math.min(150, rockDistance) / 150;
	const firedRules = [];
	// cc.log("Start Dev", x, side, normRockDistance);
	DirectionRules.forEach(rule => {
		const funcs = rule.IF;
		// cc.log(JSON.stringify(results));
		const deviation = Math.min(funcs[0](x), funcs[1](normRockDistance), funcs[2](side));
		if (deviation === 0) {
			return;
		}
		firedRules.push(w => Math.min(deviation, rule.THEN(w)));
	});
	// cc.log("End Dev");
	// calc centroid
	let X = 0, Y = 0;
	let y;
	for (let x = 0; x <= 1; x += 0.1) {
		y = firedRules.reduce((maxValue, current) => {
			return Math.max(maxValue, current(x));
		}, 0);

		X += x * y;
		Y += y;
	}
	const centroid = X / Y;
	return centroid;
}
