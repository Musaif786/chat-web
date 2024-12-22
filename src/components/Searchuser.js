import React from 'react'
import "../Css/Home.css";

const Searchuser = ({ search, handleSearch }) => {
    return (
        <>
            <h3 className="no_conv">Search a user to start the conversation</h3>
            <div className="user_searchbox" style={{ height: '100px', marginTop: '0px', paddingTop: '0px' }}>
                <input
                    type="text"
                    placeholder="example: musaif"
                    value={search}
                    onChange={handleSearch}
                    className="search-bar"
                />
            </div>
        </>
    )
}

export default Searchuser