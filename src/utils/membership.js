import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);
import { convertHeicToJpg } from './heifConverter.js'; // Ensure the correct file extension for your module


export const generateMemberCard = async ({ photoPath, templatePath, name, state, city, phone }, outputDir) => {
    // Canvas dimensions
    const fallBackPhoto= path.join(__dirname, '../../public/templates/aklish.jpg');
    const width = 856;
    const height = 540;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    

    try {
        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            console.log("file created",outputDir)
            fs.mkdirSync(outputDir, { recursive: true });
        }
        

        // Handle HEIC/HEIF image conversion
        const fileExtension = path.extname(photoPath).toLowerCase();
        if (fileExtension === '.heic' || fileExtension === '.heif') {
            console.log("HEIC/HEIF image detected. Converting...");
            try {
                photoPath = await convertHeicToJpg(photoPath);
                console.log("done conerting")
                console.log(photoPath)
            } catch (error) {
                photoPath  = fallBackPhoto;
                console.error("Error during HEIC/HEIF conversion:", error.message);
                throw new Error('Failed to process HEIC/HEIF image.');
            }
        }

        // Load template image
        const templateImage = await loadImage(templatePath);
        ctx.drawImage(templateImage, 0, 0, width, height);

        // Load and place user photo
        if (photoPath) {
            try {
                const userPhoto = await loadImage(photoPath);
                ctx.drawImage(userPhoto, 615, 220, 220, 220); // Adjust position and size as needed
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(610, 215, 230, 230); // Border around photo
            } catch (error) {
                console.error("Failed to load user photo. Skipping photo placement.");
            }
            finally {
                // Delete the uploaded or converted photo after processing
                fs.unlink(photoPath, (err) => {
                    if (err) console.error('Failed to delete processed photo:', err);
                });
            }
        }
        else{
            const userPhoto = await loadImage(fallBackPhoto);
            ctx.drawImage(userPhoto, 40, 800, 400, 400); // Adjust position and size as needed
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'white';
            ctx.strokeRect(40, 800, 400, 400); // Border around photo

        }
        // Add user details (name, address, phone)
        ctx.font = '30px "Sans-serif"';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
       
        
        ctx.fillStyle = '#000';
        ctx.fillText(`Name: ${name}`, 20, 280);
        ctx.fillText(`Address: ${city}, ${state}`, 20, 330);
        if(phone){
            ctx.fillText(`Contact: ${phone}`, 20, 380);
        }
        // Save the generated card
        const imageId = uuidv4();
        const outputPath = path.join(outputDir, `${imageId}.png`);
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        return new Promise((resolve, reject) => {
            out.on('finish', () => resolve(outputPath));
            out.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error("Error generating card:", error.message);
        throw new Error('Card generation failed.');
    }
};
