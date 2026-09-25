import { Link } from 'react-router-dom'
import api from '../services/api'
import './ImageCard.css'

const backendUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000'

function ImageCard({ image, onDelete }) {
    const handleDelete = async () => {
        try {
            await api.delete(`/images/${image._id}`)
            onDelete(image._id)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="image-card">
            <img
                src={`${backendUrl}${image.filePath}`}
                alt={image.originalName}
            />
            <p>{image.originalName}</p>
            <Link to={`/editor/${image._id}`}>View / Edit</Link>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default ImageCard