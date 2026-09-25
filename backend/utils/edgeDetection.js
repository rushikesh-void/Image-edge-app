const {Jimp} = require('jimp')

const sobelX = [
[-1, 0, 1],
[-2, 0, 2],
[-1, 0, 1]
]

const sobelY = [
[-1, -2, -1],
[0, 0, 0],
[1, 2, 1]
]

const detectEdges = async(imagePath)=>{
    const image = await Jimp.read(imagePath)
    const width = image.bitmap.width
    const height = image.bitmap.height


    image.greyscale()

    const getGray = (x,y)=>{
        const idx = (y * width + x) * 4
        return image.bitmap.data[idx]
    }

    const threshold = 100
    const points = []

    for (let y= 1;  y <height -1; y++){
        for (let x= 1; x <width -1; x++){
            let pixelX = 0;
            let pixelY = 0;
            
            for (let ky = -1; ky <= 1; ky++ ){
                for (let kx= -1; kx <= 1; kx++){
                const gray = getGray(x + kx, y + ky)
           pixelX += gray * sobelX[ky +1][kx + 1]
           pixelY += gray * sobelY[ky +1][kx + 1]
            }
        }

        const magnatitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY)

        if (magnatitude > threshold) {
            points.push({x, y})
        }
    }
}

const cellSize = Math.round(Math.max(width, height) / 40)
const cells = {}

for (const p of points) {
    const key = Math.floor(p.x / cellSize) + '-' + Math.floor(p.y / cellSize)
    if (!cells[key]) {
        cells[key] = p
    }
}

const simplifiedPoints = Object.values(cells)

const area = width * height

return{
    width,
    height,
    borders: simplifiedPoints,
    area,
}
}

module.exports = detectEdges