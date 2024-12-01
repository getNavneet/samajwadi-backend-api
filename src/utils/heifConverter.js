import fs from 'fs/promises'; // Using promises version for async/await
import path from 'path';
import heicConvert from 'heic-convert'; // Ensure to use default import syntax

/**
 * Converts a HEIC/HEIF image to a JPG format.
 * @param {string} inputPath - Path to the input HEIC/HEIF image file.
 * @returns {Promise<string>} - Resolves to the path of the converted JPG image.
 */
async function convertHeicToJpg(inputPath) {
    try {
        // Check if input file exists
        const fileExists = await fs.access(inputPath).then(() => true).catch(() => false);
        if (!fileExists) {
            throw new Error(`File not found: ${inputPath}`);
        }

        // Prepare the output path
        const directory = path.dirname(inputPath);
        const fileNameWithoutExt = path.basename(inputPath, path.extname(inputPath));
        const outputPath = path.join(directory, `${fileNameWithoutExt}-converted.jpg`);

        // Read the HEIC file as a buffer
        const inputBuffer = await fs.readFile(inputPath);

        // Perform the conversion
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1,
        });

        // Write the converted file to the output path
        await fs.writeFile(outputPath, outputBuffer);

        // Return the path of the converted file
        return outputPath;
    } catch (error) {
        console.error('Error during HEIC conversion:', error.message);
        throw error; // Rethrow the error for handling in the calling code
    }
}

// Export the function
export { convertHeicToJpg };
