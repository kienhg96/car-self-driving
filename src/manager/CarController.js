const DirectionManager = require('./DirectionManager');
const DeviationManager = require('./DeviationManager');
const fuzzylogic = require('fuzzylogic');

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
		this._car.setPosition(start);
		this._car.run(verts);
		// MapLayer.instance.centerTo(start);
		MapLayer.instance.clearRoundBorders();
		MapLayer.instance.showRoundBorders();
	},

	stop: function () {
		this._car.stop();
	},

	onTick: function (dt, direction, speed, distances) {
		if (!distances) {
			this._car.stop();
			MapLayer.instance.onStop();
			cc.log("Car stoped");
			return null;
		}
		return this.directionCtrl(dt, direction, speed, distances);
	},

	directionCtrl: function (dt, direction, speed, distances) {
		var ratio = distances.left / (distances.left + distances.right);
		var angle = cc.angleOfVector(direction);
		var deltaAngle = (ratio - 0.5) * dt * 20;

		// angle += deltaAngle;
		// var nDirection = cc.p(
		// 	Math.cos(angle),
		// 	Math.sin(angle)
		// );
		// Lưu luật dạng: IF x1=A, x2=B, ... THEN y=C
		const direction_rules = [{ "IF": { "DEVIATION": "FAR_LEFT" }, "THEN": { "STEERING": "HARD_RIGHT" } }]
		const speed_rules = [{ "IF": [{ "DEVIATION": "FAR_LEFT", "LIGHT_STATUS": null }], "THEN": { "SPEED": "HARD_RIGHT" } }]
		// Mờ hóa các giá trị đầu vào rõ
		// ví dụ ở đây: đầu vào deviation, giá trị rõ x
		var deviation_dependencies = DeviationManager.get_dependencies(ratio);
		var light_dependencies = LightManager.get_dependencies(light);
		// thu được tập các [(<tên tập mờ>, <giá trị hàm thuộc của x trong tập mờ>)]
		// có thể lấy thêm light_status_dependencies

		// GET SPEED
		// duyệt qua tất cả các luật xem có luật nào phù hợp với các tập mờ đầu vào
		var rule_values = 0; // giá trị đầu ra của 1 luật
		var rule_weights = 0; // cùng với trọng số của luật, 2 cái này để tính trung bình theo trọng số
		for (rule in direction_rules) {
			for (deviation_dep in deviation_dependencies) {
				var dev_type = deviation_dep['type'];
				var dev_dep_value = deviation_dep['value'];
				for (light_dep in light_dependencies) {
					var light_type = deviation_dep['type'];
					var light_dep_value = deviation_dep['value'];
					if (rule['IF']['DEVIATION'] == dev_type && rule['IF']['LIGHT_STATUS'] == light_type) { // khớp luật này
						var min_dep_value = min(dev_dep_value, light_dep_value) // lấy min của các đầu vào
						var speed_fuzzy_set = rule['THEN']['SPEED']
						var rule_weight = dev_dep_value * light_dep_value // trọng số bằng tích giá trị hàm thuộc các luật
						var defuzzy_value = ;
						var rule_value = min(min_dep_value, defuzzy_value);
						rule_values.push(rule_value);
						rule_weights.push(rule_weight);
					}
				}

			}
		}
		// Tính trung bình có trọng số của các luật
		var tuso = 0, mauso = 0;
		for (var i = 0; i < rule_values.length; ++i) {
			tuso += rule_values[i] * rule_weights[i];
			mauso += rule_weights[i];
		}
		var nSpeed = tuso / mauso; // đây là giá trị rõ của hướng sau khi khử mờ
		// END
		
		// GET DIRECTION
		// Chỗ này báo cáo nói: "Kết quả sẽ là giá trị Max của độ phụ thuộc của các biến ngôn ngữ" thì ko rõ là giá trị độ phụ thuộc luôn hay là giá trị đó nhân với giá trị khử mờ trọng tâm của tập mờ tương ứng. Thì t cứ làm theo cách 2
		// Lấy luật khớp có giá trị hàm thuộc lớn nhất
		var max_dev_dep_val = 0;
		var max_dev_type = null;
		for (rule in direction_rules) {
			for (deviation_dep in deviation_dependencies) {
				var dev_type = deviation_dep['type'];
				var dev_dep_value = deviation_dep['value'];
				if (rule['IF']['DEVIATION'] == dev_type) {
					if (dev_dep_value > max_dev_dep_val) {
						max_dev_dep_val = dev_dep_value;
						max_dev_type = dev_type;
					}
				}
			}
		}
		var nDirection = max_dev_dep_val * defuzzy(max_dev_type);
		// var nSpeed = (1 - Math.abs(ratio - 0.5)) * BASE_SPEED;
		// return direction;
		cc.log("Speed", nSpeed);
		return {
			// direction: CarAssistant.instance.hintDirection(this._car.getPosition()),
			speed: nSpeed,
			direction: nDirection
		};
	}
});
