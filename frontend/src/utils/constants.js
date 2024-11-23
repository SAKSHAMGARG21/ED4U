export const ACCOUNT_TYPE = {
    STUDENT: "Student",
    INSTRUCTOR: "Instructor",
    ADMIN: "Admin",
}

export const COURSE_STATUS = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
}

export const conf = {
    bkurl: String(import.meta.env.VITE_BACKEND_URI),
    razorpayKey :String(import.meta.env.VITE_RAZORPAY_KEY),
    razorpaySecret :String(import.meta.env.VITE_RAZORPAY_SECRET),
}