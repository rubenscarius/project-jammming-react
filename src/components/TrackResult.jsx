import { IoIosAddCircleOutline } from "react-icons/io";

const TrackResult = ({ track, onAddTrackToPlaylist }) => {

    function handleAddToPlaylist(track) {
        onAddTrackToPlaylist(track);
    }

    return (
        <div className='song-container'>
            <div className="song-card">
                <div className="song-details">
                    <h3>{track.name}</h3> {/*condition for rendering array content*/}
                    <p>{track.artists[0].name}</p>
                </div>
                <IoIosAddCircleOutline className="add-icon" onClick={() => handleAddToPlaylist(track)} />
            </div>
            <hr />
        </div>
    )
}

export default TrackResult