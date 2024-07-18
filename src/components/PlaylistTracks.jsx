import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect } from "react";


function PlaylistTracks({ track }) {

    return (
        <div className='song-container'>
            <div className="song-card">
                <div className="song-details">
                    <h3>{track.name}</h3> {/*condition for rendering array content*/}
                    <p>{track.artists[0].name}</p>
                </div>
                <IoIosCloseCircleOutline />
            </div>
            <hr />
        </div>
    )
}

export default PlaylistTracks