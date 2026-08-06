import { useDispatch, useSelector } from 'react-redux';
import { pauseTrack, playTrack } from '../../store/playerSlice';

function TrackCard({ track }) {
  const dispatch = useDispatch();

  const currentTrack = useSelector((state) => state.player.currentTrack);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  let isCurrentTrack = false;

  if (currentTrack !== null) {
    if (currentTrack.id === track.id) {
      isCurrentTrack = true;
    }
  }

  let isCurrentTrackPlaying = false;

  if (isCurrentTrack && isPlaying) {
    isCurrentTrackPlaying = true;
  }

  function handlePlayButtonClick() {
    if (!track.isPlayable) {
      return;
    }

    if (isCurrentTrackPlaying) {
      dispatch(pauseTrack());
      return;
    }

    dispatch(playTrack(track));
  }

  let artworkContent;

  if (track.artworkUrl) {
    artworkContent = (
      <img
        className="track-card__image"
        src={track.artworkUrl}
        alt={`Cover for ${track.title}`}
        loading="lazy"
      />
    );
  } else {
    artworkContent = (
      <div className="track-card__image-placeholder" aria-hidden="true">
        ♫
      </div>
    );
  }

  let unavailableMessage = null;

  if (!track.isPlayable) {
    unavailableMessage = <span className="track-card__status">Unavailable</span>;
  }

  let playButtonText = 'Play';
  let playButtonIcon = '▶';

  if (isCurrentTrackPlaying) {
    playButtonText = 'Pause';
    playButtonIcon = 'Ⅱ';
  }

  let trackCardClassName = 'track-card';

  if (isCurrentTrack) {
    trackCardClassName = 'track-card track-card--active';
  }

  return (
    <article className={trackCardClassName}>
      <div className="track-card__image-wrapper">
        {artworkContent}
        {unavailableMessage}

        <button
          className="track-card__play-button"
          type="button"
          aria-label={`${playButtonText} ${track.title}`}
          disabled={!track.isPlayable}
          onClick={handlePlayButtonClick}
        >
          <span aria-hidden="true">{playButtonIcon}</span>
        </button>
      </div>

      <div className="track-card__information">
        <h3 className="track-card__title" title={track.title}>
          {track.title}
        </h3>

        <p className="track-card__artist" title={track.artistName}>
          {track.artistName}
        </p>
      </div>
    </article>
  );
}

export default TrackCard;
