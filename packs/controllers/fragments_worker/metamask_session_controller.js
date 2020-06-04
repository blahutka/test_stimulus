import ApplicationController from '../application_controller'
import { getInfo, requestUserSignature } from 'fragments-network-dapp-identity'

// window.getInfo = getInfo;

export default class extends ApplicationController {
  static targets = ['form', 'signature', 'ethAddress', 'submitButton'];

  initialize() {
    window.web3.eth.getAccounts((err, accs) => {
      let account = accs[0];
      this.ethAddressTarget.setAttribute('value', account)

      if (this.unlessPreview) {
        this.disableSubmit();
        this.railsGet(`/worker/metamask/check/${account}`)
      }
    });

    web3.currentProvider.publicConfigStore.on('update', (e) => {
      let currentAddress = $(this.ethAddressTarget).val();

      if (e.selectedAddress != currentAddress) {
       this.disableSubmit();
       location.href = '/worker/metamask/new'
      }
    });
  }

  submit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const authenticity_token = $('#authenticity_token').val();
    const self = this;

    requestUserSignature(authenticity_token).then(function (data) {
      if (data.signature) {
        self.signatureTarget.setAttribute('value', data.signature);
        self.formTarget.submit()
      }
    })
  }

  disableSubmit(){
    $(this.submitButtonTarget).addClass('disabled').val('Reloading...');
  }
}