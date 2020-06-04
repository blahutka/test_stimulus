// import { RecognitionObject } from "./index";
// import { fabric } from "fabric";
//
// onClickDeleteRectangle = (event) => {
//   this.setActiveTool('eraser');
//   this.deactivateDrawing();
//   this.activateDeletion();
// };
//
// onClickCreateRectangle = (event) => {
//   this.setActiveTool('square');
//   this.activateDrawing();
// };
//
// startDrawing = (event) => {
//
//   this.isMouseDown = true;
//   var pointer = this.canvas.getPointer(event.e);
//
//   if (this.active_tool == 'square') {
//
//     this.rect = this.styledBox(pointer);
//     this.canvas.add(this.rect);
//   }
// };
//
// continueDrawing = (o) => {
//   if (!this.isMouseDown) {
//     return;
//   }
//   var pointer = this.canvas.getPointer(o.e);
//
//   if (this.active_tool == 'square') {
//     this.rect.set({
//       width: (Math.abs((pointer.x - this.rect.left))),
//       height: (Math.abs((pointer.y - this.rect.top)))
//     });
//
//     this.canvas.renderAll();
//   }
// };
//
// stopDrawing = (o) => {
//   if (this.active_tool == 'square') {
//     this.rect.setCoords();
//
//     // Remove small objects 1x1 px (mouse click)
//     if (this.rect.height < 1 || this.rect.width < 1) {
//       this.canvas.remove(this.rect);
//       return this.isMouseDown = false;
//     }
//
//     this.rect.on('moving', () => {
//       //this.positionBtn(this.rect)
//     });
//     this.rect.on('scaling', () => {
//       // this.positionBtn(this.rect)
//     });
//     //this.positionBtn(this.rect);
//
//     let group = new RecognitionObject({ rect: this.rect });
//     this.canvas.add(group);
//     this.canvas.remove(this.rect);
//
//     this.isMouseDown = false;
//     this.deactivateDrawing();
//   }
// };
//
//
// allObjectsSelectable = (val) => {
//   this.canvas.forEachObject(function (obj) {
//     obj.selectable = val;
//   });
//
//   this.canvas.renderAll();
// };
//
// setActiveTool = (tool_name) => {
//   this.active_tool = tool_name;
//
//   if (this.active_tool == 'square') {
//     this.buttonDeleteTarget.classList.remove('btn-primary')
//     this.buttonCreateTarget.classList.add('btn-primary')
//
//   } else if (this.active_tool == 'eraser') {
//     this.buttonCreateTarget.classList.remove('btn-primary')
//     this.buttonDeleteTarget.classList.add('btn-primary')
//   } else {
//     console.log('wrong tool name', tool_name)
//   }
// };
//
// activateDrawing = () => {
//   this.canvas.on('mouse:down', this.startDrawing);
//   this.canvas.on('mouse:move', this.continueDrawing);
//   this.canvas.on('mouse:up', this.stopDrawing);
//   this.canvas.selection = false;
//   this.allObjectsSelectable(false);
// };
//
// deactivateDrawing = () => {
//   this.canvas.selection = true;
//   this.canvas.isDrawingMode = false;
//   this.canvas.off('mouse:down', this.startDrawing);
//   this.canvas.off('mouse:move', this.continueDrawing);
//   this.canvas.off('mouse:up', this.stopDrawing);
// };
//
// activateDeletion = () => {
//   this.allObjectsSelectable(true);
//   this.canvas.remove(this.canvas.getActiveObject());
// };
//
// styledBox = (pointer, width = null, height = null, tags = null) => {
//   return new fabric.Rect({
//     tags: tags,
//     left: pointer.x,
//     top: pointer.y,
//     width: width || 0.1,
//     height: height || 0.1,
//     stroke: 'white',
//     strokeWidth: 3,
//     selectable: true,
//     fill: 'fill',
//     opacity: 0.5
//   });
// };