export interface IApplicationForm extends IObjectKeys {
  id: number
  name: string
  description: string
  questions: IQuestion[]
}

export interface IQuestion {
  /*   id: string | undefined | null
   */ title: string
  responseType: number
}

export enum ResponseTypes {
  TextField = 0,
  Radio = 1,
  Dropdown = 2,
}

interface IObjectKeys {
  [key: string]: string | number | undefined | IQuestion[]
}
