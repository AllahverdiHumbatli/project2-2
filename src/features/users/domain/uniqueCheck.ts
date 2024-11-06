import {ValidationErrorForLoginEmail} from "../api/view-models/UserViewModels";
import {UsersModel} from "../../../common/db/mongoose/mongooseSchemas";

export async function isDataUnique(login: string, email: string):Promise<string|ValidationErrorForLoginEmail> {
    let error: ValidationErrorForLoginEmail = []
    const uniqueCheckForLogin = await UsersModel.findOne({login: login})
    if (uniqueCheckForLogin) {
        error.push({message: 'login should be unique', field: 'login'})
    }
    const uniqueCheckForEmail = await UsersModel.findOne({email: email})
    if (uniqueCheckForEmail) {
        error.push({message: 'Email should be  unique', field: 'email',})
    }
    if (error.length > 0) { return error }

    return "it's unique"
}