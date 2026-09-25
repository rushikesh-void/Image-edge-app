const path = require('path')
const fs = require('fs')
const Image = require('../models/Image')
const detectEdges = require('../utils/edgeDetection')

const uploadImage = async (req, res)=>{

    try {
        if (!req.file){
            return res.status(400).json({message: 'No image file provided'})
        }

         const filePath = path.join(__dirname, '..', 'uploads',req.file.filename)

         const {width, height, borders, area} = await detectEdges(filePath)

         const image = await Image.create({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: `/uploads/${req.file.filename}`,
            width,
            height,
            borders,
            area,
         })

         res.status(201).json({
            _id: image._id,
            imageUrl: image.filePath,
            width: image.width,
            height: image.height,
            borders: image.borders,
            area: image.area,
            createdAt: image.createdAt
         })
    } catch (error){
        res.status(500).json({message: error.message})
    }
}
const getImages = async (req, res) => {
    try {
        const images = await Image.find({ user: req.user._id }).sort({ createdAt: -1 })

        res.status(200).json(images)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getImageById = async (req, res) => {
    try {
        const image = await Image.findOne({ _id: req.params.id, user: req.user._id })

        if (!image) {
            return res.status(404).json({ message: 'Image not found' })
        }

        res.status(200).json(image)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteImage = async (req, res) => {
    try {
        const image = await Image.findOne({ _id: req.params.id, user: req.user._id })

        if (!image) {
            return res.status(404).json({ message: 'Image not found' })
        }

        const filePath = path.join(__dirname, '..', 'uploads', image.filename)

        fs.unlink(filePath, (err) => {
            if (err) console.log('File already missing or could not be deleted:', err.message)
        })

        await image.deleteOne()

        res.status(200).json({ message: 'Image deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateBorders = async (req, res) => {
    try {
        const { borders } = req.body

        if (!Array.isArray(borders)) {
            return res.status(400).json({ message: 'borders must be an array' })
        }

        if (borders.length > 5000) {
            return res.status(400).json({ message: 'Too many points (max 5000)' })
        }

        const valid = borders.every(
            (p) => p && typeof p.x === 'number' && typeof p.y === 'number'
        )

        if (!valid) {
            return res.status(400).json({ message: 'Each point needs numeric x and y' })
        }

        const image = await Image.findOne({ _id: req.params.id, user: req.user._id })

        if (!image) {
            return res.status(404).json({ message: 'Image not found' })
        }

        image.borders = borders

        if (borders.length === 0) {
            image.area = 0
        } else {
            const xs = borders.map((p) => p.x)
            const ys = borders.map((p) => p.y)
            image.area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys))
        }

        await image.save()

        res.status(200).json(image)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
    module.exports = { uploadImage, getImages, getImageById, deleteImage, updateBorders }
