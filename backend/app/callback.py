import os
import jwt
import pytz
from datetime import datetime
from dotenv import load_dotenv
from pydantic import BaseModel
from app.utils import generate_txn_number
from fastapi import APIRouter, HTTPException, status, Depends
from jwt import ExpiredSignatureError, InvalidTokenError
from app.database import get_mongo_client, MONGO_DB, USER_COLLECTION


load_dotenv()

router = APIRouter()


class TokenRequest(BaseModel):
    token: str


@router.post("/call_back", tags=["Client Management"])
async def call_back(token_request: TokenRequest, mongo_client=Depends(get_mongo_client)):
    db = mongo_client[MONGO_DB]
    user_collection = db[USER_COLLECTION]
    token = token_request.token

    secret_key = os.getenv("SECRET_KEY")
    algorithm = os.getenv("ALGORITHM")
    expected_audience = os.getenv("EXPECTED_AUDIENCE")
    timezone = os.getenv("TIMEZONE", "Asia/Kolkata")

    if not secret_key or not algorithm:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SECRET_KEY or ALGORITHM environment variable is not set properly.",
        )

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm], audience=expected_audience)

        ist_timezone = pytz.timezone(timezone)
        current_time_ist = datetime.now(ist_timezone)
        exp_timestamp = payload.get("exp")

        if exp_timestamp is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token does not have an expiration claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token_expiry_time_utc = datetime.utcfromtimestamp(exp_timestamp).replace(tzinfo=pytz.utc)
        token_expiry_time_ist = token_expiry_time_utc.astimezone(ist_timezone)

        if current_time_ist > token_expiry_time_ist:
            print(f"Token Expired: Current Time {current_time_ist} is greater than Expiry Time {token_expiry_time_ist}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )

        given_name = payload.get('given_name')
        email = payload.get('email')
        birthdate = payload.get('birthdate')
        auth_mode = payload.get('auth_mode')
        user_role = payload.get('user_role')

        txn = generate_txn_number()

        # Check if user with this email exists in the user collection
        user = user_collection.find_one({"email": email})

        if not user:
            new_user = {
                "given_name": given_name,
                "email": email,
                "birthdate": birthdate,
                "user_role": user_role,
                "auth_mode": auth_mode
            }
            user_collection.insert_one(new_user)
            print("Inserted new user data into the database.")
        else:
            print("User already exists in the database.")

        return {
            "success": True,
            "status_code": 200,
            "message": "Token decoded and user data processed successfully",
            "data": {
                "given_name": given_name,
                "email": email,
                "birthdate": birthdate,
                "user_role": user_role,
                "txn": txn,
                "auth_mode": auth_mode
            }
        }

    except ExpiredSignatureError:
        print("Caught ExpiredSignatureError: Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except InvalidTokenError as e:
        print(f"Caught InvalidTokenError: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except Exception as e:
        print(f"Caught Exception: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
