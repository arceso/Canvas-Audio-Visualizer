import "./AudioInfo.styl";
import React from "react";

export default class AudioInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlay: false,
      track: 0,
      currentTime: 0
    };

    this.audio = null;

    this.timeCurrentRef = new React.createRef();
    this.parentRef = new React.createRef();
  }

  componentDidMount() {
    this.audio = this.props.audioRef.current;
    setInterval(this.updateTimeReaders.bind(this), 50);
  }

  updateTimeReaders() {
    this.updateTimeLine();
    this.setState({ currentTime: this.audio.currentTime });
  }

  updateTimeLine() {
    this.timeCurrentRef.current.style.transform =
      "translateX(" +
      (this.parentRef.current.offsetWidth - 30) *
        (this.audio.currentTime / this.audio.duration) +
      "px) translateY(-50%)";
  }

  onPrevClick() {
    this.setState(
      {
        track:
          this.state.track - 1 < 0
            ? this.props.data.length - 1
            : this.state.track - 1
      },
      this.changeSong.bind(this)
    );
  }

  onPlayPauseClick() {
    this.setState({ isPlay: !this.state.isPlay });
    if (this.state.isPlay) this.audio.play();
    else this.audio.pause();
  }

  onNextClick() {
    this.setState(
      {
        track:
          this.state.track + 1 == this.props.data.length
            ? 0
            : this.state.track + 1
      },
      this.changeSong.bind(this)
    );
  }

  setNextIndex() {}
  changeSong() {
    const HAVE_TO_RESUME = !this.audio.paused;
    this.setTrack();
    if (HAVE_TO_RESUME) this.audio.play();
    this.props.onSongChange(this.state.track);
  }

  setTrack() {
    this.audio.src = this.props.data[this.state.track].src;
  }

  formatToMinutes(time) {
    let minutes = (time / 60).toFixed(0),
      seconds = (time - (60 * minutes)).toString().substring(0, 2);

    if (seconds < 10) seconds = "0" + seconds.substring(0, 1);

    return minutes + ":" + seconds || "0:00";
  }

  formatToMonospace(string) {
    return string.split('').map((char, i)=><span className="c-audio-info__time-text-monospace" key={i}>{char}</span>);
  }

  render() {
    const TIME_STYLE = {
      backgroundColor: this.props.data[this.state.track].colors.accent
    };
    return (
      <div className="c-audio-info" ref={this.parentRef}>
        <p className="c-audio-info__title">
          {this.props.data[this.state.track].title}
        </p>
        <p className="c-audio-info__author">
          {this.props.data[this.state.track].subtitle}
        </p>
        <div className="c-audio-info__controls">
          <i className="material-icons" onClick={this.onPrevClick.bind(this)}>
            skip_previous
          </i>
          <i
            className="material-icons"
            onClick={this.onPlayPauseClick.bind(this)}
          >
            {this.state.isPlay ? "play_arrow" : "pause_arrow"}
          </i>
          <i className="material-icons" onClick={this.onNextClick.bind(this)}>
            skip_next
          </i>
        </div>
        <div className="c-audio-info__time-line" style={TIME_STYLE}>
          <div
            className="c-audio-info__time-line-current"
            ref={this.timeCurrentRef}
          />
        </div>
        <p className="c-audio-info__time-text">
          <div>
            {
              this.formatToMonospace(this.formatToMinutes(this.state.currentTime))
            }
          </div>
          <span className="c-audio-info__time-text-separator">/</span>
          <div>
            {
              this.formatToMonospace(this.formatToMinutes(this.audio && this.audio.duration))
            }
          </div>
        </p>
      </div>
    );
  }
}
