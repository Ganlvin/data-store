type friendType = {
  name: string
  age: number
  hobby: string[]
}

export interface IStudentData {
  name: string
  age: number
  hobby: string[]
  friends: friendType
}

export type IActionFn = {
  getStudentInfoAction?: (ctx: IStudentData, payload: any) => void
}
