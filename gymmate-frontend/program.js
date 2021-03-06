class Program {
  constructor(
    id,
    title,
    description,
    video,
    exercises,
    trainer,
    createdAt,
    updatedAt
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._video = video;
    this._exercises = exercises;
    this._trainer = trainer;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._view = ProgramView.create(this);
    this._controller = ProgramController.create(this);
    this._render = ProgramRender.create(this);
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get video() {
    return this._video;
  }

  get trainer() {
    return this._trainer;
  }

  get exercises() {
    return this._exercises;
  }

  get createdAt() {
    return new Date(this._createdAt).toLocaleDateString('en-US', {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  get updatedAt() {
    return new Date(this._updatedAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  get controller() {
    return this._controller;
  }

  get view() {
    return this._view;
  }

  get render() {
    return this._render;
  }

  set exercises(exercises) {
    this._exercises = exercises;
  }

  duration() {
    const allDurations = this.exercises.map(exercise =>
      parseInt(exercise.duration())
    );
    return allDurations.reduce((memo, val) => memo + val, 0);
  }

  calories() {
    const allCalories = this.exercises.map(exercise =>
      parseInt(exercise.calories)
    );
    return allCalories.reduce((memo, val) => memo + val, 0);
  }

  static create(trainer, json) {
    const program = new Program(
      json.id,
      json.title,
      json.description,
      json.video,
      [],
      trainer,
      json.created_at,
      json.updated_at
    );
    program._exercises = json.exercises.map(exercise =>
      Exercise.create(program, exercise)
    );

    return program;
  }
}

//===============================================================================//

class ProgramView {
  constructor(program) {
    this._program = program;
    this._form = ProgramForm.create(this);
  }

  static create(program) {
    return new ProgramView(program);
  }

  get program() {
    return this._program;
  }

  get form() {
    return this._form;
  }

  title() {
    return Elem.span(
      {
        class:
          "col-xl-9 col-lg-12 display-4 order-2 order-sm-2 order-md-2 order-lg-1 p-0",
        style: "font-size: 40px;"
      },
      null,
      Elem.icon({ class: "fas fa-dumbbell text-primary" }),
      ` ${this.program.title}`
    );
  }

  description() {
    return Elem.p(
      { class: "display-4 text-justify", style: "font-size:20px" },
      null,
      this.program.description
    );
  }

  options() {
    return isOwner(this.program.trainer)
      ? this.program.trainer.accountView.options(
          this.program,
          "#main_container"
        )
      : "";
  }

  duration() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-clock" }),
      ` ${this.program.duration()} mins`
    );
  }

  calories() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-fire" }),
      ` ${this.program.calories()}`
    );
  }

  totalExercises() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-running" }),
      ` ${this.program.exercises.length}`
    );
  }

  info() {
    return Elem.p(
      { class: "d-flex w-100 justify-content-between mt-4 order-2" },
      null,
      this.totalExercises(),
      this.duration(),
      this.calories()
    );
  }

  addWorkoutBtn() {
    return isUser()
      ? Elem.span(
          { class: "text-right col-xl-3 order-2 p-0 m-0" },
          null,
          isUser() && !currentUser.hasWorkout(this.program)
            ? this.form.addWorkout()
            : ""
        )
      : "";
  }

  __program() {
    return Elem.section(
      {
        class:
          "p-3 p-sm-5 rounded shadow row mt-1 mx-auto w-100 bg-dark text-white",
        style: "cursor:pointer;"
      },
      null,
      this.timestamps(),
      this.title(),
      this.options(),
      this.addWorkoutBtn(),
      this.info()
    );
  }

  exercisesCount() {
    return Elem.span(
      {
        class:
          "d-flex display-4 text-primary my-2 p-4 bg-white shadow rounded text-center"
      },
      null,
      this.program.exercises.length === 0
        ? "This program has no exercises yet."
        : `${this.program.exercises.length} ${
            this.program.exercises.length === 1 ? " Exercise" : " Exercises"
          }`
    );
  }

  timestamps() {
    return Elem.p(
      {class: "d-flex justify-content-between w-100", style:"font-size: 14px;"},
      null,
      Elem.span({}, null, `Created on ${this.program.createdAt}`),
      Elem.span({}, null, `Updated on ${this.program.updatedAt}`)
    );
  }

  show() {
    const sectionClassName =
      "text-left p-3 p-sm-5 rounded shadow bg-dark text-white";

    return Elem.section(
      {
        class: sectionClassName,
        id: `program_${this.program.id}`
      },
      null,
      this.timestamps(),
      Elem.div({ class: "row" }, null, this.title(), this.options(), this.info()),
      Subtitle.new(`By ${this.program.trainer.fullName}`),
      this.description(),
      Elem.video(this.program.video),
      this.addExerciseBtn(),
      isUser() ? this.form.addWorkout() : ""
    );
  }

  programFormRow(form) {
    return Elem.div(
      { class: "row" },
      null,
      Elem.div(
        { class: "col-md" },
        null,
        Elem.section(
          { class: "text-left p-3 p-sm-5 rounded shadow" },
          null,
          form
        )
      )
    );
  }

  addExerciseBtn() {
    return isOwner(this.program.trainer)
      ? Elem.button(
          { id: "add_new_exercise", class: "btn btn-primary" },
          () => {
            this.program.render.__program("#main_container", true);
            this.program.render.newExerciseRow("#main_container", false);
          },
          "Add New Exercise"
        )
      : "";
  }
}

