import { fabric } from "fabric";

export default fabric.util.createClass(fabric.Group, {

  initialize: function (options) {
    options || (options = {});
    this.set('subTargetCheck', true);
    this.set('tags', options.tags || '');
    this.set('rect', options.rect || '');
    this.set('left', options.left || options.rect.left);
    this.set('top', options.top || options.rect.top);
    this.set('width', options.width || 150);
    this.set('height', options.height || 200);

    let objectRectangle = this.objectRectangle(this);

    this.on('selected', (e) => {
      this.canvas.set({
        allowTouchScrolling: false
      })
    });

    this.on('deselected', (e) => {
      this.canvas.set({
        allowTouchScrolling: true
      })
    })

    let groupObjects = [objectRectangle];

    return this.callSuper('initialize', groupObjects, options);
  },

  randomColor: () => {
    let items = ['red', 'blue', 'yellow', 'purple', 'green'];

    return items[Math.floor(Math.random()*items.length)];
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      tags: this.get('tags'),
      image: this.get('image')
    });
  },

  objectRectangle: (options) => {
    return new fabric.Rect({
      componentName: 'selectionBox',
      left: options.left,
      top: options.top,
      width: options.width || 0.1,
      height: options.height || 0.1,
      stroke: '#72FFA2', // options.randomColor()
      strokeWidth: 2,
      selectable: true,
      fill: 'rgba(114, 255, 162, 0.2)',
      opacity: 1,
      noScaleCache: false,
    });
  }
});