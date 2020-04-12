from pymongo import MongoClient

class Connect(object):
  @staticmethod
  def get_connection():
    return MongoClient('mongodb+srv://isti:q6HDnipb0CtQpaU1@cluster0-dejvz.mongodb.net/node-angular?retryWrites=true&w=majority')