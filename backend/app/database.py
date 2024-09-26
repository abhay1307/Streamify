import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
USER_COLLECTION = os.getenv("USER_COLLECTION")
MEDIA_COLLECTION = os.getenv("MEDIA_COLLECTION")

# MongoDB client setup (create once and reuse)
mongo_client = MongoClient(MONGO_URI)


# Dependency to get the MongoDB client
def get_mongo_client():
    try:
        yield mongo_client
    except Exception as e:
        raise e  # Log or handle exceptions as needed
