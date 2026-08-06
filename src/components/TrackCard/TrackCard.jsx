function TrackCard({ track }) {
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

  return (
    <article className="track-card">
      <div className="track-card__image-wrapper">
        {artworkContent}
        {unavailableMessage}
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
