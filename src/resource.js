var res = {
    map: "res/final_map.png",
    car: "res/car.png",
    light_red: "res/traffic_light/red.png",
    light_green: "res/traffic_light/green.png",
    light_yellow: "res/traffic_light/yellow.png",
    map_btn: "res/map_btn.png",
    map_lock_btn: "res/map_lock_btn.png",
    start_btn: "res/start_btn.png",
    icon_start: "res/icon_start.png",
    icon_end: "res/icon_end.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

// Config
const Values = {
	laneWidth: 15,
};
