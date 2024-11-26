import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { BigPlayButton, Player } from "video-react"
import 'video-react/dist/video-react.css';

// import { AiFillPlayCircle } from "react-icons/ai"
import IconBtn from '../../common/IconBtn';
import { markLectureCompleted } from '../../../services/operations/courseApi';

const VideoDetails = () => {
    const { courseId, sectionId, subsectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const { token } = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);
    const [previewSource, setPreviewSource] = useState("");
    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setVideoSpecificDetails = () => {
            // console.log("In VideoDetails, courseSectionData",courseSectionData)
            if (!courseSectionData.length)
                return;
            if (!courseId && !sectionId && !subsectionId) {
                navigate("/dashboard/enrolled-courses");
            }
            else {
                //let's assume k all 3 fields are present

                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                )

                const filteredVideoData = filteredData?.[0].subsection.filter(
                    (data) => data._id === subsectionId
                )

                setVideoData(filteredVideoData[0]);
                setPreviewSource(courseEntireData.thumbnail)
                setVideoEnded(false);
            }
        }
        setVideoSpecificDetails();
        // console.clear()
    }, [courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex(
            (data) => data._id === subsectionId
        )
        if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex(
            (data) => data._id === subsectionId
        )

        if (currentSectionIndex === courseSectionData.length - 1 &&
            currentSubSectionIndex === noOfSubSections - 1) {
            return true;
        }
        else {
            return false;
        }

    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex(
            (data) => data._id === subsectionId
        )

        if (currentSubSectionIndex !== noOfSubSections - 1) {
            //same section ki next video me jao
            const nextSubSectionId = courseSectionData[currentSectionIndex].subsection[currentSectionIndex + 1]._id;
            //next video pr jao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }
        else {
            //different section ki first video
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subsection[0]._id;
            ///iss voide par jao 
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo = () => {

        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex(
            (data) => data._id === subsectionId
        )

        if (currentSubSectionIndex != 0) {
            //same section , prev video
            const prevSubSectionId = courseSectionData[currentSectionIndex].subsection[currentSubSectionIndex - 1]._id;
            //iss video par chalge jao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        }
        else {
            //different section , last video
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subsection.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subsection[prevSubSectionLength - 1]._id;
            //iss video par chalge jao
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion = async () => {

        ///dummy code, baad me we will replace it witht the actual call
        setLoading(true);
        //PENDING - > Course Progress PENDING
        const res = await markLectureCompleted({ courseId: courseId, subSectionId: subsectionId }, token);
        //state update
        if (res) {
            dispatch(updateCompletedLectures(subsectionId));
        }
        setLoading(false);

    }
    return (
        <div className="flex flex-col gap-5 text-white">
            {
                !videoData ? (<img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />)
                    : (
                        <Player
                            ref={playerRef}
                            aspectRatio="16:9"
                            playsInline
                            onEnded={() => setVideoEnded(true)}
                            src={videoData?.VideoUrl}
                        >
                            <BigPlayButton position="center" />
                            {
                                videoEnded && (
                                    <div style={{
                                        backgroundImage:
                                            "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                                    }}
                                        className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                                    >
                                        {
                                            !completedLectures.includes(subsectionId) && (
                                                <IconBtn
                                                    disabled={loading}
                                                    onclick={() => handleLectureCompletion()}
                                                    text={!loading ? "Mark As Completed" : "Loading..."}
                                                    customClasses="text-xl max-w-max px-4 mx-auto"
                                                />
                                            )
                                        }

                                        <IconBtn
                                            disabled={loading}
                                            onclick={() => {
                                                if (playerRef?.current) {
                                                    playerRef.current?.seek(0);
                                                    setVideoEnded(false);
                                                }
                                            }}
                                            text="Rewatch"
                                            customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                                        />

                                        <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                            {!isFirstVideo() && (
                                                <button
                                                    disabled={loading}
                                                    onClick={goToPrevVideo}
                                                    className='blackButton'
                                                >
                                                    Prev
                                                </button>
                                            )}
                                            {
                                                !isLastVideo() && (
                                                    <button
                                                        disabled={loading}
                                                        onClick={goToNextVideo}
                                                        className='blackButton'>
                                                        Next
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </Player>
                    )
            }
            <h1 className="mt-4 text-3xl font-semibold">
                {videoData?.title}
            </h1>
            <p className="pt-2 pb-6">
                {videoData?.description}
            </p>
        </div>
    )
}

export default VideoDetails