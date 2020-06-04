import { fabric } from 'fabric';
import { Controller } from 'stimulus';

import { CanvasConfig, RecognitionObject, CanvasHandlers } from './image_recognition'


export default class extends Controller {
  static targets = ["canvas", 'tagButton', 'logger', 'submitButton'];

  initialize() {
    this.createCanvas();
    CanvasHandlers(this);
    this.canvas.on("mouse:down", (e) => {
      if(this.canvas.getObjects().length === 0){
        let recognitionObject = new RecognitionObject({
          left: e.absolutePointer.x-75,
          top: e.absolutePointer.y-100,
          tags: $('.label:first').attr('data-value'),
        });
        this.canvas.add(recognitionObject);
        this.canvas.setActiveObject(recognitionObject);
      }
    })
  }

  connect(){
    this.loadCanvasFromJson();
  }

  submit = (event) => {
    event.preventDefault();

    let formJson = $('form').serializeJSON();
    let canvasJson = this.canvas.toJSON();
    let recognitions = canvasJson.objects.map(recognition => ({
      'left': recognition.left,
      'top': recognition.top,
      'width': recognition.width,
      'height': recognition.height,
      'tags': recognition.tags,
      'image': {
        src: canvasJson.backgroundImage.src,
        width: canvasJson.backgroundImage.width,
        height: canvasJson.backgroundImage.height,
      },
    }));

    formJson.result = { canvas: canvasJson, recognitions: recognitions };

    $.ajax('/worker/task/image_object_recognitions', {
      data: JSON.stringify(formJson),
      contentType: 'application/json',
      dataType: 'script',
      type: 'POST'
    });

  };

  onClickTagButton = (e) => {
    let tagName = e.currentTarget.getAttribute('data-value');

    if(this.canvas.getObjects().filter(o => o.tags===tagName).length > 2){
      alert('cannot add more than 3 areas');
      return;
    }

    let recognitionObject = new RecognitionObject({
      left: this.randomPosition() - 150,
      top: 50,
      tags: tagName,
    });
    this.canvas.add(recognitionObject);
    this.canvas.setActiveObject(recognitionObject);
  };

  onClickDelete = (e) => {
    let tagName = $(e.currentTarget).closest('.label').attr('data-value');
    this.canvas.getObjects().filter(o => o.tags===tagName).forEach((object)=>{
      this.canvas.remove(object)
    })
    e.stopPropagation()
  }

  randomPosition = () => {
    let num = Math.floor(Math.random() * Math.floor(100)) + (this.canvas.width/2);

    return num
  };

  loadBackground = () => {
    var canvas = this.canvas;
    var controller = this;
    fabric.Image.fromURL(this.imageUrl, function (img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {});
      controller.image = img;
    });
  };

  createCanvas = () => {
    this.canvas = new fabric.Canvas(this.canvasTarget.id, {
      controlsAboveOverlay:true,
      allowTouchScrolling: true,
      stateful: true
    });
    this.imageUrl = this.data.get('imageUrl');
    this.serialized = this.data.get('serialized');

    this.loadBackground();
    this.canvas.requestRenderAll();
  };

  loadCanvasFromJson = () => {
    if(this.serialized) {
      this.canvas.clear();
      this.canvas.loadFromJSON(this.serialized);
      this.canvas.requestRenderAll();
    }
  }
}