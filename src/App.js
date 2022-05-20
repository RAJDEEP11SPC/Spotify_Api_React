import React , {useState , useEffect} from 'react'
import './App.css'
import axios from 'axios'

const App = () => {
const CLIENT_ID = "fdae41c9aa6c481280a86d6a8d480974"
const REDIRECT_URI = "https://rajdeep11spc.github.io/Spotify_Api_React/"

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const [token , setToken] = useState('')
const [ searchkey , setSearchKey ] = useState('')
const [ artists , setArtists] = useState('')
const [data, setData] = useState({});

useEffect( () => {
  const hash = window.location.hash
  let token = window.localStorage.getItem("token")

  if(!token && hash){
    token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
    
    window.location.hash = ''
    window.localStorage.setItem("token", token)
   
  }

  setToken(token)

}, [])

const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
}

const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
      Authorization: `Bearer ${token}`
  },
    params: {
      q: searchkey,
      type: "artist"
    }
})

  console.log(data)
  setArtists(data.artists.items)
}
 
const renderArtists = () => {
  return artists.map(artist => (
      <div key={artist.id} >
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
          {artist.name}
      </div>
  ))
}

const handleGetPlaylists = () => {
  axios
    .get(PLAYLISTS_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};



  return (
    <div className='App'>
      <h1>Spotify App</h1>
      {!token ?
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>LOGIN TO SPOTIFY</a>
      : <button onClick={ logout }>Logout</button>
      } 

      {token ?
      
        <form onSubmit={searchArtists} >
          <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            
            <button type={"submit"}>Search</button>
        
        </form>
        
        : <h2>Please login</h2>

      }



      {artists && renderArtists()}

      <>
      <button onClick={handleGetPlaylists}>Get Playlists</button>
      {data?.items ? data.items.map((item) => <p>{item.name}</p>) : null}
    </>

      </div>
  )
}

export default App
