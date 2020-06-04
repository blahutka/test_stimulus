import ApplicationController from '../../application_controller';

let icons = {
  check: 'fa-question text-warning',
  loading: 'fa-spinner fa-spin',
  success: 'fa-check text-success',
  failure: 'fa-times text-danger'
};

let check_pool = [];
let current_check = 0;

export default class extends ApplicationController {
  static targets = ['status'];

  initialize() {
    check_pool.push(this);

    if (this.autoStart === 'true') {
      this.loading();

      Promise.resolve().then(() => {
        this.start()
      })
    }
  }

  disconnect(){
    check_pool = [];
    current_check = 0;
    this.ready();
  }

  get getError(){
    return this.element.getAttribute('data-error-text')
  }

  get iconClasses() {
    return Object.values(icons).join(' ')
  }

  get autoStart() {
    return this.element.getAttribute('data-auto-start')
  }

  next() {
    current_check += 1;
    let next_check = check_pool[current_check];

    if (next_check) {
      next_check.loading();
      this.delay(next_check.start.bind(next_check), 400)
    }
  }

  start() {
    this.publish('start', { controller: this })
  }

  loading() {
    this.changeStatus(this.statusTarget, icons.loading)
  }

  success() {
    this.changeStatus(this.statusTarget, icons.success)
  }

  failure() {
    this.changeStatus(this.statusTarget, icons.failure)
  }

  ready() {
    this.changeStatus(this.statusTarget, icons.check)
  }

  get allDone() {
    return check_pool.length == (current_check + 1)
  }

  changeStatus(target, newStatus, message = null) {
    $(target)
      .removeClass(this.iconClasses)
      .addClass(newStatus);

    if (message) {
      console.log(message)
    }
  }
}