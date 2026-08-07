import { useEffect, useState } from 'react';
import { getRecommendedTracks, getTracks, TRACKS_PER_PAGE } from '../../api/tracksApi';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import Search from '../../components/Search/Search';
import Sort from '../../components/Sort/Sort';
import TrackList from '../../components/TrackList/TrackList';

const SEARCH_DEBOUNCE_TIME = 400;

function HomePage() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastPage, setLastPage] = useState(null);
  const [reloadNumber, setReloadNumber] = useState(0);

  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [recommendationsHaveError, setRecommendationsHaveError] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(searchInputValue.trim());
      setCurrentPage(1);
      setLastPage(null);
    }, SEARCH_DEBOUNCE_TIME);

    return () => clearTimeout(debounceTimer);
  }, [searchInputValue]);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadTracks() {
      setIsLoading(true);
      setHasError(false);

      try {
        const loadedTracks = await getTracks({
          searchQuery,
          sortMethod,
          page: currentPage,
          signal: abortController.signal,
        });

        if (loadedTracks.length === 0 && currentPage > 1) {
          setLastPage(currentPage - 1);
          setCurrentPage(currentPage - 1);
          return;
        }

        setTracks(loadedTracks);

        if (loadedTracks.length < TRACKS_PER_PAGE) {
          setLastPage(currentPage);
        }
      } catch {
        if (!abortController.signal.aborted) {
          setTracks([]);
          setHasError(true);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTracks();

    return () => abortController.abort();
  }, [searchQuery, sortMethod, currentPage, reloadNumber]);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadRecommendations() {
      setIsRecommendationsLoading(true);
      setRecommendationsHaveError(false);

      try {
        const loadedTracks = await getRecommendedTracks(abortController.signal);
        setRecommendedTracks(loadedTracks);
      } catch {
        if (!abortController.signal.aborted) {
          setRecommendationsHaveError(true);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsRecommendationsLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => abortController.abort();
  }, []);

  function handleSortChange(newSortMethod) {
    setSortMethod(newSortMethod);
    setCurrentPage(1);
    setLastPage(null);
  }

  function getSectionTitle() {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }

    if (sortMethod === 'recent') {
      return 'Recent tracks';
    }

    return 'Popular tracks';
  }

  const isPreviousDisabled = isLoading || currentPage === 1;
  const isNextDisabled =
    isLoading || tracks.length < TRACKS_PER_PAGE || (lastPage !== null && currentPage >= lastPage);

  let catalogContent;

  if (isLoading) {
    catalogContent = <Loader />;
  } else if (hasError) {
    catalogContent = (
      <div className="error-state">
        <h3 className="error-state__title">Could not load tracks</h3>
        <p className="error-state__text">Check your internet connection and try again.</p>
        <button
          className="error-state__button"
          type="button"
          onClick={() => setReloadNumber(reloadNumber + 1)}
        >
          Try again
        </button>
      </div>
    );
  } else if (tracks.length === 0) {
    catalogContent = (
      <EmptyState
        title={searchQuery ? 'Not Found' : 'No tracks found'}
        text={
          searchQuery ? `No tracks matched "${searchQuery}".` : 'Audius did not return any tracks.'
        }
      />
    );
  } else {
    catalogContent = (
      <>
        <TrackList tracks={tracks} />

        <Pagination
          currentPage={currentPage}
          isPreviousDisabled={isPreviousDisabled}
          isNextDisabled={isNextDisabled}
          onPreviousPage={() => setCurrentPage(currentPage - 1)}
          onNextPage={() => setCurrentPage(currentPage + 1)}
        />
      </>
    );
  }

  let recommendationsContent;

  if (isRecommendationsLoading) {
    recommendationsContent = <Loader />;
  } else if (recommendationsHaveError) {
    recommendationsContent = (
      <div className="recommendations-message">
        Recommended tracks could not be loaded right now.
      </div>
    );
  } else if (recommendedTracks.length === 0) {
    recommendationsContent = (
      <EmptyState title="No recommendations" text="Audius did not return recommended tracks." />
    );
  } else {
    recommendationsContent = <TrackList tracks={recommendedTracks} />;
  }

  return (
    <div className="home-page">
      <Search value={searchInputValue} onChange={setSearchInputValue} />

      <section className="player-panel">
        <div className="player-panel__top">
          <p className="player-panel__title">Music player</p>
          <Sort value={sortMethod} onChange={handleSortChange} />
        </div>

        <AudioPlayer />
      </section>

      <section className="page-section">
        <h2 className="page-section__title">{getSectionTitle()}</h2>
        {catalogContent}
      </section>

      <section className="page-section">
        <h2 className="page-section__title">Recommended</h2>
        {recommendationsContent}
      </section>
    </div>
  );
}

export default HomePage;
