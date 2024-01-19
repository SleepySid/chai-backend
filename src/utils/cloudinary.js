import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath , user , type) => {
    try {
        if (!localFilePath) {
            return null
        }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder : "backend",
            resource_type: "auto",
            public_id : `${user.username.toLowerCase()}${type}${user.email}`
            //display_name : `${user.username.toLowerCase()} ${type}`,

        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudnary = async( user , type) => {
    console.log(user)
    try {
        if(!(user.username && user.email)){
            throw new ApiError(400,"no users sent")
        }
        const public_id = `${user.username.toLowerCase()}${type}${user.email}`
        await cloudinary.api.delete_resources(public_id, 
                    { type: 'upload', resource_type: 'image' })
                    .then(console.log("resource deleted "))
                    .catch(e => {
                        throw new ApiError(500,"something went wrong" , e)
                    })
            
    } catch (error) {
        throw new ApiError(400 ,"Error while removing resource")
    }
}



export {uploadOnCloudinary
    ,deleteFromCloudnary}