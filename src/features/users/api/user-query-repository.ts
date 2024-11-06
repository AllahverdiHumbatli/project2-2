import {ObjectId, WithId } from "mongodb";
import {UserDBType} from "../../../common/types/DBtypes";
import {CurrentUserViewModel, UsersQueryViewModel, UsersViewModel, UserViewModel} from "./view-models/UserViewModels";
import {UsersModel, UsersSessionsModel} from "../../../common/db/mongoose/mongooseSchemas";
export class UserQueryRepository  {
   mapToOutOutPut(user: WithId<UserDBType>){
      return {
         id: user._id.toString() ,
         login: user.login,
         email: user.email,
         createdAt: user.createdAt
      }
   }
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

         const totalCount = await UsersModel.countDocuments({$or: [searchLogin, searchEmail]})
         const items = await UsersModel
             .find({$or: [searchLogin, searchEmail]})
             .sort({ [query.sortBy]: sortDirection }) //сюда передаются строки
             .skip((query.pageNumber - 1) * query.pageSize)
             .limit(query.pageSize)
             .lean() /*SomePostType[]*/


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
   }
   async getUserById(id: string):Promise<false|UserViewModel> {
      const res :WithId<UserDBType> | null = await UsersModel.findOne({ _id: new ObjectId(id) })
      return res ? this.mapToOutOutPut(res) : false
   }
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
   async getAllSessionsForUser(userId: string) {
      const sessionsDBtype =  await UsersSessionsModel.find({"user_id": userId}).lean();
      return sessionsDBtype.map(session => ({
         ip: session.ip,
         title: session.device_name,
         lastActiveDate: new Date(session.iat * 1000).toISOString(),
         deviceId: session.device_id,
      }));
   }
}

//////////////////////////////////////
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

         const totalCount = await UsersModel.countDocuments({$or: [searchLogin, searchEmail]})
         const items = await UsersModel
             .find({$or: [searchLogin, searchEmail]})
             .sort({ [query.sortBy]: sortDirection }) //сюда передаются строки
             .skip((query.pageNumber - 1) * query.pageSize)
             .limit(query.pageSize)
             .lean() /*SomePostType[]*/


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
      const res :WithId<UserDBType> | null = await UsersModel.findOne({ _id: new ObjectId(id) })
      return res ? this.mapToOutOutPut(res) : false
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
   },
   async getAllSessionsForUser(userId: string) {
    const sessionsDBtype =  await UsersSessionsModel.find({"user_id": userId}).lean();
      return sessionsDBtype.map(session => ({
         ip: session.ip,
         title: session.device_name,
         lastActiveDate: new Date(session.iat * 1000).toISOString(),
         deviceId: session.device_id,
      }));
   }
}