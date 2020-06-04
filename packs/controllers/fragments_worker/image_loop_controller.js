import ApplicationControler from '../application_controller';
import * as Hammer from 'hammerjs';

const SWIPE_RIGHT = 4;
const SWIPE_LEFT = 2;

export default class extends ApplicationControler {
  static targets = ['slide', 'image_label', 'slider', 'loader', 'help'];

  initialize() {
    this.imgRunner = null;
  }

  connect() {
    this.loadPrevImage();
    this.registerEvents();
    this.startImageLoop();
    if( ! this.is_touch_device()){
      this.helpTarget.style.display = 'none'
    }
  }

  disconnect(){
    clearInterval(this.imgRunner);
    this.imgRunner = null
  }

  showCurrentSlide() {
    this.slideTargets.forEach((el, i) => {
      el.classList.toggle("slide--current", this.index == i)
    })
  }

  next() {
    this.index = 1
  }

  previous() {
    this.index = 0
  }

  get index() {
    return parseInt(this.data.get("start"))
  }

  set index(value) {
    this.data.set("start", value)
    this.showCurrentSlide()
  }

  loadNextImage() {
    this.image_label = '<span class="text-muted">Before</span> <i class="fas fa-arrow-left"></i> After';
    this.helpTarget.style.transform = 'rotate(-10deg)';
    this.next()
  }

  loadPrevImage(){
    this.image_label = 'Before <i class="fas fa-arrow-right"></i> <span class="text-muted">After</span>';
    this.helpTarget.style.transform = 'rotate(10deg)';
    this.previous();
  }

  set image_label(txt){
    this.image_labelTarget.innerHTML = txt
  }

  switchImages() {
    if (this.index == 0) {
      this.loadNextImage();
    } else {
      this.loadPrevImage();
    }
  }

  startImageLoop() {
    return this.imgRunner = this.loop(this.switchImages.bind(this), 1000)
  }

  stopImageLoop() {
    if (this.imgRunner) {
      window.clearInterval(this.imgRunner);
      this.loadNextImage();
      return this.imgRunner = null
    }
  }

  toggleImageLoop = (e) => {
    e.preventDefault();

    if (this.imgRunner) {
      this.stopImageLoop();
    } else {
      this.startImageLoop()
    }
  };

  registerEvents = () => {
    let self = this;

    this.element.addEventListener('touchend', function (e) {
      self.stopImageLoop(e);
    });

    // this.element.addEventListener('click', function (e) {
    //   self.toggleImageLoop(e);
    // });

    let manager = this.registerSwipe(this.element);

    manager.on('swipe', function (e) {
      let direction = e.offsetDirection;

      if (direction === SWIPE_RIGHT || direction === SWIPE_LEFT) {
        if (direction === SWIPE_RIGHT) {
          self.loadPrevImage();
        }
        if (direction === SWIPE_LEFT) {
          self.loadNextImage()
        }

      }
    });
  };

  loop(handler, timeout, ...args) {
    return window.setInterval(handler, timeout, ...args);
  };

  loadedIds = []; // container for loaded images in imgLoad method
  imgLoad = (e) => {
    if(this.loadedIds.indexOf(e.currentTarget.id) === -1) this.loadedIds.push(e.currentTarget.id)
    if(this.loadedIds.length >= 2){
      $(this.sliderTarget).fadeIn(400);
      this.loaderTarget.style.display = 'none';
    }
  }

  // source: https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
  is_touch_device = () => {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function(query) {
      return window.matchMedia(query).matches;
    }
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      return true;
    }
    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
  }
}