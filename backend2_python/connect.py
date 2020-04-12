from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv('../.env')

class Connect(object):
  @staticmethod
  def get_connection():
    mongo_password = os.getenv('MONGO_PASSWORD')
    return MongoClient(f'mongodb+srv://isti:{mongo_password}@cluster0-dejvz.mongodb.net/node-angular?retryWrites=true&w=majority')
