import { useState, useEffect } from "react";
import TrackResult from "./components/TrackResult";
import SearchComponent from "./components/SearchComponent";
import PlaylistTracks from "./components/PlaylistTracks";
import './App.css';

const clientId = "7915d847a030465bbaaab9569e7accbc";

const urlStd = 'https://api.spotify.com/v1/';
const urlToken = 'https://accounts.spotify.com/api/token';


function App() {

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const [token, setToken] = useState('') // Token state

  const [userID, setUserID] = useState('') // Get state for user ID

  const [tracks, setTracks] = useState([]); // State for receive a array of the track object response

  const [playlistTracks, setPlaylistTracks] = useState([]); // State for add tracks to user playlist

  const [playlistName, setPlaylistName] = useState(''); // Playlist name get in the input

  const [playlistID, setPlaylistID] = useState(''); // Set playlist ID

  // Verified if user is logged in Spotify. If not, call functions to get access 
  // useEffect is used for render just once
  useEffect(() => {
    if (code) {
      async function getAccessToken(clientId, code) {
        const verifier = localStorage.getItem("verifier");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", "https://jammming-rubens.netlify.app/callback");
        params.append("code_verifier", verifier);

        const result = await fetch(urlToken, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
        });

        const { access_token } = await result.json();
        setToken(access_token);
      }
      getAccessToken(clientId, code);
    } else {
      redirectToAuthCodeFlow(clientId);
    }
  }, [code, clientId]);

  // Authenticate de user code
  async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128); // Call and generate the verifier code
    const challenge = await generateCodeChallenge(verifier); // Call the generate challenge code for validation

    localStorage.setItem("verifier", verifier); // Storage the varifier code on local satorage

    const params = new URLSearchParams(); // Search params for authentication
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email");
    params.append("scope", "playlist-modify-public playlist-modify-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Generate the verifier code
  function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // generate de Code challenge for authentication
  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  // Get profile data necessary for get user ID
  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    const userData = await result.json();
    setUserID(userData.id);
  }

  useEffect(() => {
    if (token != '') {
      fetchProfile(token);
    }
  }, [token]);

  // Function for fetch data for Spotify API
  async function fetchSpotifyData(url) {

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }

    });

    const data = await response.json();

    setTracks(data.tracks.items)
  }

  // Function for create Playlist
  async function createPlaylist(playlistName, userID, token) {

    const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: playlistName })
    });

    const data = await response.json();
    const playlistID = await data.id;
    setPlaylistID(playlistID);

  };

  // Add items in new Playlist
  async function addItemsToPlaylist() {
    const playlistTrackUri = playlistTracks.map((item) => item.uri);
    console.log(playlistTrackUri);
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'uris': playlistTrackUri })
    })

    if (response.ok) {
      const data = await response.json();
      console.log('Itens adicionados com sucesso:', data);
    } else {
      console.error('Erro ao adicionar itens:', response.status, await response.text());
    }

    setPlaylistName('');
    setPlaylistID('');
    setPlaylistTracks([]);
    
  }

  // Function for get input value
  async function handleInputGetPlaylistName(event) {
    setPlaylistName(event.target.value);
  }

  // Call the createPlaylist function - button handler
  async function handleButton(playlistName, userID, token) {
    if (playlistName !== '') {
      createPlaylist(playlistName, userID, token);
    } else {
      alert('Nome da playlist vazio. Dê um nome para sua playlist.');
    }
  }

  // Call addItemsToPlaylist - button handler
  async function handleSavePlaylistButton() {
    if (playlistName !== '') {
      addItemsToPlaylist();
    } else {
      alert('Não existe playlist criada.');
    }
  }

  // Function for handling submit form search and call fetchSpotifyData()
  async function handleSubmit(e, search) {
    e.preventDefault();

    if (!search) return;

    const searchWithQueryURL = `${urlStd}search?q=${search}&type=track&limit=10`;

    fetchSpotifyData(searchWithQueryURL);
  }

  // Function for add tracks to tracksPlaylist
  async function addTrackToPlaylist(track) {
    setPlaylistTracks((prevTracks) => [...prevTracks, track])
  };

  async function removeTrackFromPlaylist(id) {
    const newTracks = [...playlistTracks];
    const filteredTracks = newTracks.filter((track) => track.id !== id ? track : null);
    setPlaylistTracks(filteredTracks);
  };

  // Compare tracks add to playlist to tracks results and return not match tracks
  const resultCompare = tracks.filter(item => {return !playlistTracks.some(item2 => item2.id == item.id)} )

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Ja<span>mmm</span>ing</h1>
      </div>

      <SearchComponent handleSubmit={handleSubmit} />

      <div className="search-result-container">

        <div className="search-result">
          <h2>Resultados</h2>
          {tracks.length > 0 && resultCompare.map((track) => <TrackResult key={track.id} track={track} onAddTrackToPlaylist={addTrackToPlaylist} /> )}
        </div>

        <div className="my-repository">
          <div className="repository-container">
            <div className="create-playlist">
              <input type="text" className="playlist-name" value={playlistName} onChange={handleInputGetPlaylistName} placeholder='Playlist Name' />
              <button className="create-playlist-button" onClick={() => handleButton(playlistName, userID, token)}>Criar Playlist</button>
            </div>
            <button onClick={() => { handleSavePlaylistButton() }}>Salvar playlist</button>
            {playlistTracks.length > 0 && playlistTracks.map((track) => <PlaylistTracks key={track.id} track={track} onRemoveTrackFromPlaylist={removeTrackFromPlaylist} />)}
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
