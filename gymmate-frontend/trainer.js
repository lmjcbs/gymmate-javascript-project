class Trainer extends Account {
  constructor(
    id,
    name,
    lastname,
    bio,
    dateOfBirth,
    sex,
    username,
    email,
    trainerId,
    programs,
    accountView
  ) {
    super(
      id,
      name,
      lastname,
      bio,
      dateOfBirth,
      sex,
      username,
      email,
      accountView
    );
    this._trainerId = trainerId;
    this.programs = programs;
    this._view = TrainerView.create(this);
    this._controller = TrainerController.create(this);
    this._render = TrainerRender.create(this);
  }
  get trainerId() {
    return this._trainerId;
  }

  get fullName() {
    return `${this.name} ${this.lastname}`;
  }

  set trainerId(trainerId) {
    this._trainerId = trainerId;
  }

  get view() {
    return this._view;
  }

  get controller() {
    return this._controller;
  }

  get render() {
    return this._render;
  }

  static create(json) {
    const trainer = new Trainer(
      json.account.id,
      json.account.name,
      json.account.lastname,
      json.account.bio,
      json.account.date_of_birth,
      json.account.sex,
      json.account.username,
      json.account.email,
      json.account.userable_id,
      []
    );
    trainer.programs = json.programs.map(program =>
      Program.create(trainer, program)
    );
    return trainer;
  }
}

//===============================================================================//

class TrainerView {
  constructor(trainer) {
    this._trainer = trainer;
    this._form = TrainerForm.create(this);
  }

  static create(trainer) {
    return new TrainerView(trainer);
  }

  get trainer() {
    return this._trainer;
  }

  get form() {
    return this._form;
  }

  profilePic() {
    return Elem.icon({
      class: "fas fa-user-circle text-shadow",
      style: "font-size:50px;"
    });
  }

  name() {
    return Elem.h2({ class: "pl-2 py-0 pr-0 m-0" }, null, `${this.trainer.fullName}`);
  }

  routines() {
    return Elem.h2(
      { class: "p-0 m-0" },
      null,
      Elem.icon({
        class: "fas fa-dumbbell text-primary"
      }),
      ` ${this.trainer.programs.length}`
    );
  }

  info() {
    return Elem.span(
      { class: "d-flex align-items-center justify-content-between w-100" },
      null,
      Elem.span(
        { class: "d-flex align-items-center" },
        null,
        this.profilePic(),
        this.name()
      ),
      Elem.span({}, null, this.routines())
    );
  }

  __trainer() {
    return Elem.section(
      {
        class:
          "d-flex p-3 p-sm-5 rounded shadow row mt-1 mx-auto w-100 bg-dark text-white align-items-center",
        style: "cursor:pointer;"
      },
      () => this.trainer.render.profile(),
      this.info()
    );
  }

  menu() {
    return Elem.nav(
      {},
      null,
      Elem.div(
        { class: "nav nav-tabs", id: "nav-tab", role: "tablist" },
        null,
        this.routinesTab()
      )
    );
  }

  profile() {
    return Elem.div(
      {},
      null,
      this.trainer.accountView.profileHeader(),
      this.menu()
    );
  }

  routinesTab() {
    return Elem.link(
      {
        class: "nav-item nav-link active",
        id: "nav-routines-tab",
        "data-toggle": "tab",
        href: "#nav-routines",
        role: "tab",
        "aria-controls": "nav-routines",
        "aria-selected": "true"
      },
      null,
      Elem.icon({
        class: "fas fa-dumbbell"
      }),
      " Routines"
    );
  }

  picturesTab() {
    return Elem.link(
      {
        class: "nav-item nav-link",
        id: "nav-pictures-tab",
        "data-toggle": "tab",
        href: "#nav-pictures",
        role: "tab",
        "aria-controls": "nav-pictures",
        "aria-selected": "false"
      },
      null,
      "Pictures"
    );
  }

  videosTab() {
    return Elem.link(
      {
        class: "nav-item nav-link",
        id: "nav-video-tab",
        "data-toggle": "tab",
        href: "#nav-video",
        role: "tab",
        "aria-controls": "nav-video",
        "aria-selected": "false"
      },
      null,
      "Video"
    );
  }
}

//===============================================================================//

class TrainerForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new TrainerForm(view);
  }

  get view() {
    return this._view;
  }

  get trainer() {
    return this._view.trainer;
  }

  signup() {
    const form = this.trainer.accountView.form.signup();
    form.action = TRAINERS_URL;
    form.prepend(Elem.h1({}, null, "Sign Up As a Trainer"));
    form.append(
      Elem.link(
        { class: "small" },
        () =>
          render(new User().view.form.signup(), `#${form.parentNode.id}`, true),
        "Sign up as a Gym Goer instead."
      )
    );
    return form;
  }
}

//===============================================================================//

class TrainerRender {
  constructor(trainer) {
    this._trainer = trainer;
  }

  static create(trainer) {
    return new TrainerRender(trainer);
  }

  get trainer() {
    return this._trainer;
  }

  profile() {
    render(this.trainer.view.profile(), "main", true);
    this.programs("main", false);
    createRoute(
      `trainers("${pathName[1]}")`,
      `/trainers/${this.trainer.trainerId}`
    );
  }

  programs(target, remove = true) {
    if (remove) removeAll(d.querySelector(target));
    this.trainer.programs.forEach(program => {
      const __program = program.view.__program();
      __program.addEventListener("click", () => program.render.show(target));
      render(__program, target);
    });
    createRoute(`routines("${pathName[1]}")`, `/routines`);
  }
}

//===============================================================================//

class TrainerController {
  constructor(trainer) {
    this._trainer = trainer;
  }

  static create(trainer) {
    return new TrainerController(trainer);
  }

  get trainer() {
    return this._trainer;
  }

  create() {}

  show() {
    return this.trainer.render.profile();
  }

  update() {}

  delete() {}
}
