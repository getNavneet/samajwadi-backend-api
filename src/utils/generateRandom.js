export const generateRandomCardNumber = () => {
    const PREFIX = "SP-"; // Fixed first 3 characters
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Random 5-digit number
    return `${PREFIX}${randomNumber}`;
};