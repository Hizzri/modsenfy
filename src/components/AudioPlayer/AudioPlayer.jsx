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
    if (currentTrack === null) {
      return;
    }

    const audioPlayerComponent = audioPlayerReference.current;

    if (audioPlayerComponent === null) {
      return;
    }

    const audioElement = audioPlayerComponent.audio.current;

    if (audioElement === null) {
      return;
    }

    if (isPlaying) {
      const playPromise = audioElement.play();

      if (playPromise) {
        playPromise.catch(() => {
          dispatch(setIsPlaying(false));
        });
      }

      return;
    }

    audioElement.pause();
  }, [currentTrack, isPlaying, dispatch]);

  function handlePlayerPlay() {
    if (!isPlaying) {
      dispatch(setIsPlaying(true));
    }
  }

  function handlePlayerPause() {
    if (isPlaying) {
      dispatch(setIsPlaying(false));
    }
  }

  function handlePlayerEnded() {
    dispatch(setIsPlaying(false));
  }

  function handlePlayerError() {
    dispatch(setIsPlaying(false));
  }

  if (currentTrack === null) {
    return (
      <div className="audio-player-placeholder">
        The audio player will appear after selecting a track
      </div>
    );
  }

  let artworkContent;

  if (currentTrack.artworkUrl) {
    artworkContent = (
      <img
        className="audio-player__image"
        src={currentTrack.artworkUrl}
        alt={`Cover for ${currentTrack.title}`}
      />
    );
  } else {
    artworkContent = (
      <div className="audio-player__image-placeholder" aria-hidden="true">
        ♫
      </div>
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
        onPause={handlePlayerPause}
        onEnded={handlePlayerEnded}
        onError={handlePlayerError}
        onPlayError={handlePlayerError}
      />
    </div>
  );
}

export default AudioPlayer;
