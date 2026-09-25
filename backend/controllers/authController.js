const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken= (userId)=>{
    return jwt.sign({id: userId}, process.env.Jwt_secret, {
        expiresIn: '7d'
    })
}

const registerUser = async (req, res) =>{
    try{
        const {email, password} = req.body

        if (!email || !password){
            return res.status(400).json({ message: 'Please provide email and password '})
        }

        const userExists = await User.findOne({email})
        if (userExists){
            return res.status(400).json({message:'User already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            email,
            password: hashedPassword,
        })

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        })
    } catch (error){
        res.status(500).json({ message: error.message })
    }
} 

const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body

        if(!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password'})
        }

        const user = await User.findOne({email})
        if (!user){
            return res.status(401).json({message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'})
        }

        res.status(200).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        })
    } catch (error){
        res.status(500).json({ message: error.message})
    }
}

module.exports = {registerUser, loginUser}