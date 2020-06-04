import ApplicationController from '../../application_controller'

export default class extends ApplicationController {
  static targets = ['form']

  initialize(){
  }

  submit(e) {
    Rails.fire(this.formTarget, 'submit')
  }
}