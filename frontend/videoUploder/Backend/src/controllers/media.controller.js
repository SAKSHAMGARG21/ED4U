import { Media } from "../modals/media.modal.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (LocalfilePathImage) => {
    try {
        if (!LocalfilePathImage) return null;

        const response = await cloudinary.uploader.upload(LocalfilePathImage, {
            resource_type: 'auto'
        })

        if (!response) {
            throw new Error('Clodinary not giving any response');
        }

        console.log("File uploaded on cloudinary Successfully", response.secure_url);
        fs.unlinkSync(LocalfilePathImage);
        return response;
    } catch (error) {
        fs.unlinkSync(LocalfilePathImage) // remove the locally saved temporary file as the upload operation is failed    
        return null;
    }
}

const getmedia = async (req, res) => {
    try {
        const videofile = await Media.find({});
        if (!videofile) {
            throw new Error('No media found');
        }
        return res.status(200).json(videofile);
    } catch (error) {
        console.log("Error in Fetching Media files from Database", error);
        return res.status(401).json(error);
    }
}

const postmedia = async (req, res) => {
    try {
        const { title, description } = req.body;
        // console.log(title," ",description);

        let videosPaths = [];
        if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
            for (let video of req.files.videos) {
                videosPaths.push("" + video.path);
            }
        }

        // console.log(videosPaths)

        const LocalfilePathImage = req.files?.image[0].path;
        // console.log(LocalfilePathImage);

        if (!LocalfilePathImage) {
            throw new Error('No image file found');
        }

        const Image = await uploadOnCloudinary(LocalfilePathImage);
        let cloudinaryVideosPaths = [];
        for (let videopath of videosPaths) {
            let file = await uploadOnCloudinary(videopath);
            cloudinaryVideosPaths.push(file.secure_url);
        }

        // console.log(cloudinaryVideosPaths);

        if (!Image) {
            throw new Error('Error in uploading file on cloudinary');
        }

        const newMedia = await Media.create({
            title: title,
            description: description,
            image: Image.url,
            videos: cloudinaryVideosPaths
        })

        if (!newMedia) {
            throw res.status(400).json({ message: "Failed to create new media" });
        }

        return res.status(200).json({ data: newMedia, message: "New Video posted successfully" });
    } catch (error) {
        console.log("Error in Creating  Media files in Database", error);
        return res.status(401).json(error);
    }
}

const deleteVideo = async (req, res) => {
    try {


        // const id = req.params.id;
        // console.log(id);

        const { id } = req.params;
        if (!id) {
            throw new Error('Error in Geting video');
        }

        const deletedVideo = await Media.findByIdAndDelete(id);
        if (!deletedVideo) {
            throw new Error('Video not found');
        }

        return res.status(200).json({ data: deletedVideo, message: "Video deleted successfully" });
    } catch (error) {
        console.log("Error in deleting Video form Database", error);
    }
}

const updateVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const { id } = req.params;
        if (!id) {
            throw new Error('Error in Geting video');
        }
        const updatedVideo = await Media.findByIdAndUpdate(
            id,
            {
                $set: {
                    title: title,
                    description: description,
                }
            }
            , { new: true }
        );

        if (!updatedVideo) {
            throw new Error('Video not found');
        }

        // Rest of your code...
        return res.status(200).json({ data: updatedVideo, message: "Video  updated successfully" });
    } catch (error) {
        console.log("Error in Updating form Database", error);
    }
}
export { getmedia, postmedia, deleteVideo, updateVideo };