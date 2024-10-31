
import {ObjectId, OptionalId} from "mongodb";
import {PostDBType} from "../../../common/types/DBtypes";
import {db} from "../../../common/db/mongo-db";
import {PostModel} from "../../../common/db/mongoose/mongooseSchemas";


export class PostDbRepository {

    async postPOST(newPost: PostDBType):Promise<string> {

        const res = await PostModel.insertMany([newPost])

        return res[0]._id.toString()

    }
    async uptadePostById(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
        const result = await PostModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })

        if (result.matchedCount === 1) {
            return true
        }
        return false

    }
    async deletePostById(id: string):Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)})
        if (result.deletedCount === 1) {
            return true
        }
        return false
    }

}
/////////////////////////////////////////////

// export const postRepositories = {
//
//     async postPOST(newPost: PostDBType):Promise<string> {
//
//         const res = await PostModel.insertMany([newPost])
//
//         return res[0]._id.toString()
//
//     },
//     async uptadePostById(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
//         const result = await PostModel.updateOne({_id: new ObjectId(id)}, {
//             $set: {
//                 title: title,
//                 shortDescription: shortDescription,
//                 content: content,
//                 blogId: blogId
//             }
//         })
//
//         if (result.matchedCount === 1) {
//             return true
//         }
//         return false
//
//     },
//     async deletePostById(id: string):Promise<boolean> {
//         const result = await PostModel.deleteOne({_id: new ObjectId(id)})
//         if (result.deletedCount === 1) {
//             return true
//         }
//         return false
//     }
//
//
//
// }


