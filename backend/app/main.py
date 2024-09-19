from fastapi import FastAPI
from .config import supabase

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/yoga-classes")
async def get_yoga_classes():
    response = supabase.table("yoga_classes").select("*").execute()
    return response.data