import { Course } from "../modules/courses.model.js";
import { Section } from "../modules/Section.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createSection = asyncHandler(async (req, res) => {
    const { sectionName, courseId } = req.body;

    if (!(sectionName || courseId)) {
        throw new ApiError(401, "all fields are required");
    }

    const newSection = await Section.create({ sectionName })

    const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId,
        {
            $push: {
                courseContent: newSection._id
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, {createdSection:newSection, updatedSecion:updatedCourseDetails }, "Section created Successfully")
    )


})

const updateSection = asyncHandler(async (req, res) => {
    const { newSectionName, sectionId } = req.body;

    if (!(newSectionName || sectionId)) {
        throw new ApiError(401, "all fields are Required section name");
    }

    const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        {
            sectionName: newSectionName,
        },
        {
            new: true
        }
    );

    if (!updatedSection) {
        throw new ApiError(401,
            "Error in updating Section name"
        )
    }

    return res.status(200).json(
        new ApiResponse(200, updatedSection, "Secton updated Successfully")
    )
})

const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId, courseId } = req.body;

    if (!sectionId) {
        throw new ApiError(401, " section id required")
    }

    const deletedsection = await Section.findByIdAndDelete(sectionId);

    const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId,
        {
            $pull: {
                courseContent: sectionId
            }
        },
        {
            new: true
        }
    )


    return res.status(200).json(
        new ApiResponse(200, {deletedSection:deletedsection, updatedSecion:updatedCourseDetails}, "Section deleted Successfully")
    )
})

export {
    createSection,
    updateSection,
    deleteSection
}