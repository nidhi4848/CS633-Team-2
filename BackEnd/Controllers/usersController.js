import User from '../models/UserModel.js';
import Fridge from '../models/FridgeModel.js';
import Pantry from '../models/PantryModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config.js';
import jwt from 'jsonwebtoken';

/***************************************** Creating JWT Token *****************************************/
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
}

/*****************************************Register User *****************************************/
const registerUser = async (req, res) => {
    // Grab Data from the Request Body
    const { firstName, lastName, email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if the email already exists
    const exist = await User.findOne({ email });
    if (exist) {
        return res.status(400).json({ error: 'Email is already taken' });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        // Create empty Fridge with a default "placeholder" user reference (temporary)
        const fridge = await Fridge.create({
            user: new mongoose.Types.ObjectId(),  // Temporarily assign a placeholder ObjectId
            ingredients: [] // Empty ingredients array for now
        });

        // Create empty Pantry with a default "placeholder" user reference (temporary)
        const pantry = await Pantry.create({
            user: new mongoose.Types.ObjectId(),  // Temporarily assign a placeholder ObjectId
            ingredients: [] // Empty ingredients array for now
        });

        // Create the User and associate the Fridge and Pantry
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            fridge: fridge._id,
            pantry: pantry._id
        });

        // Now, update Fridge and Pantry with the actual user reference
        await Fridge.findByIdAndUpdate(fridge._id, { user: user._id });
        await Pantry.findByIdAndUpdate(pantry._id, { user: user._id });

        // Create a JWT Token for the user
        const token = createToken(user._id);

        // Send the response with the user's email and the JWT token
        res.status(200).json({ email, token });

    } catch (error) {
        // Handle any errors during the process
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}




/*****************************************Login User *****************************************/
const loginUser = async (req, res) => {
    //Grab Data from the Request Body
    const {email, password} = req.body;

    //Check the fields are not empty
    if(!email || !password){
        return res.status(400).json({ msg: 'All fields are required' });
    }

    //Check if user email already exists
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ error: 'Incorrect email or password' });
    }

    //Check if the password is correct
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({ error: 'Incorrect email or password' });
    }

    try{
        //Create a JWT Token
        const token = createToken(user._id);

        res.status(200).json({ firstName: user.firstName, lastName: user.lastName, email, token }); 
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


/*****************************************Get User Info *****************************************/
//get user info
const getUserInfo = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user);
}

export {registerUser, loginUser, getUserInfo};