import { useMemo, useState } from 'react'
import albums from './albums.json'
import ForestBackdrop from './ForestBackdrop.jsx'
import Player from './Player.jsx'

const SPOTIFY_PLAYLIST = 'https://open.spotify.com/playlist/2H2pNhvWLbpUELpwlcIYdU'

// albums.json is already sorted by country, then folder order
const countries = [...new Map(albums.map((a) => [a.country, a])).values()].map((a) => ({
  code: a.country,
  name: a.countryName,
  flag: a.flag,
  count: albums.filter((x) => x.country === a.country).length,
}))

const youtubeAll =
  'https://www.youtube.com/watch_videos?video_ids=' +
  albums
    .map((a) => new URL(a.youtube).searchParams.get('v'))
    .filter(Boolean)
    .join(',')

function AlbumCard({ album, playing, onPlay }) {
  return (
    <article className={playing ? 'album playing' : 'album'}>
      <button className="cover" onClick={() => onPlay(album)} aria-label={`Play ${album.artist} – ${album.album}`}>
        <img src={album.cover} alt="" loading="lazy" />
        <span className="cover-play" aria-hidden="true">{playing ? '♪' : '▶'}</span>
      </button>
      <p className="country">
        <span className="flag">{album.flag}</span> {album.countryName}
      </p>
      <p className="artist">{album.artist}</p>
      <h3 className="title">{album.album}</h3>
      <p className="year">{album.year}</p>
      <div className="links">
        <a className="btn" href={album.spotify} target="_blank" rel="noopener noreferrer">
          Spotify
        </a>
        <a className="btn" href={album.youtube} target="_blank" rel="noopener noreferrer">
          YouTube{album.youtubeLength ? ` · ${album.youtubeLength}` : ''}
        </a>
      </div>
    </article>
  )
}

export default function App() {
  const [country, setCountry] = useState('all')
  const [query, setQuery] = useState('')
  const [playing, setPlaying] = useState(null)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return albums.filter(
      (a) =>
        (country === 'all' || a.country === country) &&
        (!q || a.artist.toLowerCase().includes(q) || a.album.toLowerCase().includes(q)),
    )
  }, [country, query])

  const years = albums.map((a) => a.year)

  return (
    <div className={playing ? 'page with-player' : 'page'}>
      <ForestBackdrop />
      <header className="wrap mast">
        <p className="eyebrow">“I have come to challenge your ways”</p>
        <h1>Melodic Black Corner</h1>
        <p className="stats">
          <span><b>{albums.length}</b> albums</span>
          <span><b>{countries.length}</b> lands</span>
          <span><b>{Math.min(...years)}–{Math.max(...years)}</b></span>
        </p>
        <div className="play">
          <a href={SPOTIFY_PLAYLIST} target="_blank" rel="noopener noreferrer">
            Play everything on Spotify
          </a>
          <a className="ghost" href={youtubeAll} target="_blank" rel="noopener noreferrer">
            Play all full albums on YouTube
          </a>
        </div>
      </header>

      <nav className="nav">
        <div className="wrap nav-row">
          <button className={country === 'all' ? 'chip on' : 'chip'} onClick={() => setCountry('all')}>
            All <span className="n">{albums.length}</span>
          </button>
          {countries.map((c) => (
            <button
              key={c.code}
              className={country === c.code ? 'chip on' : 'chip'}
              onClick={() => setCountry(c.code)}
            >
              <span className="flag">{c.flag}</span> {c.name} <span className="n">{c.count}</span>
            </button>
          ))}
        </div>
        <div className="wrap">
          <input
            id="search"
            className="search"
            type="search"
            placeholder="Search artist or album"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </nav>

      <main className="wrap">
        {shown.length === 0 && <p className="empty">No album matches “{query}”.</p>}
        <div className="grid">
          {shown.map((a) => (
            <AlbumCard key={a.spotify} album={a} playing={playing?.spotify === a.spotify} onPlay={setPlaying} />
          ))}
        </div>
      </main>

      <footer className="wrap">Sorted by land, then in the order of the folder. Tap a cover to play the full album here.</footer>

      <Player album={playing} onClose={() => setPlaying(null)} />
    </div>
  )
}
