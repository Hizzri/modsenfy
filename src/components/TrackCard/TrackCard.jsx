import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../store/favoritesSlice';
import { pauseTrack, playTrack } from '../../store/playerSlice';

function TrackCard({ track }) {
  const dispatch = useDispatch();

  const currentTrack = useSelector((state) => state.player.currentTrack);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const favoriteTracks = useSelector((state) => state.favorites.tracks);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentTrackPlaying = isCurrentTrack && isPlaying;
  const isFavorite = favoriteTracks.some((favoriteTrack) => favoriteTrack.id === track.id);

  function handlePlayButtonClick() {
    if (!track.isPlayable) {
      return;
    }

    if (isCurrentTrackPlaying) {
      dispatch(pauseTrack());
    } else {
      dispatch(playTrack(track));
    }
  }

  function handleFavoriteButtonClick() {
    dispatch(toggleFavorite(track));
  }

  let artworkContent = (
    <div className="track-card__image-placeholder" aria-hidden="true">
      ♫
    </div>
  );

  if (track.artworkUrl) {
    artworkContent = (
      <img
        className="track-card__image"
        src={track.artworkUrl}
        alt={`Cover for ${track.title}`}
        loading="lazy"
      />
    );
  }

  return (
    <article className={isCurrentTrack ? 'track-card track-card--active' : 'track-card'}>
      <div className="track-card__image-wrapper">
        {artworkContent}

        {!track.isPlayable && <span className="track-card__status">Unavailable</span>}

        <button
          className={
            isFavorite
              ? 'track-card__favorite-button track-card__favorite-button--active'
              : 'track-card__favorite-button'
          }
          type="button"
          aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${track.title}`}
          onClick={handleFavoriteButtonClick}
        >
          <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
        </button>

        <button
          className="track-card__play-button"
          type="button"
          aria-label={`${isCurrentTrackPlaying ? 'Pause' : 'Play'} ${track.title}`}
          disabled={!track.isPlayable}
          onClick={handlePlayButtonClick}
        >
          <span aria-hidden="true">{isCurrentTrackPlaying ? 'Ⅱ' : '▶'}</span>
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
