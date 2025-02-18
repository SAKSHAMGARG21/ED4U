import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) return null;

        const options = { folder };
        options.resource_type = 'auto';
        // upload the file 
        const response = await cloudinary.uploader.upload(localFilePath, options);
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation is failed    
        return null;
    }
}
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;
//         // upload the file 
//         const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
//         // file has been uploaded successfully
//         console.log("file is uploaded on cloudinary", response.url);
//         fs.unlinkSync(localFilePath)
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation is failed    
//         return null;
//     }
// }

const deleteImagefromCloudinary = async (cloudpath) => {
    try {
        const deletedFileOnCloudinary = await cloudinary.uploader.destroy(cloudpath);
        console.log("Previous Image deleted Successfully", deletedFileOnCloudinary);
        return deletedFileOnCloudinary;
    } catch (error) {
        console.log("Faild to Delete file from Cloudinary ->>> ", error);
    }
}

const deleteVideofromCloudinary = async (cloudpath) => {
    try {
        const deletedFileOnCloudinary = await cloudinary.uploader.destroy(cloudpath, {
            resource_type: 'video'
        });
        console.log("Previous Video deleted Successfully", deletedFileOnCloudinary);
        return deletedFileOnCloudinary;
    } catch (error) {
        console.log("Faild to Delete file from Cloudinary ->>> ", error);
    }
}

export { uploadOnCloudinary, deleteImagefromCloudinary, deleteVideofromCloudinary };

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function(error, result) {console.log(result); });