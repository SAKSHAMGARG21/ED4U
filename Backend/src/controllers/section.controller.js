import { Course } from "../modules/courses.model.js";
import { Section } from "../modules/Section.model.js";
import { Subsection } from "../modules/Subsection.model.js";
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
    ).populate({
        path: "courseContent",
        populate: {
            path: "subsection"
        }
    })

    return res.status(200).json(
        new ApiResponse(200, { createdSection: newSection, updatedCourseDetails: updatedCourseDetails }, "Section created Successfully")
    )


})

const updateSection = asyncHandler(async (req, res) => {
    const { SectionName, sectionId, courseId } = req.body;

    if (!(SectionName || sectionId || courseId)) {
        throw new ApiError(401, "all fields are Required section name");
    }

    const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        {
            sectionName: SectionName,
        },
        {
            new: true
        }
    );

    const updatedCourse = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subsection"
            }
        });

    if (!updatedSection) {
        throw new ApiError(401,
            "Error in updating Section name"
        )
    }

    return res.status(200).json(
        new ApiResponse(200, { updatedSection: updatedSection, updatedCourse: updatedCourse }, "Secton updated Successfully")
    )
})

const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId, courseId } = req.body;

    if (!sectionId) {
        throw new ApiError(401, " section id required")
    }

    const section = await Section.findById(sectionId);
    const Subsections = section.subsection;
    for (const subsectionId in Subsections) {
        await Subsection.findByIdAndDelete(subsectionId);
    }

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

    if (!updatedCourseDetails) {
        throw new ApiError(401, "Error in updation of Course in Deletion of Section route");
    }

    const deletedsection = await Section.findByIdAndDelete(sectionId);

    if (!deletedsection) {
        throw new ApiError(401, "Error in deletion of Section");
    }

    return res.status(200).json(
        new ApiResponse(200, { deletedSection: deletedsection, updatedSecion: updatedCourseDetails }, "Section deleted Successfully")
    )
})

export {
    createSection,
    updateSection,
    deleteSection
}