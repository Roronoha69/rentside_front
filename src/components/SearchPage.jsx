import React from 'react';
import Sidebar from './Sidebar';
import QuoteSearch from './QuoteSearch';
import '../styles/searchpage.css';

export default function SearchPage() {
  return (
    <div className="search-page-layout">
      <Sidebar />
      <div className="search-content">
        <QuoteSearch />
      </div>
    </div>
  );
}
