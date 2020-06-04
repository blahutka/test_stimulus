export default (controller) => {

  const deleteButton = (options) => {
    if (!options.target) return;

    if (!options.subTargets[0]) return;

    if (options.subTargets[0].componentName == 'deleteButton') {
      controller.canvas.remove(controller.canvas.getActiveObject());
    }
  }

  const toggleButton = (options) => {
    let objectTags = options.target.tags;
    let tagButtons = controller.tagButtonTargets;

    tagButtons.forEach((tagButton, i) => {
      let tagName = tagButton.getAttribute('data-value');
      if (controller.canvas.getObjects().filter(o => o.tags===objectTags).length) {
        tagButton.classList.add("selected");
      }else{
        tagButton.classList.remove("selected");
      }
    })
    if(controller.canvas.getObjects().length){
      controller.submitButtonTarget.disabled = false
    }else{
      controller.submitButtonTarget.disabled = true
    }
  };

  const resizeCanvas = (controller) => {
    let windowWidth = $('[data-canvas-size]').width();
    let canvasWidth = $('.canvas-container').width();
    let zoom = windowWidth / (canvasWidth);

    let newCanvasWidth = controller.canvas.getWidth() * zoom;
    let newCanvasHeight = (controller.canvas.getHeight() / controller.canvas.getWidth()) * newCanvasWidth;

    //$(controller.loggerTarget).html(`zoom: ${zoom} `)
    if (canvasWidth > windowWidth) {
      controller.canvas.setZoom(zoom)
      controller.canvas.setWidth(newCanvasWidth);
      controller.canvas.setHeight(newCanvasHeight);
      controller.canvas.renderAll()
    }
  };

  resizeCanvas(controller);
  $(window).on('resize', () => {
    resizeCanvas(controller)
  });

  const handleMoving = (options) => {
    let obj = options.target;
    let boundingRect = obj.getBoundingRect(false);
    if(boundingRect.width > controller.canvas.getWidth() || boundingRect.height > controller.canvas.getHeight()){
      obj.top = obj._stateProperties.top;
      obj.left = obj._stateProperties.left;
      obj.angle = obj._stateProperties.angle;
      obj.scaleX = obj._stateProperties.scaleX;
      obj.scaleY = obj._stateProperties.scaleY;
    }else{
      if(boundingRect.left < 0) obj.left = 0;
      if(boundingRect.top < 0) obj.top = 0;
      if(boundingRect.left + boundingRect.width > controller.canvas.getWidth()) obj.left = (controller.canvas.getWidth() - boundingRect.width) / controller.canvas.getZoom();
      if(boundingRect.top + boundingRect.height > controller.canvas.getHeight()) obj.top = (controller.canvas.getHeight() - boundingRect.height) / controller.canvas.getZoom();
    }
    obj.setCoords();
    obj.saveState();
  }

  const addedCallback = (e) => {
    handleMoving(e)
    toggleButton(e)
  }

  controller.canvas.on({
    'object:added': addedCallback,
    'object:removed': toggleButton,
    'object:modified': handleMoving,
    'mouse:up': deleteButton
  })
};