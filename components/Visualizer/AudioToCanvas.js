import { paper, Size } from "paper";

export default class AudioToCanvas {
  constructor(
    media,
    canvas,
    cover,
    parent,
    colors,
    circleSize,
    vibration,
    customNormalize,
    coverVibrates
  ) {
    this.media = media;
    this.canvas = canvas;
    this.cover = cover;
    this.parent = parent;
    this.colors = colors;
    this.circleSize = circleSize;
    this.normalizer = customNormalize ? customNormalize : this.normalize;
    this.coverVibrates = coverVibrates;

    this.vibration = vibration[0] ? vibration : [vibration, vibration];
    this.BUFFER_LENGTH = null;
    this.DATA_ARRAY = null;
    this.analyser = null;
    this.DEGS_PER_LINE = 180 / 5;
  }

  init() {
    //Refresh to current to avoid next.js
    this.parent = !this.parent ? window : this.parent.current;
    this.media = this.media.current;
    this.canvas = this.canvas.current;
    this.cover = this.cover.current;

    this.media.load();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    let mediaCtx = new (window.AudioContext || window.webkitAudioContext)();

    this.analyser = mediaCtx.createAnalyser();

    // Sets the source to the media element & adds the analyser.
    mediaCtx.createMediaElementSource(this.media).connect(this.analyser);

    // links the analyser output to the speakers.
    this.analyser.connect(mediaCtx.destination);

    //ammount of waveSamples (?)
    this.analyser.fftSize = 2 ** 5;

    //Maybe gotta look into not loading paper to the whole window.
    paper.install(window);
    paper.setup(this.canvas);

    this.BUFFER_LENGTH = this.analyser.frequencyBinCount;
    this.DATA_ARRAY = new Uint8Array(this.BUFFER_LENGTH);

    this.cover.style.width = this.circleSize * 2 + "px";
    this.cover.style.height = this.circleSize * 2 + "px";

    this.renderFrame();
    console.log('V:', this.BUFFER_LENGTH)
  }

  renderFrame = () => {
    requestAnimationFrame(this.renderFrame);
    this.analyser.getByteFrequencyData(this.DATA_ARRAY);
    project.activeLayer.removeChildren();

    let lastBisection = view.center.add([this.circleSize, 0]),
      actualRotation = -this.DEGS_PER_LINE / 2,
      arrayCurves = new Array(2).fill().map(() => new paper.Path()),
      circle = new paper.Shape.Circle(view.center, this.circleSize);

    for (let i = 0; i <= this.BUFFER_LENGTH-6; i++) {
      if (i % 2) actualRotation += this.DEGS_PER_LINE;
      arrayCurves[i % 2].moveTo(lastBisection);
      arrayCurves[i % 2].quadraticCurveTo(
        this.getEndOfLine(
          this.normalizer(this.DATA_ARRAY[i], !(i % 2)),
          actualRotation
        ),
        lastBisection = this.getEndOfCurve(actualRotation)
      );
    }

    for (let i = 0; i < arrayCurves.length; i++) {
      let curvesClone = arrayCurves[i].clone();
      curvesClone.scale(1, -1, view.center.add([this.circleSize, 0]));
      arrayCurves[i].join(curvesClone);
      arrayCurves[i].closePath();
      arrayCurves[i].rotate(90, view.center);
      arrayCurves[i].sendToBack();
      arrayCurves[i].fillColor = this.colors[i];
    }

    arrayCurves[arrayCurves.length - 1].style = {
      shadowColor: "rgba(21, 21, 21, .3)",
      shadowBlur: 2,
      shadowOffset: [0, 5]
    };

    circle.clone().fillColor = this.colors[0];

    let shadowWidth = this.DATA_ARRAY[Math.ceil(this.DATA_ARRAY.length / 2)];
    if (shadowWidth <= 1) shadowWidth = 1;

    let circleShadow = new paper.Shape.Circle(
      view.center,
      25 * Math.log(2 * shadowWidth)
    );
    
    circleShadow.sendToBack();
    circleShadow.fillColor = {
      origin: circleShadow.position,
      destination: circleShadow.bounds.rightCenter,
      gradient: {
        stops: [[this.colors[1], shadowWidth / 300], ["transparent", 1]],
        radial: true
      }
    };

    circle.bringToFront();

    circle.style = {
      fillColor: "#fff",
      shadowColor: "rgba(21, 21, 21, .3)",
      shadowBlur: 2,
      shadowOffset: [0, 5]
    };

    if (this.vibration && this.DATA_ARRAY.every(level => level > 50)) {
      const randomX =
          this.vibration[0] - this.getRandomInt(0, this.vibration[0] * 2),
        randomY =
          this.vibration[1] - this.getRandomInt(0, this.vibration[1] * 2);
      circle.position = [view.center.x + randomX, view.center.y + randomY];
      if (this.coverVibrates) {
        this.cover.style.marginLeft = randomX + "px";
        this.cover.style.marginTop = randomY + "px";
      }
    } else if (this.coverVibrates) {
      this.cover.style.marginLeft = "0px";
      this.cover.style.marginTop = "0px";
    }
  }

  onResize() {
    view.viewSize = new Size(window.innerWidth, window.innerHeight);
  }

  normalize(current, inner) {
    return Math.pow(current, 1 / (inner ? 2.25 : 2)) * 8;
  }

  getEndOfLine(size, degrees) {
    return view.center.add([
      (size + this.circleSize) * this.cos(degrees),
      (size + this.circleSize) * this.sin(degrees)
    ]);
  }

  getEndOfCurve(currentAngle) {
    return view.center.add([
      this.cos(this.bisection(currentAngle)) * this.circleSize,
      this.sin(this.bisection(currentAngle)) * this.circleSize
    ]);
  }

  bisection(currentAngle) {
    return currentAngle + this.DEGS_PER_LINE / 2;
  }

  sin(number) {
    return this.roundNumber(Math.sin(this.toRadians(number)));
  }

  cos(number) {
    return this.roundNumber(Math.cos(this.toRadians(number)));
  }

  toRadians(degree) {
    return degree * (Math.PI / 180);
  }

  roundNumber(number, decimals = 5) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
