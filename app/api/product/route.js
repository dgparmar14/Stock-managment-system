
import { NextResponse } from "next/server";
const { MongoClient } = require("mongodb");


export async function GET(request) {

  const uri = "mongodb+srv://user2:hDGOZrbuymVIuE8W@stcok-managment.sdarjny.mongodb.net/";
  const client = new MongoClient(uri);

  try {

    const database = client.db('Dhrumit');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const cursor = inventory.find(query);
    const allProducts = await cursor.toArray();

    return NextResponse.json({ "success": true, allProducts })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


export async function POST(request) {

  let body = await request.json();

  const uri = "mongodb+srv://user2:hDGOZrbuymVIuE8W@stcok-managment.sdarjny.mongodb.net/";
  const client = new MongoClient(uri);

  try {

    const database = client.db('Dhrumit');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
  
    const myproduct = await inventory.insertOne(body);

    return NextResponse.json({ myproduct, ok: true })
    console.log("post success fully");

  } finally {

    // Ensures that the client will close when you finish/error
    await client.close();
  }
}