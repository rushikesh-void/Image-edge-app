import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import UploadBox from '../components/UploadBox'
import ImageCard from '../components/ImageCard'
import './Dashboard.css'

function Dashboard() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

    const { user, logout } = useAuth()

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        try {
            const res = await api.get('/images')
            setImages(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadSuccess = (newImage) => {
        setImages((prev) => [newImage, ...prev])
    }

    const handleDelete = (id) => {
        setImages((prev) => prev.filter((img) => img._id !== id))
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome, {user?.email}</h2>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>

            <UploadBox onUploadSuccess={handleUploadSuccess} />

            {loading ? (
                <p>Loading images...</p>
            ) : images.length === 0 ? (
                <p className="empty-state">No images uploaded yet.</p>
            ) : (
                <div className="image-grid">
                    {images.map((img) => (
                        <ImageCard key={img._id} image={img} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard