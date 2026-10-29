// YouTube player for the album's full-album video, docked at the bottom right
function embedUrl(youtube) {
  const url = new URL(youtube)
  const video = url.searchParams.get('v')
  if (video) return `https://www.youtube-nocookie.com/embed/${video}?autoplay=1&rel=0`
  return `https://www.youtube-nocookie.com/embed/videoseries?list=${url.searchParams.get('list')}&autoplay=1&rel=0`
}

export default function Player({ album, onClose }) {
  if (!album) return null
  return (
    <aside className="player" aria-label="Now playing">
      {album.youtubeEmbed === false ? (
        <div className="player-blocked">
          <p>The uploader only allows this album to play on YouTube.</p>
          <a className="btn" href={album.youtube} target="_blank" rel="noopener noreferrer">
            Open on YouTube
          </a>
        </div>
      ) : (
        <iframe
          key={album.youtube}
          title={`${album.artist} – ${album.album}`}
          src={embedUrl(album.youtube)}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}
      <div className="player-bar">
        <p className="player-now">
          <span className="flag">{album.flag}</span> {album.artist} – {album.album}
        </p>
        {/* some uploaders block playback on other sites; this always works */}
        <a className="btn" href={album.youtube} target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
        <button className="player-close" onClick={onClose} aria-label="Close player">
          ×
        </button>
      </div>
    </aside>
  )
}
