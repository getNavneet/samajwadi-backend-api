import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);
import { asyncHandler } from "../utils/asyncHandler.js"
import { generateCard } from "../utils/newYear.js"

const greetings =  asyncHandler( async (req, res) => {
    // res.send("thankyou")

    const {name, state, city, phone, templateId } = req.body


    let photoPath;

    if (req.files?.photo?.[0]?.path) {
        photoPath = req.files.photo[0].path;
    } else {
        photoPath = path.join(__dirname, '../../public/templates/aklish.jpg');
        console.log("Photo not provided, using default template.");
    }





      console.log(photoPath)
    const templatePath = path.join(__dirname, `../../public/templates/${templateId}.png`);
       //i have to decide template path based on templateID
       console.log(templatePath)

    const outputDir = path.join(__dirname, '../../public/generatedcards');
    console.log(outputDir)

    const generatedCardPath = await generateCard({
        photoPath,
        templatePath,
        name,
        state,
        city,
        phone
    }, outputDir);

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${path.basename(generatedCardPath)}`;
    res.json({ imageUrl });
} )

export {
    greetings,
}


