import { useEffect, useState } from 'react';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import Search from '../../components/Search/Search';
import Sort from '../../components/Sort/Sort';
import TrackList from '../../components/TrackList/TrackList';
import {
  getAudiusErrorMessage,
  getTracks,
  isCanceledRequest,
  TRACKS_PER_PAGE,
} from '../../api/tracksApi';

const SEARCH_DEBOUNCE_TIME = 400;

function HomePage() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [lastPage, setLastPage] = useState(null);
  const [reloadNumber, setReloadNumber] = useState(0);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const preparedSearchQuery = searchInputValue.trim();

      setSearchQuery(preparedSearchQuery);
      setCurrentPage(1);
      setLastPage(null);
    }, SEARCH_DEBOUNCE_TIME);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchInputValue]);

  useEffect(() => {
    const abortController = new AbortController();

    let isRequestActive = true;

    async function loadTracks() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const loadedTracks = await getTracks({
          searchQuery,
          sortMethod,
          page: currentPage,
          limit: TRACKS_PER_PAGE,
          signal: abortController.signal,
        });

        if (!isRequestActive) {
          return;
        }

        if (loadedTracks.length === 0 && currentPage > 1) {
          const previousPage = currentPage - 1;

          setLastPage(previousPage);
          setCurrentPage(previousPage);

          return;
        }

        setTracks(loadedTracks);

        if (loadedTracks.length < TRACKS_PER_PAGE) {
          setLastPage(currentPage);
        }
      } catch (error) {
        if (!isRequestActive) {
          return;
        }

        if (isCanceledRequest(error)) {
          return;
        }

        const readableErrorMessage = getAudiusErrorMessage(error);

        setTracks([]);
        setErrorMessage(readableErrorMessage);
      } finally {
        if (isRequestActive) {
          setIsLoading(false);
        }
      }
    }

    loadTracks();

    return () => {
      isRequestActive = false;
      abortController.abort();
    };
  }, [searchQuery, sortMethod, currentPage, reloadNumber]);

  function handleSearchChange(newSearchValue) {
    setSearchInputValue(newSearchValue);
  }

  function handleSortChange(newSortMethod) {
    setSortMethod(newSortMethod);
    setCurrentPage(1);
    setLastPage(null);
  }

  function handlePreviousPage() {
    const previousPage = currentPage - 1;

    if (previousPage >= 1) {
      setCurrentPage(previousPage);
    }
  }

  function handleNextPage() {
    const nextPage = currentPage + 1;

    setCurrentPage(nextPage);
  }

  function handleRetry() {
    const nextReloadNumber = reloadNumber + 1;

    setReloadNumber(nextReloadNumber);
  }

  function getSectionTitle() {
    if (searchQuery !== '') {
      return `Search results for "${searchQuery}"`;
    }

    if (sortMethod === 'recent') {
      return 'Recent tracks';
    }

    return 'Popular tracks';
  }

  let isPreviousButtonDisabled = false;

  if (isLoading || currentPage === 1) {
    isPreviousButtonDisabled = true;
  }

  let isNextButtonDisabled = false;

  if (isLoading) {
    isNextButtonDisabled = true;
  }

  if (tracks.length < TRACKS_PER_PAGE) {
    isNextButtonDisabled = true;
  }

  if (lastPage !== null && currentPage >= lastPage) {
    isNextButtonDisabled = true;
  }

  let catalogContent;

  if (isLoading) {
    catalogContent = <Loader />;
  } else if (errorMessage) {
    catalogContent = (
      <div className="error-state">
        <h3 className="error-state__title">Could not load tracks</h3>

        <p className="error-state__text">{errorMessage}</p>

        <button className="error-state__button" type="button" onClick={handleRetry}>
          Try again
        </button>
      </div>
    );
  } else if (tracks.length === 0) {
    let emptyTitle = 'No tracks found';
    let emptyText = 'Audius did not return any tracks.';

    if (searchQuery !== '') {
      emptyTitle = 'Not Found';
      emptyText = `No tracks matched "${searchQuery}".`;
    }

    catalogContent = <EmptyState title={emptyTitle} text={emptyText} />;
  } else {
    catalogContent = (
      <>
        <TrackList tracks={tracks} />

        <Pagination
          currentPage={currentPage}
          isPreviousDisabled={isPreviousButtonDisabled}
          isNextDisabled={isNextButtonDisabled}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </>
    );
  }

  return (
    <div className="home-page">
      <Search value={searchInputValue} onChange={handleSearchChange} />

      <section className="player-panel">
        <div className="player-panel__top">
          <p className="player-panel__title">Select a track to listen to</p>

          <Sort value={sortMethod} onChange={handleSortChange} />
        </div>

        <div className="player-placeholder">
          The audio player will appear after selecting a track
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-section__title">{getSectionTitle()}</h2>

        {catalogContent}
      </section>

      <section className="page-section">
        <h2 className="page-section__title">Recommended</h2>

        <div className="recommended-placeholder">
          Recommended tracks will be connected to Audius in a separate stage.
        </div>
      </section>
    </div>
  );
}

export default HomePage;
