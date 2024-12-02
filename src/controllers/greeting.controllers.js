import path from 'path';
import fs from 'fs';
import { handleUpload } from "../utils/handleUpload.js";
import { fileURLToPath } from 'url';
import { saveUserData } from "../utils/saveUserData.js";
import { generateRandomCardNumber } from "../utils/generateRandom.js";
// Get the current file's path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current file
const __dirname = path.dirname(__filename);
import { asyncHandler } from "../utils/asyncHandler.js"
import { generateCard } from "../utils/newYear.js"

const greetings =  asyncHandler( async (req, res) => {

    const {name, state, city, phone, templateId } = req.body


    let photoPath;

    if (req.files?.photo?.[0]?.path) {
        photoPath = req.files.photo[0].path;
    } else {
        photoPath = "";
        
    }





    const templatePath = path.join(__dirname, `../../public/templates/${templateId}.png`);
       //i have to decide template path based on templateID

    const outputDir = path.join(__dirname, '../../public/generatedcards');

    const generatedCardPath = await generateCard({
        photoPath,
        templatePath,
        name,
        state,
        city,
        phone
    }, outputDir);
        //generatedCardPath contains url -we can use it save image in cloudinary
      

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${path.basename(generatedCardPath)}`;

    //uploading on cloudinary
       const upload=await handleUpload(generatedCardPath);
       if(upload.success==true){
        res.json({ imageUrl:upload.url });
       }
       else{
        res.json({ imageUrl });
       }
     
    
    
    

       
        const cardNo=generateRandomCardNumber();
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

export {
    greetings,
}


