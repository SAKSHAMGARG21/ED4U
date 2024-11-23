
import { CourseProgress } from "../modules/coursesProgress.model.js";
import { Subsection } from "../modules/Subsection.model.js";
import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateCourseProgress = asyncHandler(async (req, res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user._id;


    const subSection = await Subsection.findById(subSectionId);

    if (!subSection) {
        throw new ApiError(404,"Invalid SubSection")
    }

    const courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId
    })

    if (!courseProgress) {
        throw new ApiError("Course Progress does not exist")
    }
    else {
        if (courseProgress.completedVideos.includes(subSectionId)) {
            throw new ApiError(404,"Video Already Completed");
        }

        courseProgress.completedVideos.push(subSectionId);
        console.log("Copurse Progress Push Done");
    }
    await courseProgress.save();
    console.log("Course Progress Save call Done");
    return res.status(200).json(
        new ApiResponse(200,courseProgress,"Course Progress Updated Successfully")
    )
})