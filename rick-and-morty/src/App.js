import React, { useState } from 'react';
import './App.css';
import CharacterFilter from './components/CharacterFilter';
import CharacterList from './components/CharacterList';
import LoadMoreButton from './components/LoadMoreButton';
import Footer from './components/Footer';

function App() {
  const [gender, setGender] = useState('all');
  const [page, setPage] = useState(1);

  const handleFilterChange = (newGender) => {
    setGender(newGender);
    setPage(1); // Reset to the first page
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <CharacterFilter gender={gender} onFilterChange={handleFilterChange} />
      <CharacterList gender={gender} page={page} />
      <LoadMoreButton onLoadMore={handleLoadMore} />
      <Footer />
    </div>
  );
}

export default App;
