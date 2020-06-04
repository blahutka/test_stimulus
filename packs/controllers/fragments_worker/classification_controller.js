import ApplicationController from '../application_controller'
import ClassificationEvents from "./classification/events";

export default class extends ApplicationController {
  initialize(){
    this.taskHelp = window.FragmentsPlatform.TaskHelp;

    this.subscribe(ClassificationEvents.Option.clicked, (e) => {
      this.taskHelp.select = e.detail.id;
      this.taskHelp.openMenu();
    });
  };
}
