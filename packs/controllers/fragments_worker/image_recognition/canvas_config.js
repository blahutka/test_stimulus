import {fabric} from 'fabric';

// fabric.Object.prototype.setControlVisible('mt', false);
// fabric.Object.prototype.setControlVisible('bl', false);
// fabric.Object.prototype.setControlVisible('tl', false);
// fabric.Object.prototype.setControlVisible('tr', false);
// fabric.Object.prototype.setControlVisible('mtr', false);
// fabric.Object.prototype.setControlVisible('ml', false);

fabric.Object.prototype.set({
  transparentCorners: false,
  cornerColor: '#72FFA2',
  cornerSize: 24 + (window.innerWidth / 100),
  padding: 2,
  objectCaching: false,
  hasRotatingPoint: false,
  hasBorders: false,
  cornerStyle: 'circle',
});

fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
  return {
    left: object.left + this._offset.left,
    top: object.top + this._offset.top
  };
};