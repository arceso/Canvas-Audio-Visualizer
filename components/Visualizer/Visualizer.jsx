import "./Visualizer.styl";
import AudioToCanvas from "./AudioToCanvas.js";
import AudioInfo from "./AudioInfo/AudioInfo";
import React from "react";

export default class Visualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.canvasRef = React.createRef();
    this.audioRef = React.createRef();
    this.coverRef = React.createRef();

    this.visualizer = new AudioToCanvas(
      this.audioRef,
      this.canvasRef,
      this.coverRef,
      this.parentRef,
      this.props.data[0].colors,
      this.props.circleRadius,
      this.props.shake,
      this.props.normalizer,
      this.props.coverVibrates,
      this.props.curves,
      this.props.innerCurves,
      this.props.curvesOffset
    );
  }

  canvasRef;
  audioRef;

  componentDidMount() {
    this.visualizer.init();
    window.addEventListener("resize", this.onResize.bind(this));
    this.setState({ audioRef: this.audioRef });
  }

  onResize() {
    this.visualizer.onResize();
  }

  onCanvasClick() {
    const audio = this.audioRef.current;
    audio.paused ? audio.play() : audio.pause();
  }

  onSongChange(index) {
    this.visualizer.setColors(this.props.data[index].colors);
  }

  render() {
    return (
      <div className="visualizer">
        <div
          className="visualizer__cover"
          ref={this.coverRef}
          onClick={this.onCanvasClick.bind(this)}
        >
          {this.props.children}
        </div>
        <canvas
          className="visualizer__canvas"
          ref={this.canvasRef}
          onClick={this.onCanvasClick.bind(this)}
        />
        <audio
          className="visualizer__audio"
          controls
          ref={this.audioRef}
          src={this.props.data[0].src}
        />
        <AudioInfo
          audioRef={this.audioRef}
          data={this.props.data}
          onSongChange={this.onSongChange.bind(this)}
        />
      </div>
    );
  }
}




