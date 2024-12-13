import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PropertyList from './components/PropertyLists/PropertyList';
import SearchBar from './components/SearchBar/SearchBar';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // You can filter the properties here based on search query
  };

  return (
    <div className="app">
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <PropertyList searchQuery={searchQuery} />
      <Footer />
    </div>
  );
};

export default App;