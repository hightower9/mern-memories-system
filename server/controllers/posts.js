import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose'


const getPosts = async (req, res) => {
    const { page } = req.query

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT //get the starting index of every page
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        // id is -1 to sort the newest first and oldest last

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query
    try {
        const title = new RegExp(searchQuery, 'i')

        const posts = await PostMessage.find({
            $or: [ {title}, {tags: { $in: tags.split(',') } } ]
        })

        res.json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const createPost = async (req, res) => {
    const post = req.body

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

const updatePost = async (req, res) => {
    const { id: _id } = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No Post with id ${_id}` })

    try {
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true })

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

const deletePost = async (req, res) => {
    const { id: _id } = req.params

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No Post with id ${_id}` })

    try {
        await PostMessage.findByIdAndRemove(_id)

        res.json({ message: 'Post deleted successfully' })
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

const likePost = async (req, res) => {
    const { id: _id } = req.params

    if(!req.userId) return res.json({ message: 'Unauthenticated' })

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No Post with id ${_id}` })

    try {
        const post = await PostMessage.findById(_id)
        const index = post.likes.findIndex((id) => id === String(req.userId))

        if(index === -1) {
            // like post
            post.likes.push(req.userId)
        }
        else{
            // dislike post
            post.likes = post.likes.filter((id) => id !== String(req.userId))
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export {
    getPosts,
    getPostsBySearch,
    createPost,
    updatePost,
    deletePost,
    likePost
}