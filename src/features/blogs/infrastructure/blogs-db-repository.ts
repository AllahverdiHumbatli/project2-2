import {db} from "../../../common/db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {BlogDBType} from "../../../common/types/DBtypes";



export const blogsRepositories = {

    async postBlog(newBlog:BlogDBType):Promise<string>{
        const res = await db.getCollections().blogCollection.insertOne(newBlog)
        return  res.insertedId.toString()
    },
    async updateById(id:string, name:string, description: string, websiteUrl: string):Promise<boolean>{
        const result =  await db.getCollections().blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {name: name, description: description, websiteUrl: websiteUrl}})
        if(result.matchedCount === 1){
            return true
        }
        return false
        //
    },
    async deleteById(id: string):Promise<boolean>{
        const result = await db.getCollections().blogCollection.deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount === 1 ){ return true }
        return false
    }

}