import { Category } from "../modules/category.model.js";
import { Course } from "../modules/courses.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!(name || description)) {
        throw new ApiError(404, "All details are required");
    }

    const newTag = await Category.create({
        name,
        description
    });

    if (!newTag) {
        throw new ApiError(404, "Error in creating Tag in DB");
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
    const {categoryId} = req.body;

    // console.log(categoryId);
    const selectedCourses = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" }
        });

    if (!selectedCourses) {
        throw new ApiError(404, "Data not found");
    }

    const differentCourses = await Category.find(
        {
            _id: {
                $ne: categoryId
            }
        }
    ).populate({
        path: "courses",
        match: { status: "Published" },
        // populate: {
        //     path:"instructor"
        // }
        // populate:"ratingAndReviews"
    }).exec();

    if (!differentCourses) {
        throw new ApiError(404, "Data not found for Different Categories");
    }

    // top courses
    // const trendingCourses = await Course.aggregate([
    //     {
    //         $project: {
    //             courseName: 1,
    //             courseDescription:1,

    //             studentsCount: {
    //                 $size: "$studentsEnrolled"
    //             }
    //         }
    //     },
    //     { $sort: { studentsCount: -1 } }
    // ])

    const trendingCourses = await Course.aggregate([
        {
            $match: {
                status: "Published" // Filter for published courses
            }
        },
        {
            $addFields: {
                studentsCount: {
                    $size: "$studentsEnrolled"
                }
            }
        },
        { $sort: { studentsCount: -1 } }
    ])


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                selectedCourses: selectedCourses,
                differentCourses: differentCourses,
                trendingCourses: trendingCourses
            },
            "Categories data fetched Successfully"
        )
    )
})

export {
    createCategory,
    getAllCategory,
    categoryPageDetails
}