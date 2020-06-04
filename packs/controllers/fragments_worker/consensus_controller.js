import ApplicationController from '../application_controller'

export default class extends ApplicationController {
  static targets = ['tokensPending', 'tokensAccepted', 'successPercent'];

  connect() {
    if(!this.subscription) {

      this.subscription = actionCable.subscriptions.create({
        channel: 'ApplicationCable::FragmentsWorker::ConsensusUpdateChannel'
      }, {
        received: (data) => {
          this.tokensAccepted = data.tokens.accepted;
          this.tokensPending = data.tokens.pending;
        }
      })
    }
  }

  disconnect() {
    if(this.subscription){
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  set successPercent(num){
    if(this.hasSuccessPercentTarget){
      this.successPercentTarget.innerText = num;
      $(this.successPercentTarget).animateCss("flash");
    }

  }

  set tokensPending(num){
    this.tokensPendingTarget.innerText = num;
    $(this.tokensPendingTarget).animateCss("flash");
  }

  set tokensAccepted(num) {
    this.tokensAcceptedTarget.innerText = num;
    $(this.tokensAcceptedTarget).animateCss("flash");
  }
}