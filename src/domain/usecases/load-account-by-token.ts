import { AccountModel } from '@/domain/models'

export namespace LoadAccountByToken {
  export type Result = AccountModel
}

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<LoadAccountByToken.Result>
}
