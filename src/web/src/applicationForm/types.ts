export interface IApplicationForm {
  id: number
  name: string
  description: string
  questions: IQuestion[]
  state: string
}

export interface IQuestion {
  title: string
  responseType: string
}

export enum ResponseType {
  TextField = "TextField",
  Radio = "Radio",
  Dropdown = "Dropdown",
}

export enum ApplicationState {
  Draft = "Draft",
  Ready = "Ready",
}
