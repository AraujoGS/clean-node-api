import { LoadAccountByToken } from '@/domain/usecases'

export namespace LoadAccountByTokenRepository {
  export type Result = LoadAccountByToken.Result
}

export interface LoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<LoadAccountByTokenRepository.Result>
}
