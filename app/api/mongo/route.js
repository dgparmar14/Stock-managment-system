import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
export async function GET (request){


const uri = "mongodb+srv://user2:hDGOZrbuymVIuE8W@stcok-managment.sdarjny.mongodb.net/";

const client = new MongoClient(uri);


  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const movie = await movies.findOne(query);

    console.log(movie);
    return NextResponse.json({"a":34})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}