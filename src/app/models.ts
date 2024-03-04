export interface CustomThemeConfiguration {
  ThemeFolderUri: string
  FirstColor: string
  SecondaryColor: string
  ThirdColor: string
}

export interface IDMConfiguration {
  CustomThemeConfiguration: CustomThemeConfiguration
}

export interface Employee {
  BuildingId: string
  BuildingName: string
  CompanyId: string
  CompanyName: string
  Emails: any[]
  EmployeeId: string
  EmployeeNumber: string
  EmployeeType: string
  EmployeeTypeId: number
  Expired: boolean
  FirstName: string
  Gender: string
  HasWebUserAccess: boolean
  PhotoUrl: string
  PrimaryEmail: string
  Suspended: boolean
  Terminated: boolean
  UniqueIdentifier: string

}

export interface Identity {
  Id: string
  FirstName: string
  LastName: string

}

export interface Credential {
  ActivationDate: string
  CredentialFormat: number
  Id: string
  HotStamp: string
  RawNumber: number
}