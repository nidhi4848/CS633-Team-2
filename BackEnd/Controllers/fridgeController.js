import mongoose from 'mongoose';
import Fridge from '../models/FridgeModel.js';
import User from '../models/UserModel.js';

/**********************************************Get All Posts *********************************************/
const getFridgeFromUser = async (req, res) => {
    try{
        //go to the user model and get the fridge Id
        const user = await User.findById(req.user._id);
        const fridge = await Fridge.findById(user.fridge);
        res.status(200).json(fridge);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/**********************************************Create New Fridge *******************************************/
const addFridgeToUser = async (req, res) => {

    //Grab the authenticated user from the request body
    const user = await User.findById(req.user._id);

    try{
        const fridge = await Fridge.create({user: user._id, ingredients: []});
        user.fridge = fridge._id;
        await user.save();

        res.status(200).json({ success: 'Fridge Created.', fridge });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
    
}

// /**********************************************Create New Post *******************************************/
// const deletePost = async (req, res) => {

//     //Check if the ID is Valid
//     if(!mongoose, Types.ObjectId.isValid(req.params.id)){
//         return res.status(400).json({ error: 'Invalid ID' });
//     }

//     //Check if the Post Exists
//     const post = await Post.findById(req.params.id);
//     if(!post){
//         return res.status(404).json({ error: 'Post Not Found' });
//     }

//     //Check if the User is the Owner of the Post
//     const user = await User.findById(req.user._id);
//     if(!post.user.equals(user._id)){
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try{
//         await post.remove();
//         res.status(200).json({ success: 'Post Deleted' });
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// }

// /**********************************************Update Post *******************************************/
// const updatePost = async (req, res) => {

//     //Grab Data from the Request Body
//     const {title, body} = req.body;

//     //Check the fields are not empty
//     if(!title || !body){
//         return res.status(400).json({ msg: 'All fields are required' });
//     }

//     //Check if the ID is Valid
//     if(!mongoose, Types.ObjectId.isValid(req.params.id)){
//         return res.status(400).json({ error: 'Invalid ID' });
//     }

//     //Check if the Post Exists
//     const post = await Post.findById(req.params.id);
//     if(!post){
//         return res.status(404).json({ error: 'Post Not Found' });
//     }

//     //Check if the User is the Owner of the Post
//     const user = await User.findById(req.user._id);
//     if(!post.user.equals(user._id)){
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try{
//         await post.updateOne({title, body})
//         res.status(200).json({ success: 'Post Updated' });
//     }
//     catch(error){
//         res.status(500).json({ error: error.message });
//     }
// }

export {getFridgeFromUser, addFridgeToUser};