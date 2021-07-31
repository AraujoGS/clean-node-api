import { AuthenticationModel } from '@/domain/models'

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }
  export type Result = AuthenticationModel
}

export interface Authentication {
  auth: (params: Authentication.Params) => Promise<Authentication.Result>
}
