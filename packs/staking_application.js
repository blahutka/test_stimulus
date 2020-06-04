import { definitionsFromContext } from "stimulus/webpack-helpers"
import { Application } from "stimulus"

const application = Application.start();
const staking_context = require.context("./controllers/staking", true, /\.js$/)
application.load(definitionsFromContext(staking_context));

document.addEventListener('turbolinks:before-cache', function() {
  application.controllers.forEach(function(controller){
    if(typeof controller.teardown === 'function') {
      controller.teardown();
    }
  });
});
