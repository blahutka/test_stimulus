import ApplicationController from '../../application_controller';
import ClassificationEvents from "../classification/events";

export default class extends ApplicationController {
  static targets = ['helpButton'];

  initialize() {
    if(this.hasHelpButtonTarget){
      let manage = this.registerDoubleTap(this.helpButtonTarget);
      manage.on("singletap", this.publishClicked.bind(this));
    }
  }

  publishClicked(e) {
    this.publish(ClassificationEvents.Option.clicked, {
      id: this.getDataAttribute('option-id'),
      name: this.getDataAttribute('option-name')
    })
  }
}
