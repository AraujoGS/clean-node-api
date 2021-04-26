export class UpdateAccessTokenRepository {
  update: (id: string, token: string) => Promise<void>
}
