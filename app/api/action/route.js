
import { NextResponse } from "next/server";
const { MongoClient } = require("mongodb");


export async function POST(request) {
    console.log("hello from action");
    let {action,slug,intitialquantity} = await request.json();
let r= request;
    const uri = "mongodb+srv://user2:hDGOZrbuymVIuE8W@stcok-managment.sdarjny.mongodb.net/";
    const client = new MongoClient(uri);

    try {

        const database = client.db('Dhrumit');
        const inventory = database.collection('inventory');
        const filter = { slug: slug }
        
        let newQuantity = action == "add" ? (parseInt(intitialquantity) + 1) : (parseInt(intitialquantity) - 1)
        console.log(newQuantity)
        const updateDoc = {
            $set: {
                "quantity": newQuantity.toString()
            },
        };
        const result = await inventory.updateOne(filter, updateDoc, {});
        console.log(result);

        // return newQuantity;
        return NextResponse.json({ success: true, message:`${result.matchedCount} documents matched the filter , updated ${result.modifiedCount} documenst` })

} finally {
    await client.close();

    // Ensures that the client will close when you finish/error
}
  }