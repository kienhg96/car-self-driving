var GuiLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		this.renderToggleMapButton();
		this.renderLockMapButton();
		this.renderStartButton();
		this.renderStatuses();
	},

	renderStatuses: function() {
		var text = new cc.LabelTTF("Speed: 0", "Arial", 20);
		text.setFontFillColor(cc.color(113, 244, 66));
		text.setPosition(0, cc.winSize.height);
		text.setAnchorPoint(0, 1);
		this._speedText = text;
		text = new cc.LabelTTF("Direction: 0", "Arial", 20);
		text.setFontFillColor(cc.color(113, 244, 66));
		text.setPosition(0, cc.winSize.height - this._speedText.height);
		text.setAnchorPoint(0, 1);
		this._directionText = text;
		this.addChild(this._speedText);
		this.addChild(this._directionText);
	},

	setValue: function(speed, direction) {
		this._speedText.setString("Speed: " + speed);
		this._directionText.setString("Direction: " + direction);
	},

	renderToggleMapButton: function() {
		this._toggleMapBtn = new ccui.Button(res.map_btn, res.map_btn, res.map_btn);
		var size = this._toggleMapBtn.getContentSize();
		this._toggleMapBtn.setPosition(cc.winSize.width - size.width / 2 - 10, cc.winSize.height - size.height / 2 - 10);
		this.addChild(this._toggleMapBtn);
		this._toggleMapBtn.addTouchEventListener(this.handleMapBtnToggle, this);
	},

	handleMapBtnToggle: function(sender, type) {
		if (type === ccui.Widget.TOUCH_ENDED) {
			MapLayer.instance.toggleMapRoutes();
		}
	},

	renderLockMapButton: function() {
		this._lockBtn = new ccui.Button(res.map_lock_btn, res.map_lock_btn, res.map_lock_btn);
		var size = this._lockBtn.getContentSize();
		this._lockBtn.setPosition(this._toggleMapBtn.x - this._toggleMapBtn.width / 2 - size.width / 2 - 10, cc.winSize.height - size.height / 2 - 10);
		this.addChild(this._lockBtn);
		this._lockBtn.addTouchEventListener(this.handleLockBtn, this);
	},

	handleLockBtn: function(sender, type) {
		if (type === ccui.Widget.TOUCH_ENDED) {
			MapLayer.instance.toggleLockMap();
		}
	},

	renderStartButton: function() {
		this._startBtn = new ccui.Button(res.start_btn, res.start_btn, res.start_btn);
		var size = this._startBtn.getContentSize();
		this._startBtn.setPosition(this._lockBtn.x - this._lockBtn.width / 2 - size.width / 2 - 10, cc.winSize.height - size.height / 2 - 10);
		this.addChild(this._startBtn);
		this._startBtn.addTouchEventListener(this.handleStartBtn, this);
	},

	handleStartBtn: function(sender, type) {
		if (type === ccui.Widget.TOUCH_ENDED) {
			MapLayer.instance.toggleStart();
		}
	}
});
