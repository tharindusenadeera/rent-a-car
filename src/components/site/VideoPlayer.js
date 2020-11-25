import React, { Component, Fragment } from "react";
import videojs from "video.js";
import Modal from "react-modal";
import { modalStylesVideo } from "../../consts/modalStyles";

class Player extends Component {
  componentDidMount() {
    this.player = videojs(
      this.videoNode,
      this.props,
      function onPlayerReady() {}
    );
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div data-vjs-player>
        <video ref={node => (this.videoNode = node)} className="video-js" />
      </div>
    );
  }
}

const VideoPlayer = props => {
  const { showPlayer, _toggleVideoPlayer } = props;
  return (
    <Modal
      className="MainVideo"
      isOpen={showPlayer}
      onRequestClose={() => _toggleVideoPlayer()}
      contentLabel="Modal"
      shouldCloseOnOverlayClick={true}
      style={modalStylesVideo}
    >
      <Player
        {...{
          autoplay: true,
          controls: true,
          sources: [
            {
              src:
                "https://cdn.rydecars.com/video/Ryde+Commercial+_+V10.0+_+High+Res+_+07.10.2017.mp4",
              type: "video/mp4"
            }
          ]
        }}
      />
    </Modal>
  );
};

export default VideoPlayer;
