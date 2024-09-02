export type UserDto = {
    login: string
    password: string
    email: string

}


export const testingDtosCreator = {
    createUserDto({login, email, pass}: {
        login?: string, email?: string, pass?: string
    }): UserDto {
        return {
            login: login ?? 'test32',
            password: pass ?? '123456789',
            email: email ?? 'test@gmail.com',


        }
    }
}