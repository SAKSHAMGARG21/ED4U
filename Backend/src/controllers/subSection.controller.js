import { Section } from "../modules/Section.model.js";
import { Subsection } from "../modules/Subsection.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";

const createSubSection = asyncHandler(async (req, res) => {

    const { sectionId, title, timeDuration, description } = req.body;

    if (!(sectionId || title || timeDuration || description)) {
        throw new ApiError(401, "all fields are required")
    }

    const videofile = req.file?.path;
    console.log(videofile);

    const uploadedfileDetails = await uploadOnCloudinary(videofile, process.env.CLOUDINARY_FOLDER_NAME);

    const duration = (uploadedfileDetails) ? `${convertSecondsToDuration(uploadedfileDetails.duration)}` : timeDuration;
    const url = (uploadedfileDetails) ? uploadedfileDetails.secure_url : "";

    const newSubsection = await Subsection.create({
        title,
        timeDuration: duration,
        description,
        VideoUrl: url
    })

    if (!newSubsection) {
        throw new ApiError(400, "Error in creating sub section in db");
    }

    const updateSeciontDetails = await Section.findByIdAndUpdate({ _id: sectionId }
        , {
            $push: {
                subsection: newSubsection._id
            }
        }, { new: true }).populate("subsection");

    if (!updateSeciontDetails) {
        throw new ApiError(400, "Error in updating Section data");
    }

    return res.status(200).json(
        new ApiResponse(200,
            { newSection: newSubsection, upatedsection: updateSeciontDetails },
            "subsection created successfully"
        )
    )
})

const upateSubSection = asyncHandler(async (req, res) => {

    const { sectionId, title, timeDuration, description } = req.body;

    if (!(sectionId || title || timeDuration || description)) {
        throw new ApiError(401, "all fields are required")
    }

    const videofile = req.file?.path;

    const uploadedfileDetails = await uploadOnCloudinary(videofile, process.env.CLOUDINARY_FOLDER_NAME);

    const duration = (uploadedfileDetails) ? `${convertSecondsToDuration(uploadedfileDetails.duration)}` : timeDuration;
    const url = (uploadedfileDetails) ? uploadedfileDetails.secure_url : "";

    const updatedSubsection = await Subsection.findByIdAndUpdate(
        { _id: sectionId },
        {
            title,
            timeDuration:duration,
            description,
            VideoUrl: url
        },
        {
            new: true
        }
    )

    if (!updatedSubsection) {
        throw new ApiError(400, "Error in updateing sub section in db");
    }

    return res.status(200).json(
        new ApiResponse(200,
            updatedSubsection,
            "subsection updated successfully"
        )
    )

})

const deleteSubSection = asyncHandler(async (req, res) => {

    const { subsectionId, sectionId } = req.body;

    const deletedSubSection = await Subsection.findByIdAndDelete(subsectionId);

    const updateSectionDetails = await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
            $pull: {
                subsection: subsectionId
            }
        }, 
        { 
            new: true
        }
    )

    if (!updateSectionDetails) {
        throw new ApiError(400, "Error in updating Section data");
    }

    return res.status(200).json(
        new ApiResponse(200,
            { deletedSubSection: deletedSubSection, updatedsection: updateSectionDetails },
            "Subsection deleted Successfully"
        )
    )
})

export {
    createSubSection,
    upateSubSection,
    deleteSubSection,
}