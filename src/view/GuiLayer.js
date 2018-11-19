var GuiLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		this.renderToggleMapButton();
	},

	renderToggleMapButton: function() {
		this._toggleMapBtn = new ccui.Button(res.map_btn, res.map_btn, res.map_btn);
		var size = this._toggleMapBtn.getContentSize();
		this._toggleMapBtn.setPosition(cc.winSize.width - size.width / 2 - 10, cc.winSize.height - size.height / 2 - 10);
		this.addChild(this._toggleMapBtn);
		this._toggleMapBtn.addTouchEventListener(this.handleMapBtnToggle, this);
	},

	handleMapBtnToggle: function(sener, type) {
		if (type === ccui.Widget.TOUCH_ENDED) {
			MapLayer.instance.toggleMapRoutes();
		}
	}
});
