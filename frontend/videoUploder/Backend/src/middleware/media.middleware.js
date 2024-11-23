import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync("public")) {
            fs.mkdirSync("public");
        }
        if (!fs.existsSync("public/videos")) {
            fs.mkdirSync("public/videos");
        }
        cb(null, 'public/videos');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.mkv' && ext !== ".mp4" && ext !== ".png" && ext !== ".jpeg") {
            return cb(new Error("Only Videos are allowed"));
        }
        cb(null, true);
    }
})