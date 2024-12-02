import path from 'path';
import { handleUpload } from '../utils/handleUpload.js';
import { fileURLToPath } from 'url';
import { generateRandomCardNumber } from "../utils/generateRandom.js";
import { saveUserData } from '../utils/saveUserData.js';
// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);
import { asyncHandler } from "../utils/asyncHandler.js"
import {generateMemberCard} from '../utils/membership.js'

const membership =  asyncHandler( async (req, res) => {

    const {name, state, city, phone } = req.body

    let photoPath;

    if (req.files?.photo?.[0]?.path) {
        photoPath = req.files.photo[0].path;
    } else {
        photoPath = "";
       
    }
    const templatePath = path.join(__dirname, `../../public/templates/membership.png`);
      
    
    const outputDir = path.join(__dirname, '../../public/generatedcards');
    console.log(outputDir)
    const cardNo=generateRandomCardNumber();
    const generatedCardPath = await generateMemberCard({
        photoPath,
        templatePath,
        name,
        state,
        city,
        phone,
        cardNo
    }, outputDir);

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${path.basename(generatedCardPath)}`;
     


   //uploading on cloudinary
   const upload=await handleUpload(generatedCardPath);
 
   if(upload.success==true){
    res.json({ imageUrl:upload.url });
   }
   else{
    res.json({ imageUrl });
   }
 
    //saving user in database
      try {
        const result = await saveUserData({ phone, name, state, city, cardNo, imageUrl });

        if (result.success) {
            console.log("user saved succesfully")
        } else {
            console.log("failed to save user")

        }
    } catch (error) {
        console.error('Error in route:', error);
        
    }  
    
} )



try {
    const result = await saveUserData({ phone, name, state, city, cardNo, imageUrl });

    if (result.success) {
        console.log("user saved succesfully")
    } else {
        console.log("failed to save user")

    }
} catch (error) {
    console.error('Error in route:', error);
    
}  

export {
    membership,
}


