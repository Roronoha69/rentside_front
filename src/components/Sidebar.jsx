import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';
import logo from '../assets/rentside.png';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Rentside Logo" />
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Créer un devis</h3>
          {/* <NavLink to="/devis-fenetre" activeclassname="active">Fenêtres & Portes</NavLink> */}
          <NavLink to="/devis-garage" activeclassname="active">Portes de garage</NavLink>
          <NavLink to="/devis-sol" activeclassname="active">Sols</NavLink>
        </div>
        
        <div className="nav-section">
          <h3>Gestion</h3>
          <NavLink to="/recherche" activeclassname="active">Rechercher un devis</NavLink>
        </div>
      </nav>
    </aside>
  );
}
