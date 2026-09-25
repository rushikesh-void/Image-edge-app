import { useState } from 'react'
import api from '../services/api'
import './UploadBox.css'

function UploadBox({ onUploadSuccess }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFile = async (file) => {
        if (!file) return

        setUploading(true)
        setError('')

        const formData = new FormData()
        formData.append('image', file)

        try {
            const res = await api.post('/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            onUploadSuccess(res.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    const handleChange = (e) => {
        const file = e.target.files[0]
        handleFile(file)
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="upload-box"
        >
            {uploading ? (
                <p>Uploading...</p>
            ) : (
                <>
                    <p>Drag and drop an image here, or</p>
                    <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleChange} />
                </>
            )}

            {error && <p className="upload-error">{error}</p>}
        </div>
    )
}

export default UploadBox