import animateCss from '../utils/animate'
import '../utils/environment.js.erb'
import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start();

const requester = require.context("./controllers/requester", true, /\.js$/);
const tags = require.context("./controllers/tags", true, /\.js$/);

application.load(definitionsFromContext(requester));
application.load(definitionsFromContext(tags));

$.fn.extend(animateCss);
