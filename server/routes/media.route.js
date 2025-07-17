const express=require("express");
const upload = require("../utils/multer");
const {uploadMedia}=require("../utils/cloudinary");
const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async(req,res) => {
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            success:true,
            message:"File uploaded successfully.",
            data:result
        });
    } catch (error) {
        console.error("Upload Error:", error); 
        res.status(500).json({message:"Error uploading file"})
    }
});
module.exports = router;