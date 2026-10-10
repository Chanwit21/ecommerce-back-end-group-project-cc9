const fs = require("fs");
const path = require("path");
module.exports = async (file) => {
  if (process.env.CLOUDINARY_URL) {
    const result = await require("cloudinary").v2.uploader.upload(file);
    fs.unlinkSync(file);
    return result;
  }
  return { secure_url: "/uploads/" + path.basename(file) };
};
