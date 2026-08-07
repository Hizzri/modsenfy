import TrackCard from '../TrackCard/TrackCard';

function TrackList({ tracks }) {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}

export default TrackList;
