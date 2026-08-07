import { useEffect, useRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import { useDispatch, useSelector } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { setIsPlaying } from '../../store/playerSlice';
import './AudioPlayer.scss';

const TRACK_SWITCH_DELAY = 100;
const PAUSE_CONFIRM_DELAY = 180;

function AudioPlayer() {
  const dispatch = useDispatch();
  const audioPlayerReference = useRef(null);
  const previousTrackIdReference = useRef(null);
  const pauseTimerReference = useRef(null);

  const currentTrack = useSelector((state) => state.player.currentTrack);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const currentTrackId = currentTrack?.id || null;

  useEffect(() => {
    const audioElement = audioPlayerReference.current?.audio?.current;

    if (!audioElement || !currentTrackId) {
      return;
    }

    const previousTrackId = previousTrackIdReference.current;
    const hasTrackChanged = previousTrackId !== null && previousTrackId !== currentTrackId;

    previousTrackIdReference.current = currentTrackId;

    if (!isPlaying) {
      audioElement.pause();
      return;
    }

    let playDelay = 0;

    if (hasTrackChanged) {
      playDelay = TRACK_SWITCH_DELAY;
    }

    const playTimer = window.setTimeout(() => {
      const latestAudioElement = audioPlayerReference.current?.audio?.current;

      if (!latestAudioElement) {
        return;
      }

      const playPromise = latestAudioElement.play();

      if (playPromise) {
        playPromise.catch(() => {
          dispatch(setIsPlaying(false));
        });
      }
    }, playDelay);

    return () => {
      window.clearTimeout(playTimer);
    };
  }, [currentTrackId, isPlaying, dispatch]);

  useEffect(() => {
    return () => {
      if (pauseTimerReference.current !== null) {
        window.clearTimeout(pauseTimerReference.current);
      }
    };
  }, []);

  function handlePlayerPlay() {
    if (pauseTimerReference.current !== null) {
      window.clearTimeout(pauseTimerReference.current);
      pauseTimerReference.current = null;
    }

    if (!isPlaying) {
      dispatch(setIsPlaying(true));
    }
  }

  function handlePlayerPause() {
    if (pauseTimerReference.current !== null) {
      window.clearTimeout(pauseTimerReference.current);
    }

    pauseTimerReference.current = window.setTimeout(() => {
      const audioElement = audioPlayerReference.current?.audio?.current;

      if (!audioElement) {
        return;
      }

      if (audioElement.paused) {
        dispatch(setIsPlaying(false));
      }

      pauseTimerReference.current = null;
    }, PAUSE_CONFIRM_DELAY);
  }

  function handlePlayerEnded() {
    dispatch(setIsPlaying(false));
  }

  function handlePlayerError() {
    dispatch(setIsPlaying(false));
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
        autoPlayAfterSrcChange={false}
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
