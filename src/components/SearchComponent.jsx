import { useState } from "react";

import React from 'react'

const SearchComponent = ({ handleSubmit }) => {

    const [search, setSearch] = useState(''); // Search query state

    return (
        <div className="search-container">
            <h2>Procure por suas músicas favoritas</h2>
            <form onSubmit={(e) => { handleSubmit(e, search); setSearch(''); }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Digite o nome da música..."
                />
                <button>Procurar</button>
            </form>
        </div>
    )
}

export default SearchComponent



