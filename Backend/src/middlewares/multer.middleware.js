import multer from "multer"

const storage = multer.diskStorage({
    distination: function (req, file, cb) {
        cb(null, '../../public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage:storage
})

// The selected code snippet is an example of setting up file upload functionality using the Multer library in a Node.js application. Here's a breakdown of the code:

// 1. `import multer from "multer"`: This line imports the Multer library, which is used for handling multipart/form-data, which is commonly used for file uploads in web applications.

// 2. `const storage = multer.diskStorage({ ... })`: This line defines the storage configuration for Multer. In this case, the storage engine is set to disk storage, which means the uploaded files will be saved to the local file system. The `destination` function specifies the directory where the files will be saved, and the `filename` function determines the name of the saved file. In this example, the files will be saved to the `./public/temp` directory with their original names.

// 3. `export const upload = multer({ storage })`: This line exports a configured Multer instance named `upload`. This instance can be used to handle file uploads in your application. You can use the `upload.single('fieldName')` or `upload.array('fieldName')` methods to handle single or multiple file uploads, respectively. Replace `'fieldName'` with the name of the form field that contains the file(s) you want to upload.

// Overall, this code snippet demonstrates how to set up file upload functionality using Multer in a Node.js application.