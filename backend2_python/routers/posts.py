from fastapi import APIRouter
from starlette import status
from connect import Connect
from bson.objectid import ObjectId

from models.model import Post

posts_route = APIRouter()

connection = Connect.get_connection()
db = connection['node-angular']
posts_collection = db.posts

@posts_route.get('', tags=['posts'])
async def get_posts():
  posts = [Post(**post) for post in posts_collection.find({})]
  return {
    'message': 'Posts wrapped successfully',
    'posts': posts
  }

@posts_route.post('', status_code=status.HTTP_201_CREATED, tags=['posts'])
async def add_post(post: Post):
  inserted_post = posts_collection.insert_one(post.dict())
  return {
    'message': "Post has been inserted",
    'id': str(inserted_post.inserted_id)
  }

@posts_route.delete('/{postId}', tags=['posts'])
async def delete_post(postId: str):
  print(ObjectId(postId))
  delete_result = posts_collection.delete_one({
    '_id': ObjectId(postId)
  })
  message = "No posts deleted." if delete_result.deleted_count < 1 else f"{delete_result.deleted_count} record(s) deleted."
  return { 'message': message }

@posts_route.put('/{item_id}', tags=['posts'])
async def put_post(item_id, post: Post):
  print(item_id)
  print(post)
  return {}
