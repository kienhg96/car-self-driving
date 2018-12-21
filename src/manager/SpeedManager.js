var Speed = {};

Speed.Slower = function(x) {
	return fuzzylogic.reverseGrade(x, 0.2, 0.25);
}

Speed.Slow = function(x) {
	return fuzzylogic.triangle(x, 0.2, 0.25, 0.3);
}

Speed.Normal = function(x) {
	return fuzzylogic.triangle(x, 0.25, 0.5, 0.75);
}

Speed.Fast = function(x) {
	return fuzzylogic.grade(x, 0.5, 0.75);
}

const SpeedRules = [{
	IF: [Deviation.FarLeft, Rock.Far, Rock.Left], 
	THEN: Speed.Fast
},{ 
	IF: [Deviation.Left, Rock.Far, Rock.Left],
	THEN: Speed.Fast
},{
	IF: [Deviation.Middle, Rock.Far, Rock.Left], 
	THEN: Speed.Fast 
},{ 
	IF: [Deviation.Right, Rock.Far, Rock.Left], 
	THEN: Speed.Fast 
},{ 
	IF: [Deviation.FarRight, Rock.Far, Rock.Left], 
	THEN: Speed.Fast 
},{ 
	IF: [Deviation.FarLeft, Rock.Near, Rock.Left], 
	THEN: Speed.Slower
},{ 
	IF: [Deviation.Left, Rock.Near, Rock.Left],
	THEN: Speed.Slower
},{
	IF: [Deviation.Middle, Rock.Near, Rock.Left], 
	THEN: Speed.Slow 
},{ 
	IF: [Deviation.Right, Rock.Near, Rock.Left], 
	THEN: Speed.Normal 
},{ 
	IF: [Deviation.FarRight, Rock.Near, Rock.Left], 
	THEN: Speed.Fast 
},
// Right Rocks
{ 
	IF: [Deviation.FarLeft, Rock.Far, Rock.Right], 
	THEN: Speed.Fast
},{ 
	IF: [Deviation.Left, Rock.Far, Rock.Right],
	THEN: Speed.Fast
},{
	IF: [Deviation.Middle, Rock.Far, Rock.Right], 
	THEN: Speed.Fast 
},{ 
	IF: [Deviation.Right, Rock.Far, Rock.Right], 
	THEN: Speed.Fast 
},{ 
	IF: [Deviation.FarRight, Rock.Far, Rock.Right], 
	THEN: Speed.Fast 
},{ 
	IF: [Deviation.FarLeft, Rock.Near, Rock.Right], 
	THEN: Speed.Fast
},{ 
	IF: [Deviation.Left, Rock.Near, Rock.Right],
	THEN: Speed.Normal
},{
	IF: [Deviation.Middle, Rock.Near, Rock.Right], 
	THEN: Speed.Slow 
},{ 
	IF: [Deviation.Right, Rock.Near, Rock.Right], 
	THEN: Speed.Slower
},{ 
	IF: [Deviation.FarRight, Rock.Near, Rock.Right], 
	THEN: Speed.Slower 
}];

function calcSpeed(x, side, rockDistance) {
	var normRockDistance = Math.min(80, rockDistance) / 80;
	const firedRules = [];
	// cc.log("Start Dev", x, side, normRockDistance);
	SpeedRules.forEach(rule => {
		const funcs = rule.IF;
		// cc.log(JSON.stringify(results));
		const value = Math.min(funcs[0](x), funcs[1](normRockDistance), funcs[2](side));
		if (value === 0) {
			return;
		}
		firedRules.push(w => Math.min(value, rule.THEN(w)));
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
