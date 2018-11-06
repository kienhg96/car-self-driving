var MainScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.renderMapLayer();
	},

	renderMapLayer: function() {
		this.mapLayer = new MapLayer();
		this.addChild(this.mapLayer);
	}
});
