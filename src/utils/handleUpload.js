import fs from 'fs';
import { uploadOnCloudinary } from './cloudinary.js';
export const handleUpload = async (generatedCardPath) => {
    try {
        const uploaded = await uploadOnCloudinary(generatedCardPath); // Upload the file to Cloudinary or another service

        if (uploaded && uploaded.url) {
            // If upload is successful and URL is valid
            console.log("Image successfully uploaded:", uploaded.url);

            // Delete the local file from the server
            fs.unlink(generatedCardPath, (err) => {
                if (err) {
                    console.error("Failed to delete local file:", err);
                } else {
                    console.log("Local file deleted successfully.");
                }
            });
            return { success: true, url:uploaded.url  };
        } else {
            // If upload fails or the uploaded URL is invalid
            console.log("Upload failed  uploaded is null or undefined");
           return { success: false, url:null  }
           
        }
    } catch (error) {
        
        console.error("Error during file upload:", error);
        
    }
};


