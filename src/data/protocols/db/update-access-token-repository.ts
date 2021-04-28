export class UpdateAccessTokenRepository {
  updateAccessToken: (id: string, token: string) => Promise<void>
}
