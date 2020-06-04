import ApplicationController from '../application_controller';

export default class extends ApplicationController {
  static targets = ['errorMessage', 'retryButton'];

  initialize() {
    this.accounts = [];
  };

  get onSuccessRedirectTo() {
    return this.data.get('onSuccessRedirectTo')
  }

  get account() {
    return JSON.parse(this.data.get('account'))
  }

  get eth_address() {
    return this.account.eth_address
  }

  set errorMessage(txt) {
    this.errorMessageTarget.innerHTML = txt;
  }

  isInstalled(ev) {
    let check = ev.detail.controller;

    if (typeof window.web3 !== 'undefined') {
      check.success()
      check.next()

    } else {
      check.failure()
      this.errorMessage = check.getError
    }
  }

  isConnected(ev) {
    let check = ev.detail.controller;
    let self = this;

    window.web3.eth.getAccounts(function (err, accs) {

      if (err != null) {
        check.failure();
        self.errorMessage = check.getError

      } else {
        self.accounts = accs;

        check.success();
        check.next()
      }
    })

  }

  hasAccounts(ev){
    let check = ev.detail.controller;

    if(this.accounts.length == 0){
      check.failure();
      this.errorMessage = check.getError

    } else {
      check.success();
      check.next()
    }
  }

  hasActiveAccount(ev){
    let check = ev.detail.controller;
    let match = this.accounts.filter((acc) => { if (acc === this.eth_address) return acc });

    if(match.length == 0){
      check.failure();
      this.errorMessage = check.getError;

    } else {
      check.success();
      this.redirectTo()
    }
  }

  disableRetryButton = (msg) => {
    let { retryButtonTarget } = this;

    $(retryButtonTarget)
      .addClass('disabled')
      .text(msg);
  };

  redirectTo() {
    this.delay(this.disableRetryButton, 200, 'Loading..');
    this.delay(() => {
      location.href = this.onSuccessRedirectTo;
    }, 200);
  }

}
