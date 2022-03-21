class Pose {
  constructor(canvas) {
    this.nose = this.default_point();
    this.left_eye = this.default_point();
    this.right_eye = this.default_point();
    this.left_ear = this.default_point();
    this.right_ear = this.default_point();
    this.left_shoulder = this.default_point();
    this.right_shoulder = this.default_point();
    this.left_elbow = this.default_point();
    this.right_elbow = this.default_point();
    this.left_wrist = this.default_point();
    this.right_wrist = this.default_point();
    this.left_hip = this.default_point();
    this.right_hip = this.default_point();
    this.left_knee = this.default_point();
    this.right_knee = this.default_point();
    this.left_ankle = this.default_point();
    this.right_ankle = this.default_point();

    this.canvas = canvas;
    this.detector = undefined;
    this.create_detector();
  }

  update_points(points) {
    this.nose = this.build_point(points[0]);
    this.left_eye = this.build_point(points[1]);
    this.right_eye = this.build_point(points[2]);
    this.left_ear = this.build_point(points[3]);
    this.right_ear = this.build_point(points[4]);
    this.left_shoulder = this.build_point(points[5]);
    this.right_shoulder = this.build_point(points[6]);
    this.left_elbow = this.build_point(points[7]);
    this.right_elbow = this.build_point(points[8]);
    this.left_wrist = this.build_point(points[9]);
    this.right_wrist = this.build_point(points[10]);
    this.left_hip = this.build_point(points[11]);
    this.right_hip = this.build_point(points[12]);
    this.left_knee = this.build_point(points[13]);
    this.right_knee = this.build_point(points[14]);
    this.left_ankle = this.build_point(points[15]);
    this.right_ankle = this.build_point(points[16]);
  }

  default_point() {
    return [0.0, 0.0, 0.0];
  }

  create_detector() {
    tf.loadGraphModel("public/movenet-thunder/model.json").then(
      (loadedModel) => {
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        };
        poseDetection
          .createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
          .then((detectorObject) => {
            this.detector = detectorObject;
            if (this.canvas.getContext) {
              ctx = canvas.getContext("2d");
            }
          });
      }
    );
  }

  build_point(point, alpha = 0.5) {
    const max_val = 256;
    const r = 120;
    const g = 120;
    const b = 120;
    const fillstyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    point["color"] = fillstyle;
    return point;
  }

  filter_score(score_thresh) {
    var filtered = {};
    for (const prop in this) {
      if (this[prop]["score"] > score_thresh) {
        filtered[prop] = this[prop];
      }
    }
    return filtered;
  }

  draw(score_thresh, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const points = this.filter_score(score_thresh);
    for (const landmark in points) {
      const point = points[landmark];
      this.drawPoint(point, ctx, 5, 2);
      const x = point["x"];
      const y = point["y"];
      const score = point["score"];
      const message = new OSC.Message(`/${landmark}`, x, y, score);
      osc.send(message);
    }
  }

  drawPoint(point, ctx, radius, strokeWidth) {
    const x = point["x"] * canvas.width;
    const y = point["y"] * canvas.height;
    ctx.fillStyle = point["color"];
    var circle = new Path2D();
    circle.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = "#FFF";
    ctx.stroke(circle);
  }
}
