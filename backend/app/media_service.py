import os
import requests
from typing import Optional
from dotenv import load_dotenv
from pydantic import BaseModel
from pymongo import MongoClient
from app.utils import generate_video_id
from app.database import get_mongo_client, MONGO_DB, MEDIA_COLLECTION
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status


load_dotenv()

router = APIRouter()

TRANSCODE_URL = os.getenv("TRANSCODE_URL")
upload_endpoint = f"{TRANSCODE_URL}/upload/"
transcode_endpoint = f"{TRANSCODE_URL}/transcode/"


# Generate unique video id
@router.get("/get_unique_video_id", tags=["Media Services"])
async def get_unique_video_id(mongo_client: MongoClient = Depends(get_mongo_client)) -> str:

    media_collection = mongo_client[MONGO_DB][MEDIA_COLLECTION]

    while True:
        # Generate a random video ID
        video_id = generate_video_id()
        # Check if the video ID already exists in the media collection
        video = await media_collection.find_one({"v_id": video_id})
        if not video:  # If no video with this ID exists, we have a unique ID
            return video_id  # Return the unique video ID


@router.post("/upload_media", tags=["Media Services"])
async def upload_media(
        folder_name: str = Form(...),
        banner_file: UploadFile = File(...),
        video_file: UploadFile = File(...),
        title: str = Form(...),
        description: str = Form(...),
        genre: str = Form(...),
        trending: Optional[bool] = Form(None),
        new: Optional[bool] = Form(None),
        mongo_client=Depends(get_mongo_client)
):
    try:
        # Read files in binary mode
        banner_data = await banner_file.read()
        video_data = await video_file.read()

        # Prepare files for upload
        files = {
            "banner_file": (banner_file.filename, banner_data, banner_file.content_type),
            "video_file": (video_file.filename, video_data, video_file.content_type),
        }

        params = {"folder_name": folder_name}
        data = {
            "title": title,
            "description": description,
            "genre": genre,
            "trending": trending,
            "new": new
        }
        response = requests.post(upload_endpoint, files=files, data=data, params=params)

        response.raise_for_status()  # Raise exception for non-200 status codes
        # If the upload was successful, save the response to MongoDB
        if response.status_code == 200:
            db = mongo_client[MONGO_DB]
            media_collection = db[MEDIA_COLLECTION]
            response_data = response.json()
            video_id = str(generate_video_id())
            media_data = {
                "v_id": video_id,
                "folder_name": response_data.get("folder_name"),
                "banner_s3_path": response_data.get("banner_s3_path"),
                "video_s3_path": response_data.get("video_s3_path"),
                "banner_uploaded_file_name": response_data.get("banner_uploaded_file_name"),
                "video_uploaded_file_name": response_data.get("video_uploaded_file_name"),
                "title": title,
                "description": description,
                "genre": genre,
                "trending": trending,
                "new": new
            }

            result = media_collection.insert_one(media_data)  # Insert the data into MongoDB
            media_data["_id"] = str(result.inserted_id)   # Convert the ObjectId to string for the response

            return {"message": "Files uploaded and saved successfully in media_master.", "data": media_data}

    except requests.RequestException as e:
        print(f"RequestException: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading files: {e}")
    except Exception as e:
        print(f"Unexpected exception: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")


class VideoRequest(BaseModel):
    v_id: str
    genre: str
    cast: str
    description: str


@router.post("/update_video_info", tags=["Media Services"])
async def update_video_info(video_request: VideoRequest, mongo_client=Depends(get_mongo_client)):
    try:
        db = mongo_client[MONGO_DB]
        media_collection = db[MEDIA_COLLECTION]
        v_id = video_request.v_id
        # Check if file exists in the media collection
        video = media_collection.find_one({"v_id": str(v_id)}, {"_id": 0})
        if not video:
            return {
                "success": False,
                "status_code": status.HTTP_404_NOT_FOUND,
                "detail": "File not found!"
            }
        video_folder = video.get("folder_name")
        video_file = video.get("video_uploaded_file_name")
        # Prepare files for transcode
        params = {"folder_name": video_folder, "filename": video_file}
        response = requests.post(transcode_endpoint, params=params)

        response.raise_for_status()  # Raise exception for non-200 status codes
        # If the upload was successful, save the response to MongoDB
        if response.status_code == 200:
            db = mongo_client[MONGO_DB]
            media_collection = db[MEDIA_COLLECTION]
            response_data = response.json()
            media_data = {
                "genre": video_request.genre,
                "cast": video_request.cast,
                "plot": video_request.description,
                "transcode_files": response_data.get("files"),
            }

            result = media_collection.update_one({"v_id": v_id}, {"$set": media_data})

            if result.modified_count == 0:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No changes were made")
            else:
                return {"success": True, "status_code": 200, "message": "Updated successfully", "data": v_id}

    except requests.RequestException as e:
        print(f"RequestException: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading files: {e}")
    except Exception as e:
        print(f"Unexpected exception: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
