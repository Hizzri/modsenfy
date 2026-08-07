import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import EmptyState from '../../components/EmptyState/EmptyState';
import TrackList from '../../components/TrackList/TrackList';
import { pauseTrack } from '../../store/playerSlice';

function FavoritesPage() {
  const dispatch = useDispatch();
  const favoriteTracks = useSelector((state) => state.favorites.tracks);

  useEffect(() => {
    if (favoriteTracks.length === 0) {
      dispatch(pauseTrack());
    }
  }, [favoriteTracks.length, dispatch]);

  if (favoriteTracks.length === 0) {
    return (
      <div className="favorites-page">
        <EmptyState
          title="No favorite tracks"
          text="Add tracks to favorites on Home and they will appear here."
        />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <section className="player-panel">
        <div className="player-panel__top">
          <p className="player-panel__title">Music player</p>
        </div>

        <AudioPlayer />
      </section>

      <section className="page-section">
        <h2 className="page-section__title">Your favorites</h2>
        <TrackList tracks={favoriteTracks} />
      </section>
    </div>
  );
}

export default FavoritesPage;
