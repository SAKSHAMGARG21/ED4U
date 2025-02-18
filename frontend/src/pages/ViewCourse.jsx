import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { getFullCourseDetails } from '../services/operations/courseApi';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import CourseReviewModal from '../components/Core/ViewCourse/CourseReviewModal';
import VideoDetailsSidebar from '../components/Core/ViewCourse/VideoDetailsSidebar';

function ViewCourse() {
    const [reviewModal, setReviewModal] = useState(false);
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {

        const setCourseSpecificDetails =async () => {

            const courseData =await getFullCourseDetails(courseId, token);
            console.log("Full course Deatils data ->>>", courseData);

            dispatch(setEntireCourseData(courseData.course));
            dispatch(setCourseSectionData(courseData?.course.courseContent));
            dispatch(setCompletedLectures(courseData?.competedVideos));

            let lectures = 0;
            courseData.course.courseContent.forEach((sec) => {
                lectures += sec.subsection.length
            })

            dispatch(setTotalNoOfLectures(lectures));
        }
        setCourseSpecificDetails();

    }, [courseId]);

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>
                {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}
            </div>
        </>
    )
}

export default ViewCourse