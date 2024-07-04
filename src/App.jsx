import { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import SongResult from "./components/SongResult";
import './App.css';


const urlStd = 'https://api.spotify.com/v1/';
const urlToken = 'https://accounts.spotify.com/api/token';


function App() {

  const [token, setToken] = useState('') // Token state

  // Function for request a token 
  async function requestAccessToken(url) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': '7915d847a030465bbaaab9569e7accbc',
          'client_secret': '514cbd7755d04eac9c5b192aed532a06'
        })
      })

      if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.status}`)
      }

      const access = await res.json()
      setToken(access.access_token)
    }

    catch (e) {
      console.error(e)
    }
  }

  // call requestAccessToken() with the page load
  useEffect(() => {
    const requestTokenUrl = urlToken;

    requestAccessToken(requestTokenUrl);
  }, [])

  const [search, setSearch] = useState(''); // Search query state

  const [tracks, setTracks] = useState([]); // State for receive a array of the track object response

  // Function for fetch data for Spotify API
  async function fetchSpotifyData(url) {

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data = await response.json();

      setTracks(data.tracks.items)
      
    }

    catch (error) {
      console.error('Error: ', error);
    }
  }

  // Function for handling submit form search and call fetchSpotifyData()
  async function handleSubmit(e) {
    e.preventDefault();

    if (!search) return;

    const searchWithQueryURL = `${urlStd}search?q=${search}&type=track&limit=10`;

    fetchSpotifyData(searchWithQueryURL)

    setSearch('');
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Ja<span>mmm</span>ing</h1>
      </div>

      <div className="search-container">
        <h2>Procure por suas músicas favoritas</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Digite o nome da música..."
          />
          <button>Procurar</button>
        </form>
      </div>

      <div className="search-result-container">

        <div className="search-result">
          {tracks.length > 0 && tracks.map((track) => <SongResult key={track.id} track={track} />)}
        </div>

        <div className="my-repository">
          <div className="repository-container">
            <button>Save repository</button>

            <div className='song-container'>
              <div className="song-card">
                <div className="song-details">
                  <h3>Song's name</h3>
                  <p>Artist's name</p>
                </div>
                <IoIosAddCircleOutline className="add-icon" />
              </div>
              <hr />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default App
