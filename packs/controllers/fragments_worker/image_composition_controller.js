import ApplicationController from '../application_controller'
import ImageComposition from './image_composition/events'

export default class extends ApplicationController {
  static targets = ['image'];

  initialize(){
    this.taskHelp = window.FragmentsPlatform.TaskHelp;
    this.navigationOffset = 280;

    this.subscribe(ImageComposition.Option.clicked, (e) => this.taskHelp.select = e.detail.id);
    this.subscribe(ImageComposition.Option.dblclicked, (e) => this.taskHelp.openMenu());


    this.image.onload = this.resizeImage.bind(this)
  };

  get image() {
    return this.imageTarget
  }

  get calculateImageDimensions() {
    let { naturalWidth, naturalHeight } = this.image;
    let { innerWidth, innerHeight } = window;
    let window_height = innerHeight - this.navigationOffset

    return this.calculateAspectRatioFit(naturalWidth, naturalHeight, innerWidth, window_height)
  }

  resizeImage() {
    let { width, height } = this.calculateImageDimensions;

    if (this.image.clientHeight > height) {
      this.image.width = width;
      this.image.height = height
    }
  }

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: Math.floor(srcWidth * ratio), height: Math.floor(srcHeight * ratio) };
  }
}
