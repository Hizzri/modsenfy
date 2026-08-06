import TrackCard from '../TrackCard/TrackCard';

function TrackList({ tracks }) {
  const trackCards = [];

  for (let index = 0; index < tracks.length; index += 1) {
    const track = tracks[index];

    trackCards.push(<TrackCard key={track.id} track={track} />);
  }

  return <div className="track-list">{trackCards}</div>;
}

export default TrackList;
