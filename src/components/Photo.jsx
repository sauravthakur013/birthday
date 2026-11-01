import { images } from '../data/images'
import './Photo.css'

export default function Photo({ id, alt = '', className = '' }) {
  const src = images[id]

  return (
    <div className={`photo ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" draggable="false" />
      ) : (
        <div className="photo__placeholder" role="img" aria-label={`Placeholder for image ${id}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2.5" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="M4 18l5-5 3.5 3.5L15 14l5 4.5" />
          </svg>
          <span className="photo__label">Add Image {id}</span>
        </div>
      )}
    </div>
  )
}
