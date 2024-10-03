import {db} from "../../../common/db/mongo-db";
import {ObjectId, OptionalId} from "mongodb";
import {BlogDBType} from "../../../common/types/DBtypes";
import {BlogModel} from "../../../common/db/mongoose/mongooseSchemas";



export const blogsRepositories = {

    async postBlog(newBlog:BlogDBType):Promise<string>{
        const res = await BlogModel.insertMany([newBlog])
        return  res[0]._id.toString()
    },
    async updateById(id:string, name:string, description: string, websiteUrl: string):Promise<boolean>{
        const result =  await BlogModel.updateOne({_id: new ObjectId(id)}, {$set: {name: name, description: description, websiteUrl: websiteUrl}})
        if(result.matchedCount === 1){
            return true
        }
        return false
        //
    },
    async deleteById(id: string):Promise<boolean>{
        const result = await BlogModel.deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount === 1 ){ return true }
        return false
    }

}