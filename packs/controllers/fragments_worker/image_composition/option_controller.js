import ApplicationController from '../../application_controller'
import CompositionEvents from './events'

export default class extends ApplicationController {

  initialize() {
    let manage = this.registerDoubleTap(this.element);

    manage.on("doubletap", this.publishDblclicked.bind(this));
    manage.on("singletap", this.publishClicked.bind(this));
  }

  publishClicked() {
    this.publish(CompositionEvents.Option.clicked, {
      id: this.getDataAttribute('type-id'),
      name: this.getDataAttribute('type-name')
    })
  }

  publishDblclicked() {
    this.publish(CompositionEvents.Option.dblclicked, {
      id: this.getDataAttribute('type-id'),
      name: this.getDataAttribute('type-name')
    })
  }
}
