const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const enableWebcamButton = document.getElementById("webcamButton");
const canvas = document.getElementById("output");
const hydra_canvas = document.getElementById("hydra");
const osc = new OSC();
var hydra = new Hydra({ canvas: hydra_canvas });
osc.open();
var ctx = undefined;
const score_thresh = 0.3;
const pose = new Pose(canvas);
const hydra_machine = new HydraStateMachine(pose);
demosSection.classList.remove("invisible");

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start classification.
function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!pose.detector) {
    return;
  }

  // Hide the button once clicked.
  event.target.classList.add("removed");

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true,
  };

  video.onloadedmetadata = () => {
    vw = video.videoWidth / 2;
    vh = video.videoHeight / 2;
    video.width = vw;
    video.height = vh;
    canvas.width = vw;
    canvas.height = vh;
    hydra_canvas.width = vw;
    hydra_canvas.height = vh;
    hydra = new Hydra({
      canvas: hydra_canvas,
      height: vh,
      width: vw,
    });
    hydra_machine.set_hydra(hydra);
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

function drawHydra() {
  calc_angle = () => {
    x_diff = pose.left_shoulder["x"] - pose.right_shoulder["x"];
    y_diff = pose.left_shoulder["y"] - pose.right_shoulder["y"];
    angle = Math.tanh(y_diff / x_diff);
    return angle;
  };

  hydra.synth
    .osc(5, 0.1)
    .modulate(noise(8), 0.22)
    .diff(o0)
    .modulateScrollY(
      hydra.synth.osc(2).modulate(hydra.synth.osc().rotate(), 0.11)
    )
    .scale(0.72)
    .color(0.99, 1.014, 1)
    .scale(() => pose.nose["x"])
    .rotate(calc_angle, 0)
    .out(o0);
}

// Placeholder function for next step.
function predictWebcam() {
  pose.detector.estimatePoses(video).then((preds) => {
    const kp = preds[0]["keypoints"];
    const normal_kp = poseDetection.calculators.keypointsToNormalizedKeypoints(
      kp,
      { width: video.videoWidth, height: video.videoHeight }
    );
    pose.update_points(normal_kp);
    pose.draw(score_thresh, ctx);
    hydra_machine.update();
  });
  window.requestAnimationFrame(predictWebcam);
}
