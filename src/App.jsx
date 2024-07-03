import { IoIosAddCircleOutline } from "react-icons/io";
import './App.css';


const url = 'https://api.spotify.com/v1/search?q=the+unforgiven&type=track&limit=2'

let token = '';

async function requestAccessToken() {
  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type':'client_credentials',
         'client_id': '7915d847a030465bbaaab9569e7accbc',
        'client_secret': '514cbd7755d04eac9c5b192aed532a06'
      })
    })

    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status}`)
    }

    const access = await res.json()
    token = access.access_token
    console.log(token)
  }

  catch(e) {
    console.error(e)
  }
}

requestAccessToken()

async function fetchSpotifyData() {

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
    console.log(data);
  }

  catch (error) {
    console.error('Error: ', error);
  }
}

//fetchSpotifyData();

function App() {
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Ja<span>mmm</span>ing</h1>
      </div>

      <div className="search-container">
        <h2>Procure por sua música ou artista preferido</h2>
        <input type="text" />
        <button onClick={fetchSpotifyData}>Procurar</button>
      </div>

      <div className="search-result-container">

        <div className="search-result">
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
