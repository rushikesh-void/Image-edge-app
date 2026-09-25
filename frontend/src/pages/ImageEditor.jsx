import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './ImageEditor.css'

const backendUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000'

function downsamplePoints(points, target) {
    if (points.length <= target) return points

    const step = Math.floor(points.length / target)
    return points.filter((_, index) => index % step === 0)
}

function ImageEditor() {
    const { id } = useParams()
    const navigate = useNavigate()

    const[image, setImage] = useState(null)
    const[points, setPoints] = useState([])
    const[dragIndex, setDragIndex] = useState(null)
    const[saving, setSaving] = useState(false)
    const[saved, setSaved] = useState(false)

    useEffect(()=>{
        fetchImage()
    }, [id])

    const fetchImage = async ()=>{
        try {
            const res = await api.get(`/images/${id}`)
            setImage(res.data)
            setPoints(downsamplePoints(res.data.borders, 80))
        } catch (err) {
            console.log(err)
        }
    }

    const handleMouseDown = (index)=>{
        setDragIndex(index)
    }

    const handleMouseMove = (e)=>{
        if (dragIndex === null || !image) return

        const svg = e.currentTarget
        const rect = svg.getBoundingClientRect()

        const scaleX = image.width / rect.width
        const scaleY = image.height / rect.height

        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        setPoints((prev) =>
            prev.map((p, i) => (i === dragIndex ? { x, y } : p))
        )
    }

    const handleMouseUp = ()=>{
        setDragIndex(null)
    }

    const handleDoubleClick = (index, e) => {
        e.preventDefault()
        setPoints((prev) => prev.filter((_, i) => i !== index))
    }

    const handleClearAll = ()=>{
        setPoints([])
    }

    const handleSave = async ()=>{
        setSaving(true)
        setSaved(false)

        try {
            await api.put(`/images/${id}/borders`, { borders: points })
            setSaved(true)
        } catch (err) {
            console.log(err)
        } finally {
            setSaving(false)
        }
    }

    if (!image) return <p>Loading...</p>

    return (
        <div className="editor-container">
            <div className="editor-header">
                <button onClick={() => navigate('/dashboard')}>Back</button>
                <div>
                    <button onClick={handleClearAll}>Clear All Borders</button>
                    <button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Borders'}
                    </button>
                    {saved && <span className="save-status">Saved!</span>}
                </div>
            </div>

            <div className="canvas-wrapper">
                <img src={`${backendUrl}${image.filePath}`} alt={image.originalName} />

                <svg
                    className="border-overlay"
                    viewBox={`0 0 ${image.width} ${image.height}`}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={image.width / 150}
                            className="border-point"
                            onMouseDown={() => handleMouseDown(i)}
                            onDoubleClick={(e) => handleDoubleClick(i, e)}
                        />
                    ))}
                </svg>
            </div>

            <p className="editor-hint">Drag a point to move it. Double-click a point to delete it.</p>
        </div>
    )
}

export default ImageEditor