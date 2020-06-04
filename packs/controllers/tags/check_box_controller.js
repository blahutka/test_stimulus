import { Controller } from 'stimulus';

export default class extends Controller {

  initialize() {
    this.element.addEventListener('change', this.handle_changed.bind(this));
    this.currentParams = this.params
  }

  handle_changed(ev) {
    let value = ev.target.checked * ev.target.checked;

    let params = (
      (this.currentParams ? this.currentParams + '&' : '') + this.name + '=' + value
    );

    this.params = params;

    document.addEventListener('ajax:complete', () => {
      ev.target.removeAttribute('disabled')
    });
    document.addEventListener('ajax:before', () => {
      ev.target.setAttribute('disabled', true)
    });

  }

  get params() {
    return this.element.getAttribute('data-params')
  }

  set params(val) {
    this.element.setAttribute('data-params', val)
  }

  get name() {
    return this.element.getAttribute('name')
  }
}
