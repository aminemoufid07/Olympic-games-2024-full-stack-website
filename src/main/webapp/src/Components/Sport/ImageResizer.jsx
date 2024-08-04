// imageResizer.js
import sharp from "sharp";
import fetch from "node-fetch";

const resizeImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(853, 480)
      .toBuffer();
    return resizedImageBuffer;
  } catch (error) {
    console.error("Error resizing image:", error);
    return null;
  }
};

export { resizeImage };
