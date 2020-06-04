// import { default as Web3 } from 'web3';
import { Controller } from 'stimulus';
import { fragmentsStacking } from 'fragments-network-dapp-stakes'

export default class extends Controller {
  static targets = ['container', 'radioStakeValueIncrease', 'stakeValueIncrease', 'bonus', 'stakeAnimation'];

  initialize() {
    this.contractAddress = '0xf34e493ec048cf1013a8d5e14906b34b04c59bf3';
    this.bonusTarget.innerText = 0;
    this.setDefaultStakeVal();
  }

  connect(){
    let { detectMetamask, getAccounts, contractAddress, containerTarget, formatters, stakeAnimationTarget } = this;
    let self = this;

    detectMetamask();

    getAccounts(function (accounts) {
      let userAccount = accounts.filter((account) => { if(account === self.eth_address) return account})[0];

     let staking = fragmentsStacking.load(contractAddress, userAccount, containerTarget, formatters);

      staking.then(function () {
        self.setStakeAnimation(containerTarget, stakeAnimationTarget);
      })
    });
  };

  disconnect() {
    fragmentsStacking.unload().then(function (result) {
      //console.log('unload', result)
    })
  }

  get eth_address(){
    return this.data.get('ethAddress')
  }

  set increaseStakeValue(number) {
    let { stakeValueIncreaseTarget } = this;

    stakeValueIncreaseTarget.value = number;
  }

  handleIncreaseStakeValue = (event) => {
    let { value: radioIncreaseValue } = event.currentTarget;
    let bonusPercent = this.getBonusPercent(event.currentTarget);

    this.renderBonusPercent(bonusPercent);
    this.increaseStakeValue = radioIncreaseValue;
  };

  handleWithdrawStakes = (event) => {
    let { stakingContract } = this;

    fragmentsStacking.fetchBalance().then(function (balanceNum) {
      fragmentsStacking.decreaseStake(balanceNum).then(function (val) {
        console.log('withdraw:done')
      })
    })
  };

  getAccounts = (callBack) => {
    window.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        Turbolinks.visit('/worker/account/stakes/metamask')
      }
      return callBack(accs)
    });
  };

  getBonusPercent(el){
    return el.getAttribute("data-stake-percent")
  }

  renderBonusPercent(number){
    this.bonusTarget.innerText = number;
  }

  setDefaultStakeVal = () => {
    let self = this;
    self.radioStakeValueIncreaseTargets.forEach((el, i) => {

      if (el.getAttribute("checked") == 'checked') {
        let { value: radioIncreaseValue } = el;
        let bonusPercent = this.getBonusPercent(el);

        self.renderBonusPercent(bonusPercent);
        self.increaseStakeValue = radioIncreaseValue;
      }

    })
  };

  setStakeAnimation = (container, target) => {
    $(target).animateCss("bounceIn");

    $(container).on('balanceChanged', function(event) {
      $(target).animateCss("bounceIn")
    });
  };

  formatters = {
    historyRecord: (typeName, time, value) => {
      const padToTwo = (value) => {
        if (("" + value).length < 2) {
          return "0" + value
        }
        return "" + value
      }
      const nowFormated = `${time.getFullYear()}-${padToTwo(time.getMonth() + 1)}-${padToTwo(time.getDate())} ${padToTwo(time.getHours())}:${padToTwo(time.getMinutes())}`
      const html = `<div><span>${typeName}</span> <span>${value}</span> <span>${nowFormated}</span> <div/>`
      return html
    }
  }

  detectMetamask = () => {
    if (typeof window.web3 == 'undefined') {
      Turbolinks.visit('/worker/account/stakes/metamask')
    }
  }

}
