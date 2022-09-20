import { defineStore } from '../src/index'
import { IStudentData, IActionFn } from './type'

export function cancelTest() {
  const studentStore = defineStore<IStudentData, IActionFn>({
    state: {
      name: '',
      age: 0,
      hobby: [],
      friends: {
        name: 'qiqi',
        age: 18,
        hobby: ['eating']
      }
    },
    actions: {}
  })

  // 基本回调取消
  const hobby = studentStore.watch('hobby', newHobby => {
    if (newHobby[0] !== 'playGames') {
      throw new Error('hobby  error')
    }
  })
  // 修改数据
  studentStore.setState({ hobby: ['playGames'] })
  hobby()
  if (studentStore.eventBus.size !== 0) {
    throw new Error('基本回调取消  error')
  }

  // 传入多个函数和参数 取消
  const log1 = () => {
    console.log(1)
  }
  const log2 = () => {
    console.log(2)
  }

  const moreOff = studentStore.watch(['name', 'age'], [log1, log2])
  moreOff()
  if (studentStore.eventBus.size !== 0) {
    throw new Error('传入多个函数和参数   error')
  }

  //  offWatch 取消
  const log3 = () => {
    console.log(3)
  }
  studentStore.watch('age', [log1, log2, log3])
  studentStore.offWatch('age', log1)
  studentStore.offWatch('age', [log2, log3])
  if (studentStore.eventBus.size !== 0) {
    throw new Error('offWatch 取消  error')
  }

  // clearWatch
  studentStore.watch('age', [log1, log2, log3])
  studentStore.clearWatch('age')
  if (studentStore.eventBus.size !== 0) {
    throw new Error('clearWatch error')
  }

  //clearAllWatch
  studentStore.watch('age', [log1, log2, log3])
  studentStore.watch(['age', 'name'], [log1, log2, log3])
  studentStore.clearAllWatch()
  if (studentStore.eventBus.size !== 0) {
    throw new Error('clearAllWatch error')
  }

  //resetStore
  studentStore.state.friends.name = 'hhhh'
  studentStore.watch('age', [log1, log2, log3])
  studentStore.watch(['age', 'friends'], [log1, log2, log3])
  studentStore.resetStore()
  if (studentStore.eventBus.size !== 0) {
    throw new Error('resetStore error')
  }
  if (studentStore.state.friends.name !== 'qiqi') {
    throw new Error('resetStore error')
  }
}
