from pydantic import BaseModel, Field
from bson.objectid import ObjectId as BsonObjectId


class PydanticObjectId(BsonObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, BsonObjectId):
            raise TypeError('ObjectId required')
        return str(v)


class Post(BaseModel):
  id: PydanticObjectId = None
  title: str
  content: str

  class Config:
    fields = {
      "id": "_id"
    }

