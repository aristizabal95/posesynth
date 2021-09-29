const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const enableWebcamButton = document.getElementById("webcamButton");
const canvas = document.getElementById("output");
const osc = new OSC();
osc.open();
var ctx = undefined;
// TODO
var detector = undefined;
const score_thresh = 0.3;

tf.loadGraphModel("public/movenet-thunder/model.json").then((loadedModel) => {
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    poseDetection
        .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
        .then((detectorObject) => {
            detector = detectorObject;
            if (canvas.getContext) {
                ctx = canvas.getContext("2d");
            }
            demosSection.classList.remove("invisible");
        });
});

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
    if (!detector) {
        return;
    }

    // Hide the button once clicked.
    event.target.classList.add("removed");

    // getUsermedia parameters to force video but not audio.
    const constraints = {
        video: true,
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

// Placeholder function for next step.
function predictWebcam() {
    detector.estimatePoses(video).then((preds) => {
        pose = new Pose(preds[0]["keypoints"]);
        pose.draw(score_thresh, ctx);
    });
    window.requestAnimationFrame(predictWebcam);
}