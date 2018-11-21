var FlagPointSprite = cc.Sprite.extend({
	ctor: function(res) {
		this._super(res);
	},

	onEnter: function() {
		this._super();
		this.initEvents();
	},

	initEvents: function() {
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded
		}, this);
	},

	onTouchBegan: function(touch, event) {
		var target = event.getCurrentTarget();
		if (!target.isVisible()) {
			return false;
		}
		var location = touch.getLocation();
		var position = target.getPosition();
		var mapPosition = MapLayer.instance.getPosition();
		var mapScale = MapLayer.instance.getScale();
		var size = target.getContentSize();
		var globalPosition = cc.p(
			cc.winSize.width / 2 + mapPosition.x + (position.x - cc.winSize.width / 2) * mapScale,
			cc.winSize.height / 2 + mapPosition.y + (position.y - cc.winSize.height / 2) * mapScale
		);
		var rect = cc.rect(
			globalPosition.x - size.width * mapScale / 2,
			globalPosition.y - size.height * mapScale / 2,
			size.width * mapScale,
			size.height * mapScale
		);
		if (cc.rectContainsPoint(rect, location)) {
			return true;
		}
		return false;
	},

	onTouchMoved: function(touch, event) {
		var target = event.getCurrentTarget();
		var delta = touch.getDelta();
		var mapScale = MapLayer.instance.getScale();
		target.x += delta.x / mapScale;
		target.y += delta.y / mapScale;
	},

	onTouchEnded: function(touch, event) {}
});
