function _norm(v) {
	if (v < 0) {
		return 0;
	}
	if (v > 1) {
		return 1;
	}
	return v;
}
// for (var i = -1; i< 1.5; i += 0.01) {
//     var myval = hl(i);
//     var libval = fz.trapezoid(i, 0, 0, 0.25, 0.4);
//     if (myval - libval > 1e-3) {
//         console.log("FALSE");
//         console.log(myval + " > " + libval);
//     }
// }
function centroid(x, mfx) {
    
    var sum_moment_area = 0.0
    var sum_area = 0.0

    // If the membership function is a singleton fuzzy set:
    if (x.length == 1) 
        return x[0]*mfx[0] / Math.max(mfx[0], Number.MIN_VALUE)

    // else return the sum of moment*area/sum of area
    for (var i = 1; i < x.length; ++i) {
        var x1 = x[i - 1];
        var x2 = x[i];
        var y1 = mfx[i - 1];
        var y2 = mfx[i];

        // if y1 == y2 == 0.0 or x1==x2: --> rectangle of zero height or width
        if (!(y1 == y2 == 0.0 && x1 == x2)) {
            if (y1 == y2) {  // rectangle
                moment = 0.5 * (x1 + x2);
                area = (x2 - x1) * y1;
            } else if (y1 == 0.0 && y2 != 0.0) {  // triangle, height y2
                moment = 2.0 / 3.0 * (x2-x1) + x1;
                area = 0.5 * (x2 - x1) * y2;
            } else if (y2 == 0.0 && y1 != 0.0){  // triangle, height y1
                moment = 1.0 / 3.0 * (x2 - x1) + x1;
                area = 0.5 * (x2 - x1) * y1;
            } else {
                moment = (2.0 / 3.0 * (x2-x1) * (y2 + 0.5*y1)) / (y1+y2) + x1;
                area = 0.5 * (x2 - x1) * (y1 + y2);
            }

            sum_moment_area += moment * area;
            sum_area += area;
        }
    }
    return sum_moment_area / Math.max(sum_area, Number.MIN_VALUE);
}
