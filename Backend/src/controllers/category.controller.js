import { Category } from "../modules/category.model.js";
import { Course } from "../modules/courses.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!(name || description)) {
        throw new ApiError(401, "All details are required");
    }

    const newTag = await Category.create({
        name,
        description
    });

    if (!newTag) {
        throw new ApiError(401, "Error in creating Tag in DB");
    }

    return res.status(200).json(
        new ApiResponse(200, newTag, "Tag Created successfully")
    )
})

const getAllCategory = asyncHandler(async (req, res) => {
    const alltags = await Category.find({});
    return res.status(200).json(
        new ApiResponse(200, alltags, "All category fetched successfully")
    )
})

const categoryPageDetails = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    const selectedCourses = await Category.findById(courseId).populate("courses");

    if (!selectedCourses) {
        throw new ApiError(401, "Data not found");
    }

    const differentCategories = await Category.find(
        {
            _id: {
                $ne: courseId
            }
        }
    ).populate("courses").exec();

    if (!differentCategories) {
        throw new ApiError(401, "Data not found for Different Categories");
    }

    // top courses
    const trendingCourses = await Course.aggregate([
        {
            $project: {
                name: 1,
                studentsCount: {
                    $size: "$studentsEnrolled"
                }
            }
        },
        { $sort: { studentsCount: -1 } }
    ]);


    return res.status(200).json(
        200,
        {
            selectedCourses: selectedCourses,
            differentCategories: differentCategories,
            trendingCourses: trendingCourses
        },
        "Categories data fetched Successfully"
    )
})

export {
    createCategory,
    getAllCategory,
    categoryPageDetails
}