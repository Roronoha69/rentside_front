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
        {/* <NavLink to="/devis-fenetre" activeclassname="active">Devis fenêtre/porte</NavLink> */}
        {/* <NavLink to="/devis-sol" activeclassname="active">Devis sol</NavLink> */}
        <NavLink to="/devis-garage" activeclassname="active">Devis garage</NavLink>
        {/* <NavLink to="/devis-concurent" activeclassname="active">Devis de concurent</NavLink> */}
        <NavLink to="/devis-garage" activeclassname="active">Voir tous les devis</NavLink>

      </nav>
    </aside>
  );
}
