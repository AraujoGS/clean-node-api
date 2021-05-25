import { AccountModel } from '@/domain/models/account'

// Está type está diretamente relacionada a esse use case AddAccount por esse motivo foi colocada no mesmo arquivo.
export type AddAccountModel = Omit<AccountModel, 'id'> // Classe Utilitaria Omit, permite usar uma classe pronta omitindo uma propriedade especifica

export type AddAccount = {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
