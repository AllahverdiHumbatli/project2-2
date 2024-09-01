import {db} from "../../../common/db/mongo-db";
import {ObjectId, WithId } from "mongodb";
import {UserDBType} from "../../../common/types/DBtypes";
import {CurrentUserViewModel, UsersQueryViewModel, UsersViewModel, UserViewModel} from "./view-models/UserViewModels";
export const usersQueryRepositories = {
   mapToOutOutPut(user: WithId<UserDBType>){
      return {
         id: user._id.toString() ,
         login: user.login,
         email: user.email,
         createdAt: user.createdAt
      }
   },
   async getUsers(query: UsersQueryViewModel):Promise<UsersViewModel> {
      const searchLogin = query.searchLoginTerm
          ? {login: {$regex: query.searchLoginTerm, $options: 'i'}}
          : {}
      const searchEmail = query.searchEmailTerm
          ? {email: {$regex: query.searchEmailTerm, $options: 'i'}}
          : {}
      const filter = {
         ...searchLogin,
         ...searchEmail,
      }
      console.log("фильтр", filter)
      try {
         const sortDirection: 'asc' | 'desc' = query.sortDirection === 'asc' ? 'asc' : 'desc';

         const totalCount = await db.getCollections().userCollection.countDocuments({$or: [searchLogin, searchEmail]})
         const items = await db.getCollections().userCollection
             .find({$or: [searchLogin, searchEmail]})
             .sort(query.sortBy, sortDirection) //сюда передаются строки
             .skip((query.pageNumber - 1) * query.pageSize)
             .limit(query.pageSize)
             .toArray() as any[] /*SomePostType[]*/


         // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
         return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: items.map(this.mapToOutOutPut)
         }
      } catch (e) {
         console.log(e)
         return {error: 'some error'}
      }
   },
   async getUserById(id: string):Promise<false|UserViewModel> {
      const res :WithId<UserDBType> | null = await db.getCollections().userCollection.findOne({ _id: new ObjectId(id) })
      if(res){
         return this.mapToOutOutPut(res)
      }
      return false
   },
   async getCurrentUser(userId: string): Promise<CurrentUserViewModel> {
      const res:false|UserViewModel = await this.getUserById(userId)
      if(res){
         return {
            email: res.email,
            login: res.login,
            userId: userId
         }
      }
      return null
   }
}