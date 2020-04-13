from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.posts import posts_route

app = FastAPI()

# Origins setting up for CORS
origins = [
  "http://localhost:4200",
  "http://localhost"
]

# Middleware definition, Allowed Headers and Allowed Methods
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["GET", "PUT", "POST", "DELETE"],
  allow_headers=["*"],
)

# Including the posts directory, with post representation.
app.include_router(
  posts_route,
  prefix="/api/posts",
  tags=["posts"]
  )
