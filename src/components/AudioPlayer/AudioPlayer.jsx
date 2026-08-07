import { useEffect, useRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import { useDispatch, useSelector } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { setIsPlaying } from '../../store/playerSlice';
import './AudioPlayer.scss';

function AudioPlayer() {
  const dispatch = useDispatch();
  const audioPlayerReference = useRef(null);

  const currentTrack = useSelector((state) => state.player.currentTrack);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  useEffect(() => {
    const audioElement = audioPlayerReference.current?.audio?.current;

    if (!audioElement) {
      return;
    }

    if (isPlaying) {
      audioElement.play().catch(() => dispatch(setIsPlaying(false)));
    } else {
      audioElement.pause();
    }
  }, [currentTrack, isPlaying, dispatch]);

  function handlePlayerPlay() {
    if (!isPlaying) {
      dispatch(setIsPlaying(true));
    }
  }

  function handlePlayerStop() {
    if (isPlaying) {
      dispatch(setIsPlaying(false));
    }
  }

  if (!currentTrack) {
    return (
      <div className="audio-player-placeholder">
        The audio player will appear after selecting a track
      </div>
    );
  }

  let artworkContent = (
    <div className="audio-player__image-placeholder" aria-hidden="true">
      ♫
    </div>
  );

  if (currentTrack.artworkUrl) {
    artworkContent = (
      <img
        className="audio-player__image"
        src={currentTrack.artworkUrl}
        alt={`Cover for ${currentTrack.title}`}
      />
    );
  }

  return (
    <div className="audio-player">
      <div className="audio-player__track">
        {artworkContent}

        <div className="audio-player__information">
          <p className="audio-player__label">Now playing</p>

          <p className="audio-player__title" title={currentTrack.title}>
            {currentTrack.title}
          </p>

          <p className="audio-player__artist" title={currentTrack.artistName}>
            {currentTrack.artistName}
          </p>
        </div>
      </div>

      <H5AudioPlayer
        ref={audioPlayerReference}
        className="audio-player__controls"
        src={currentTrack.streamUrl}
        preload="metadata"
        autoPlayAfterSrcChange={true}
        showJumpControls={false}
        customAdditionalControls={[]}
        onPlay={handlePlayerPlay}
        onPause={handlePlayerStop}
        onEnded={handlePlayerStop}
        onError={handlePlayerStop}
        onPlayError={handlePlayerStop}
      />
    </div>
  );
}

export default AudioPlayer;
