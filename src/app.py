import os
import sys
from typing import Optional
from pymongo import MongoClient
from bson import ObjectId

import cv2
from dotenv import load_dotenv

# Constants
SRC_PATH = "PATH"
DEST_PATH = "UPLOAD_PATH"
SEPARATOR = os.path.sep

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["images"]
collection = db["images"]

def read_image(file_path: str) -> Optional[cv2.Mat]:
    try:
        image = cv2.imread(file_path)
        if image is None:
            raise FileNotFoundError(f"Image not found at {file_path}")
        return image
    except Exception as e:
        print(f"Error: Reading the image: {e}")
        return None

def convert_to_grayscale(image: cv2.Mat) -> cv2.Mat:
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def save_image(file_path: str, image: cv2.Mat) -> None:
    try:
        cv2.imwrite(file_path, image)
        print(f"Gray image saved at {file_path}")
    except Exception as e:
        print(f"Error: saving the image: {e}")

def update_db(id: ObjectId, size: int) -> None:
    try:
        inImg = collection.find_one({"_id": id})
        opImg = {"fileName": "bw_" + inImg["fileName"],"path": inImg["path"],"mimetype": inImg["mimetype"],"size": size}
        opImg = collection.insert_one(opImg)
        result = collection.find_one_and_update({"_id": id}, {"$set": {"opImageId": opImg["_id"]}})
    except Exception as e:
        print(e);
    

def main() -> None:
    if len(sys.argv) < 2:
        print("Provide the image name as argument")
        return

    load_dotenv()

    objId = ObjectId(sys.argv[1])
    try:
        inImg = collection.find_one({"_id": objId})
        file_name = inImg["fileName"]
        full_path = os.path.join(os.path.abspath(os.curdir),inImg["path"])
        if full_path is None:
            raise "Input image path is not valid"
        dest_dir = os.path.dirname(full_path)
        if dest_dir is None:
            raise "Output image dir is not valid"
    except Exception as e:
        print(e)
        exit(1)

    image = read_image(full_path)
    if image is None:
        return

    print("Document acquired")

    gray_img = convert_to_grayscale(image)
    size = gray_img.size

    if len(gray_img.shape) == 2:
        print("The image has been successfully converted to grayscale.")
    else:
        print("Warning: The image is not in grayscale.")

    fuLL_dest_path = os.path.join(dest_dir,"bw_" + inImg["path"].split("\\")[1])
    print("Dest path: ", fuLL_dest_path)
    save_image(fuLL_dest_path,gray_img)
    
    try:
        # insert the image in db
        opImg = {"fileName": "bw_" + file_name,"path": inImg["path"],"mimetype": inImg["mimetype"],"size": size}
        collection.insert_one(opImg)
        print("Output image added to DB")

        # update the input image
        collection.find_one_and_update({"_id": objId}, {"$set": {"opImageId": opImg["_id"]}})
        print("Input image entry updated")
    except Exception as e:
        print(e)

    client.close()    

if __name__ == "__main__":
    main()