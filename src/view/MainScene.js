var MainScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.renderMapLayer();
		this.renderGuiLayer();
	},

	renderMapLayer: function() {
		MapLayer.instance = new MapLayer();
		this.addChild(MapLayer.instance);
	},

	renderGuiLayer: function() {
		GuiLayer.instance = new GuiLayer();
		this.addChild(GuiLayer.instance);
	}
});
