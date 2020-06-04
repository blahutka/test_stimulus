import 'jasny-bootstrap/dist/js/jasny-bootstrap'; //TODO export custom with OffCanvas only http://www.jasny.net/bootstrap/customize/
import ApplicationController from '../application_controller';
import TaskHelp from './task_help/events'

const COLLAPSE_ID_NAME = 'collapse';

export default class extends ApplicationController {
  static targets = ['collapsibleSection', 'menu'];

  initialize() {
    window.FragmentsPlatform.TaskHelp = this;

    this.publishOffcanvasEvents();
    this.publishSectionEvents();
    this.subscribe(TaskHelp.selected, this.shakeButton.bind(this));
    this.subscribe(TaskHelp.opened, this.openSection.bind(this));
    this.subscribe(TaskHelp.closed, this.closeSection.bind(this));
    this.subscribe(TaskHelp.Section.opened, this.scrollToSection.bind(this));
  };

  publishOffcanvasEvents() {
    $(this.element).on('shown.bs.offcanvas', () => this.publish(TaskHelp.opened));
    $(this.element).on('hidden.bs.offcanvas', () => this.publish(TaskHelp.closed));
  }

  publishSectionEvents() {
    $(this.sections).on('shown.bs.collapse', (e) => this.publish(TaskHelp.Section.opened, { element: e.target }))
  }

  openMenu() {
    $(this.menu).offcanvas('show')
    $(this.section).collapse('show')
  };

  closeMenu(e) {
    e.preventDefault();
    $(this.menu).offcanvas('hide')
  };

  openSection() {
    $(this.section).collapse('show')
  };

  closeSection() {
    $(this.section)
      .collapse('hide')
      .collapse('dispose')
  };

  scrollToSection(ev) {
    let body = $(ev.detail.element).parent().get(0);
    if (body) body.scrollIntoView({ behavior: 'smooth', block: 'start' })
  };

  shakeButton() {
    $('i', this.helpButton).animateCss("flash");
  };

  get helpButton() {
    return $('[data-toggle="offcanvas"]').get(0)
  };

  get sections() {
    return this.collapsibleSectionTargets
  };

  get section() {
    return this.findSection(this.selected_id)[0]
  }

  get menu(){
    return this.menuTarget
  }

  set select(id) {
    this.selected_id = id;
    this.publish(TaskHelp.selected, { id: id })
  };

  findSection(id) {
    return this.sections.filter((el) => {
      if (el.id == `${COLLAPSE_ID_NAME}_${id}`) return el
    })
  };

}

$(document).click(function(e) {
  if ( $('#taskHelpMenu.in').length > 0
      && $(e.target).closest('[data-target="classification--option.helpButton"]').length === 0
      && $(e.target).closest('#taskHelpMenu').length ===0 ) {
    $('#taskHelpMenu').offcanvas('hide')
  }
});
