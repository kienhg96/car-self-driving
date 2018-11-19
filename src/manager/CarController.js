var CarController = cc.Class.extend({
	ctor: function() {
		this.readMapConfig();
	},

	readMapConfig: function() {
		var nodes = [];
		var edges = [];
		cc.loader.loadTxt('res/edges.tsv', function(err, text) {
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
	},

	nodes: function() {
		return this._nodes;
	},

	edges: function() {
		return this._edges;
	},

	setCar: function(car) {
		this._car = car;
	},

	run: function(start, end) {
		var nodes = this._nodes;
		// Calc verts
		var verts = [
			// nodes[8],
			// nodes[20],
			nodes[18],
			nodes[17],
			// nodes[16],
			nodes[15],
			// nodes[14],
			nodes[13],
			// nodes[12],
			nodes[11],
			nodes[10],
			nodes[9],
			nodes[7],
			nodes[6],
			nodes[5],
			nodes[4],
			nodes[3],
			nodes[2],
			nodes[1],
			nodes[0],
		];
		
		this._car.setPosition(verts[0]);	
		this._car.run(verts);
	},

	onTick: function(dt, direction, speed, distances) {
		if (!distances) {
			this._car.stop();
			cc.log("Car stoped");
			return null;
		}
		// cc.log("Left", distances.left, "Right", distances.right);

		// return direction;
		return {
			direction: CarAssistant.instance.hintDirection(this._car.getPosition()),
			speed: speed
		};
	}
});
