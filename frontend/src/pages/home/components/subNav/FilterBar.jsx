// FilterBar.js
import React from 'react';
import filtro from '../../assets/filtro.png';
import lupa from '../../assets/lupa.png';

const FilterBar = ({ handleSearch, searchTerm, setModalFilterIsOpen, role }) => {
  return (
    <div className="subNav">
      {role === "ADMIN" && (
        <h1 style={{ padding: "1rem", color: "white" }}>ADMIN</h1>
      )}

      <div className="lupaSearch">
        <div className="lupa"><img src={lupa} alt="Search" /></div>
        <input
          type="search"
          placeholder="Search.."
          onChange={handleSearch}
          value={searchTerm}
          title="Search"
        />
        {role === "ADMIN" && (
          <div className="filter" onClick={() => setModalFilterIsOpen(true)}>
            <img src={filtro} alt="filter" width={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;