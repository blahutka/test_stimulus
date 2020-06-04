/* eslint no-console:0 */
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import animateCss from '../utils/animate'
import '../utils/environment.js.erb'

import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"
const ActionCable = require('actioncable')
window.actionCable = ActionCable.createConsumer();
const application = Application.start();

const fragments_worker = require.context("./controllers/fragments_worker", true, /\.js$/);
const tags = require.context("./controllers/tags", true, /\.js$/);

application.load(definitionsFromContext(fragments_worker));
application.load(definitionsFromContext(tags));

// Add another context
// const sample = require.context("./sample", true, /\.js$/)
// application.load(definitionsFromContext(sample))

window.FragmentsPlatform = window.FragmentsPlatform || {};
$.fn.extend(animateCss);
