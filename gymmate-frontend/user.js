class User extends Account {
  constructor(
    id,
    name,
    lastname,
    bio,
    dateOfBirth,
    sex,
    username,
    email,
    userId,
    workouts,
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
    this._userId = userId;
    this._workouts = workouts;
    this._view = UserView.create(this);
    this._render = UserRender.create(this);
    this._controller = UserController.create(this);
  }

  get userId() {
    return this._userId;
  }

  get workouts() {
    return this._workouts;
  }

  get view() {
    return this._view;
  }

  get render() {
    return this._render;
  }

  get controller() {
    return this._controller;
  }

  get fullName() {
    return `${this.name} ${this.lastname}`;
  }

  hasWorkout(program) {
    return this.workouts.some(workout => workout.program.id === program.id);
  }

  static create(json) {
    const user = new User(
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

    user._workouts = json.workouts.map(workout =>
      Workout.create(user, workout)
    );
    return user;
  }
}
//=================================================================//
class UserView {
  constructor(user) {
    this._user = user;
    this._form = UserForm.create(this);
  }

  static create(user) {
    return new UserView(user);
  }

  get user() {
    return this._user;
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
    return Elem.h2(
      { class: "pl-2 py-0 pr-0 m-0" },
      null,
      `${this.user.fullName}`
    );
  }

  workouts() {
    return Elem.h2(
      { class: "p-0 m-0" },
      null,
      Elem.icon({
        class: "fad fa-dumbbell text-primary"
      }),
      ` ${this.user.workouts.length}`
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
      Elem.span({}, null, this.workouts())
    );
  }

  __user() {
    return Elem.section(
      {
        class:
          "p-3 p-sm-5 rounded shadow row mt-1 mx-auto w-100 bg-dark text-white",
        style: "cursor:pointer;"
      },
      () => this.user.render.profile(),
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
        this.workoutsTab(),
        this.completeTab()
      )
    );
  }

  profile() {
    return Elem.div(
      {},
      null,
      this.user.accountView.profileHeader(),
      this.menu()
    );
  }

  workoutsTab() {
    return Elem.link(
      {
        class: "nav-item nav-link active",
        id: "nav-workouts-tab",
        "data-toggle": "tab",
        href: "#nav-workouts",
        role: "tab",
        "aria-controls": "nav-workouts",
        "aria-selected": "true"
      },
      null,
      Elem.icon({ class: "fad fa-dumbbell" }),
      " Workouts"
    );
  }

  completeTab() {
    return Elem.link(
      {
        class: "nav-item nav-link",
        id: "nav-complete-tab",
        "data-toggle": "tab",
        href: "#nav-complete",
        role: "tab",
        "aria-controls": "nav-complete",
        "aria-selected": "false"
      },
      null,
      Elem.icon({ class: "fas fa-flag-checkered" }),
      " Complete"
    );
  }
}

class UserRender {
  constructor(user) {
    this._user = user;
  }

  static create(user) {
    return new UserRender(user);
  }

  get user() {
    return this._user;
  }

  profile() {
    render(this.user.view.profile(), "main", true);
    this.workouts("main", false);
    createRoute(`users("${pathName[1]}")`, `/users/${this.user.userId}`);
  }

  workouts(target, remove = true) {
    if (remove) removeAll(d.querySelector(target));
    this.user.workouts.forEach(workout => {
      const __workout = workout.view.__workout();
      __workout.addEventListener("click", () => workout.render.show(target));
      render(__workout, target);
    });
    createRoute(`workouts("${pathName[1]}")`, `/workouts`);
  }

  completeWorkouts(target, remove = true) {
    if (remove) removeAll(d.querySelector(target));
    const workouts = this.user.workouts.filter(workout => workout.complete === true);
    workouts.forEach(workout => {
      const __workout = workout.view.__workout();
      __workout.addEventListener("click", () => workout.render.show(target));
       render(__workout, target);
    });
    createRoute(`workouts("${pathName[1]}")`, `/workouts/complete`);
  }
}

class UserForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new UserForm(view);
  }

  get view() {
    return this._view;
  }

  get user() {
    return this._view.user;
  }

  signup() {
    const form = this.user.accountView.form.signup();
    form.action = USERS_URL;
    form.prepend(Elem.h1({}, null, "Sign Up"));
    form.append(
      Elem.link(
        { class: "small" },
        () => render(new Trainer().view.form.signup(), "#sign_up_menu", true),
        "Sign up as a Trainer instead."
      )
    );
    return form;
  }

  editUser() {}
}

class UserController {
  constructor(user) {
    this._user = user;
  }

  static create(user) {
    return new UserController(user);
  }

  get user() {
    return this._user;
  }

  create() {}

  show() {
    this.user.render.profile();
  }

  update() {}

  delete() {}
}