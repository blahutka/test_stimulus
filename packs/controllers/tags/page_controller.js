import ApplicationController from '../application_controller'

const DEFAULT_MESSAGE = 'Something went wrong with that request. Please try again.'
const ESC_KEY = 27

export default class extends ApplicationController {
  static targets = [ 'message' ];

  connect() {
    document.addEventListener('ajax:error', this.handle_ajax_error.bind(this));
    document.addEventListener('keydown', this.handle_esc_keypress.bind(this))
  }

  handle_ajax_error(event) {
    if (!event.target.getAttribute('data-remote')) return;

    const [_text, _status_text, xhr] = event.detail;

    if (xhr.status === 422) return

    if (Rails.environment === 'development') {
      var msg = _text
    } else {
      var msg = DEFAULT_MESSAGE
    }
    this.show(msg)
  }

  handle_esc_keypress(event) {
    if (event.which === ESC_KEY) this.hide()
  }

  show(message) {
    // this.clear_timeout();
    this.messageTarget.innerText = message;
    this.messageTarget.classList.add('d-block');
    // this.data.set('timer-id', setTimeout(() => { this.hide() }, 8000))
  }

  hide() {
    this.messageTarget.classList.remove('d-block')
  }

  clear_timeout() {
    clearTimeout(this.data.get('timer-id'))
  }
}