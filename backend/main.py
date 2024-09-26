from fastapi import FastAPI
from app.utils import router as utils_router
from app.callback import router as callback_router
from starlette.middleware.cors import CORSMiddleware
from app.verify_token import router as verify_router
from app.media_list import router as media_list_router
from app.media_service import router as media_service_router


app = FastAPI()


# Allow CORS for development
app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["*"],  # ["http://localhost:3001","https://adequate-renewed-hen.ngrok-free.app/"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Basic"])
def read_root():
    return {"Hello": "Welcome to Streamify Backend"}


# Include the callback router
app.include_router(callback_router)

# Include the callback router
app.include_router(verify_router)

# Include the utils router
app.include_router(utils_router)

# Include the media upload and transcode router
app.include_router(media_service_router)

# Include the media list router
app.include_router(media_list_router)