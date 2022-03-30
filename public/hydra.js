class HydraStateMachine {
  constructor(pose) {
    this.pose = pose;
    this.current_state = 0;
    this.prev_center_x = -1;
    this.prev_lwrist_y = -1;
    this.prev_rwrist_y = -1;
  }

  set_hydra(hydra) {
    this.hydra = hydra;
    this.render_aux_outs();
  }

  render_aux_outs() {
    this.hydra.synth.osc(9, 0.1, 2).mult(shape(4)).out(this.hydra.synth.o1);
    this.hydra.synth.s1.initCam();
  }

  update() {
    var center_x =
      (this.pose.left_shoulder["x"] + this.pose.right_shoulder["x"]) / 2;
    var lwrist_y = this.pose.left_wrist["y"];
    var rwrist_y = this.pose.left_wrist["y"];

    if (center_x > 0.5 && this.prev_center_x <= 0.5) {
      this.current_state = this.current_state + 1;
      console.log(this.current_state);
    }
    if (center_x <= 0.5 && this.prev_center_x > 0.5) {
      this.current_state = this.current_state - 1;
      console.log(this.current_state);
    }

    if (lwrist_y > 0.5 && this.prev_lwrist_y <= 0.5) {
      this.current_state = this.current_state + 1;
      console.log(this.current_state);
    }
    if (lwrist_y <= 0.5 && this.prev_lwrist_y > 0.5) {
      this.current_state = this.current_state - 1;
      console.log(this.current_state);
    }

    if (rwrist_y > 0.5 && this.prev_rwrist_y <= 0.5) {
      this.current_state = this.current_state + 1;
      console.log(this.current_state);
    }
    if (rwrist_y <= 0.5 && this.prev_rwrist_y > 0.5) {
      this.current_state = this.current_state - 1;
      console.log(this.current_state);
    }

    this.prev_center_x = center_x;
    this.prev_lwrist_y = lwrist_y;
    this.prev_rwrist_y = rwrist_y;

    this.render_state();
  }

  render_state() {
    switch (this.current_state) {
      case 0:
        this.state0();
        break;
      case 1:
        this.state1();
        break;
      case 2:
        this.state2();
        break;
      default:
        this.default_state();
    }
    if (this.current_state === 0) {
      this.state0();
    }
  }

  state0() {
    this.hydra.synth
      .src(this.hydra.synth.o0)
      .modulate(this.hydra.synth.voronoi(), 0.01)
      .blend(this.hydra.synth.o1, this.pose.left_hip["y"] / 5)
      .out();
  }

  state1() {
    var src = this.hydra.synth.src;
    var o0 = this.hydra.synth.o0;
    var o1 = this.hydra.synth.o1;
    var nose_x = () => Math.max(1.01, this.pose.nose["x"] * 2);

    src(o0)
      .modulateHue(src(o0).scale(nose_x), 1)
      .layer(src(o1).luma(0.2, 1e-6))
      .out();
  }

  state2() {
    var hosc = this.hydra.synth.osc;
    var noise = this.hydra.synth.noise;
    var src = this.hydra.synth.src;
    var o0 = this.hydra.synth.o0;
    var o1 = this.hydra.synth.o1;
    var s1 = this.hydra.synth.s1;

    hosc(5, 0.1, 0.8)
      .modulate(s1, 0.6)
      .modulate(noise(0.5), 0.5)
      .modulateScrollY(hosc(2).modulate(hosc(20).rotate(), 0.21))
      .scale(1.05)
      .blend(o1, 0.2)
      .modulate(src(o0).scale(1.01))
      .modulate(src(o0).scale(2))
      .modulate(src(o0).scale(1.01))
      .modulate(src(o0).scale(1.01))
      .out();
  }

  default_state() {
    this.hydra.synth.src(this.hydra.synth.o1).out();
  }
}
