import * as Hammer from 'hammerjs';
import { Controller } from 'stimulus';

export default class extends Controller {

  publish(event_name, detail = {}) {
    const event = new CustomEvent(event_name, { detail: detail, bubbles: true });
    // console.log('trigger:', event_name, detail);

    this.scope.element.dispatchEvent(event)
  };

  subscribe(event_name, handler, options = {}) {
    // console.log('subscribe:', event_name);
    this.scope.element.addEventListener(event_name, handler, options)
  }

  getDataAttribute(name){
    return this.element.getAttribute(`data-${name}`)
  };

  getController(element, controller_name) {
    return Promise.resolve().then(() => {
      return this.application.getControllerForElementAndIdentifier(element, controller_name)
    })
  };

  delay(handler, timeout, ...args) {
    window.setTimeout(handler, timeout, ...args);
  };

  registerDoubleTap(on_element) {
    let manage = new Hammer.Manager(on_element);

    manage.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    manage.add(new Hammer.Tap({ event: 'singletap' }));
    manage.get('doubletap').recognizeWith('singletap');
    return manage;
  }

  registerSwipe(on_element){
    // let hammer = new Hammer(on_element);
    let manager = new Hammer.Manager(on_element);
    let Swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL });
    manager.add(Swipe);
    return manager
  }

  railsPost(url, values = []) {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      values.forEach((d) => {
        const [field, value ] = d;
        data.append(field, value);
      })

      Rails.ajax({
        url,
        type: "POST",
        dataType: 'text/javascript',
        data,
        success: data => {
          resolve(data);
        },
        error: (_jqXHR, _textStatus, errorThrown) => {
          reject(errorThrown);
        }
      });
    });
  }

  railsGet(url){
    return new Promise((resolve, reject) => {

      Rails.ajax({
        url,
        type: "GET",
        dataType: 'text/javascript',
        success: data => {
          resolve(data);
        },
        error: (_jqXHR, _textStatus, errorThrown) => {
          reject(errorThrown);
        }
      });
    });
  }

  get isPreview() {
    return document.documentElement.hasAttribute("data-turbolinks-preview")
  }

  get unlessPreview(){
    return !this.isPreview
  }
};