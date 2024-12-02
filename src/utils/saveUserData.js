import mongoose from 'mongoose';
import {User} from '../models/user.model.js'; 


export const saveUserData = async ({ phone, name, state, city, cardNo, imageUrl }) => {
    if (mongoose.connection.readyState !== 1) {
        console.error('Database is not connected. Unable to save user data.');
        return { success: false, message: 'Database is not connected.' };
    }

    try {
        // Check if a user with this phone number already exists
        let user = await User.findOne({ phone });

        if (user) {
            // User exists, append new data to arrays
            user.name.push(name);
            user.state.push(state);
            user.city.push(city);
            user.cardNo.push(cardNo);
            user.url.push(imageUrl);

            await user.save();
            return { success: true, message: 'Data appended to existing user.', user };
        } else {
            // User does not exist, create a new entry
            user = new User({
                phone,
                name: [name],
                state: [state],
                city: [city],
                cardNo: [cardNo],
                url: [imageUrl],
            });

            await user.save();
            return { success: true, message: 'New user created.', user };
        }
    } catch (error) {
        console.error('Error saving user data:', error);
        return { success: false, message: 'Error saving user data.', error };
    }
};