//===============================================================================//

class ProgramForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new ProgramForm(view);
  }

  get view() {
    return this._view;
  }

  get program() {
    return this._view.program;
  }

  _form(id, method, action, handleSubmit) {
    return Elem.form(
      {
        id: id,
        method: method,
        action: action,
        class: "needs-validation",
        novalidate: true
      },
      handleSubmit,
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "program[title]",
          placeholder: "Enter a title for your program...",
          class: "form-control pl-5 rounded-pill",
          value: this.program.title || "",
          "data-alert": "Enter a title.",
          required: true
        }),
        Elem.icon({ class: "fas fa-heading" })
      ),
      fileUploader("program[video]", this.program.video),
      FormGroup.new(
        Elem.textArea(
          {
            class: "form-control pl-5",
            name: "program[description]",
            placeholder: "Enter a brief description for your program...",
            maxlength: 500,
            "data-alert": "Enter a description. Max 140 characters.",
            required: true
          },
          null,
          this.program.description || ""
        ),
        Elem.icon({ class: "fas fa-quote-left" })
      ),
      Elem.input(
        {
          id: "create_program",
          name: "submit",
          type: "submit",
          class:
            "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
        },
        () => window.event.stopPropagation()
      )
    );
  }

  newProgram() {
    const form = this._form("new_program", "POST", PROGRAMS_URL, json =>
      this.program.controller.createProgram(json)
    );
    form.prepend(
      Elem.h1(
        { class: "text-primary mb-4" },
        null,
        Elem.icon({ class: "fas fa-plus-square" }),
        " Create Routine"
      )
    );
    form.submit.value = "Create Routine";
    return form;
  }

  edit() {
    const form = this._form(
      `edit_program_${this.program.id}`,
      "PATCH",
      `${PROGRAMS_URL}/${this.program.id}`,
      json => this.program.controller.update(json)
    );
    form.prepend(
      Elem.h1(
        { class: "text-primary mb-4" },
        null,
        Elem.icon({ class: "fas fa-edit" }),
        " Edit Routine"
      )
    );
    form.submit.value = "Update Routine";
    return form;
  }

  addWorkout() {
    return Elem.form(
      {
        id: `new_workout_${this.program.id}`,
        action: WORKOUTS_URL,
        method: "POST"
      },
      json => new Workout().controller.__create(json),
      Elem.input({
        type: "hidden",
        name: "program_id",
        value: this.program.id
      }),
      Elem.input(
        {
          type: "submit",
          class: "btn btn-primary shadow",
          id: `start_routine_button_${this.program.id}`,
          value: `Add to workouts`
        },
        () => window.event.stopPropagation()
      )
    );
  }
}

//===============================================================================//

class ProgramRender {
  constructor(program) {
    this._program = program;
  }

  static create(program) {
    return new ProgramRender(program);
  }

  get program() {
    return this._program;
  }

  newExerciseRow(target, remove = true) {
    new Exercise(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.program
    ).render.newExerciseRow(target, remove);
  }

  newProgramRow() {
    render(
      this.program.view.programFormRow(this.program.view.form.newProgram()),
      "#main_container",
      false
    );
  }

  editRow(target) {
    render(
      this.program.view.programFormRow(this.program.view.form.edit()),
      target,
      true
    );
  }

  __program(target, remove = false) {
    const program = this.program.view.__program();
    program.addEventListener("click", () => this.show(target));
    render(program, target, remove);
  }

  all(target) {
    removeAll(target);
    this.program.exercises.forEach(exercise =>
      exercise.render.__exercise(target)
    );
  }

  show(target) {
    render(this.program.view.show(), target, true);
    render(this.program.view.exercisesCount(), target);
    this.program.exercises.forEach(exercise =>
      exercise.render.__exercise(target)
    );
    createRoute(`routines("${pathName[1]}")`, `/routines/${this.program.id}`);
  }
}

//===============================================================================//

class ProgramController {
  constructor(program) {
    this._program = program;
  }

  static create(program) {
    return new ProgramController(program);
  }

  get program() {
    return this._program;
  }

  createProgram(json) {
    const trainer = Object.assign(new Trainer(), currentUser);
    const program = Program.create(trainer, json);
    trainer.programs.push(program);
    currentUser = trainer;
    program.render.__program("#main_container", true);
    program.render.newExerciseRow("#main_container", false);
  }

  update(json) {
    if (isTrainer && isOwner(currentUser)) {
      const trainer = Object.assign(new Trainer(), currentUser);
      const program = Object.assign(
        new Program(),
        Program.create(trainer, json)
      );
      Object.assign(
        trainer.programs.find(p => p.id === program.id),
        program
      );
      program.render.show("#main_container");
      currentUser = trainer;
    }
  }

  delete(target) {
    new Fetch(
      null,
      "DELETE",
      `${PROGRAMS_URL}/${this.program.id}`,
      json => {
        const trainer = Object.assign(new Trainer(), currentUser);
        currentUser.programs = currentUser.programs.filter(
          program => program.id !== json.id
        );
        currentUser = trainer;
        trainer.render.programs(target, true);
      },
      target
    ).submit();
  }
}
