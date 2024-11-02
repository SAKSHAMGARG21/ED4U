const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
            catch((err) => next(err));
    }
}

export { asyncHandler }


// const asyncHandler =()=>{}
// const asyncHandler=(fun)=>{()=>{}}
// const asyncHandler=(fun)=>()=>{}
// const asyncHandler = (fun) => async () => { }

// const asyncHandler = (fun) => async (req,res,next) => {
//     try {
//         await fun(req,res,next);
//     } catch (error) {
//         res.status(err.code||500).json({
//             success:false,
//             message:err.message
//         });
//     }
// }