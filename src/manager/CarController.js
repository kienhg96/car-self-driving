var CarController = cc.Class.extend({
	ctor: function () {
		this.readMapConfig();
	},

	readMapConfig: function () {
		var nodes = [];
		var edges = [];
		cc.loader.loadTxt('res/edges.tsv', function (err, text) {
			if (err) {
				cc.log("ERROR" + err);
			}
			var lines = text.split('\n');
			var i = 0;
			for (; i < lines.length; i++) {
				var line = lines[i].trim();
				if (line === 'edges') {
					break;
				}
				var values = line.split('\t');
				if (values.length < 3) {
					continue;
				}
				nodes.push(cc.p(parseInt(values[1]), parseInt(values[2])));
			}
			for (; i < lines.length; i++) {
				var line = lines[i].trim();
				var values = line.split('\t');
				if (values.length < 2) {
					continue;
				}
				edges.push(cc.p(parseInt(values[0]), parseInt(values[1])));
			}
		});
		this._nodes = nodes;
		this._edges = edges;
		var edgeMatrix = [];
		for (var i = 0; i < nodes.length; i++) {
			var row = [];
			for (var j = 0; j < nodes.length; j++) {
				row.push(INF);
			}
			edgeMatrix.push(row);
		}
		edges.forEach(function (edge) {
			var distance = cc.distance(nodes[edge.x], nodes[edge.y]);
			edgeMatrix[edge.x][edge.y] = distance;
			edgeMatrix[edge.y][edge.x] = distance;
		});
		this._edgesMatrix = edgeMatrix;
	},

	nodes: function () {
		return this._nodes;
	},

	edges: function () {
		return this._edges;
	},

	setCar: function (car) {
		this._car = car;
	},

	run: function (start, end) {
		var nodes = this._nodes;
		var startNodeIndex = 0;
		var endNodeIndex = 0;
		var distanceStart = Infinity;
		var distanceEnd = Infinity;
		// Find the neaest node
		for (var i = 0; i < nodes.length; i++) {
			var tmpStart = cc.distance(nodes[i], start);
			var tmpEnd = cc.distance(nodes[i], end);
			if (tmpStart < distanceStart) {
				startNodeIndex = i;
				distanceStart = tmpStart;
			}
			if (tmpEnd < distanceEnd) {
				endNodeIndex = i;
				distanceEnd = tmpEnd;
			}
		}

		// Calc verts
		var path = dijktra(startNodeIndex, endNodeIndex, this._edgesMatrix);
		var verts = path.map(function (index) {
			return nodes[index];
		});
		start = verts[0];
		this._car.setPosition(cc.p(start.x + 10, start.y + 10));
		this._car.run(verts);
		this._rocks = [];
		var rockPositions = MapLayer.instance._rocks.map(rock => rock.getPosition());
		rockPositions.forEach(rock => {
			const side = CarAssistant.instance.findRockPosition(rock);
			if (side) {
				cc.log(side);
				this._rocks.push({
					position: rock,
					side: side
				});
			}
		});
		this._car.setRocks(this._rocks);
		// MapLayer.instance.centerTo(start);
		MapLayer.instance.clearRoundBorders();
		MapLayer.instance.showRoundBorders();
	},

	stop: function () {
		this._car.stop();
	},

	onTick: function(dt, direction, speed, distances, trafficLight, side, rockDistance) {
		if (!distances) {
			this._car.stop();
			MapLayer.instance.onStop();
			cc.log("Car stoped");
			return null;
		}
		return this.directionCtrl(dt, direction, speed, distances, trafficLight, side || "LEFT", rockDistance || 1000000);
	},

	directionCtrl: function(dt, direction, speed, distances, trafficLight, side, rockDistance) {
		var ratio = distances.left / (distances.left + distances.right);
		// var deltaAngle = (ratio - 0.5) * dt * 20;
		var routeDir = CarAssistant.instance.hintDirection(this._car.getPosition());
		var angle = cc.angleOfVector(routeDir);
		
		var centroid = calcDirection(ratio, side, rockDistance);
		var deltaAngle = (0.5 - centroid) * dt * 50;
		angle += deltaAngle;

		return {
			direction: cc.p(Math.cos(angle), Math.sin(angle)),
			speed: speed,
			// direction: direction
		};
	}
});
