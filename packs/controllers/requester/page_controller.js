import ApplicationController from '../application_controller'

export default class extends ApplicationController {

  connect() {
    this.element.addEventListener('ajax:beforeSend', this.handle_ajax_send.bind(this));
    this.element.addEventListener('ajax:complete', this.handle_ajax_complete.bind(this));
  }

  handle_ajax_send(){
    this.element.insertAdjacentHTML('afterbegin', '<div id="loader"><i class="fas fa-spinner fa-spin fa-2x"></i></div>');
  }

  handle_ajax_complete(){
    let loader = document.getElementById('loader');
    this.element.removeChild(loader);
  }
}