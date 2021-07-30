import { AccountModel } from '@/domain/models'

// Este type está diretamente relacionada a esse use case AddAccount por esse motivo foi colocada no mesmo arquivo.
export type AddAccountParams = Omit<AccountModel, 'id'> // Classe Utilitaria Omit, permite usar uma classe pronta omitindo uma propriedade especifica

export type AddAccount = {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
