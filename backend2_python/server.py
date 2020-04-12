from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
from connect import Connect
from pymongo import MongoClient
from bson.objectid import ObjectId
from model import Post


app = FastAPI()
origins = [
  "http://localhost:4200",
  "http://localhost"
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

connection = Connect.get_connection()
db = connection['node-angular']
posts_collection = db.posts

@app.get('/api/posts')
async def get_posts():
  posts = [Post(**post) for post in posts_collection.find({})]
  return {
    'message': 'Posts wrapped successfully',
    'posts': posts
  }

@app.post('/api/posts', status_code=status.HTTP_201_CREATED)
async def add_post(post: Post):
  inserted_post = posts_collection.insert_one(post.dict())
  return {
    'message': "Post has been inserted",
    'id': str(inserted_post.inserted_id)
  }

@app.delete('/api/posts/{postId}')
async def delete_post(postId: str):
  print(ObjectId(postId))
  delete_result = posts_collection.delete_one({
    '_id': ObjectId(postId)
  })
  message = "No posts deleted." if delete_result.deleted_count < 1 else f"{delete_result.deleted_count} record(s) deleted."
  return { 'message': message }

@app.put('/api/posts/{item_id}')
async def put_post(item_id, post: Post):
  print(item_id)
  print(post)
  return {}