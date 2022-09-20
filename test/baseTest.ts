import { defineStore } from '../src/index'
import { IStudentData, IActionFn } from './type'

export function baseTest() {
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

  //测试 立即监听
  let immediateNum = 0
  const offName = studentStore.watch(
    'name',
    function (newValue, oldValue) {
      if (newValue !== '' && oldValue !== undefined) {
        throw new Error('watch name error')
      }
      if (this.test !== 123) {
        throw new Error('this error')
      }
      immediateNum++
    },
    {
      immediate: true
    },
    { test: 123 }
  )
  if (immediateNum !== 1) {
    throw new Error('immediate  error')
  }
  offName()

  // 基本用法
  // 监听数据
  const hobby = studentStore.watch('hobby', newHobby => {
    if (newHobby[0] !== 'playGames') {
      throw new Error('hobby  error')
    }
  })
  // 修改数据
  studentStore.setState({ hobby: ['playGames'] })
  hobby()

  // 测试一次传入多个函数
  let test1Num = 0
  let test2Num = 0
  const test1 = () => {
    test1Num++
  }
  const test2 = () => {
    test2Num++
  }

  const off = studentStore.watch(['name', 'age'], [test1, test2])
  studentStore.setState({ name: 'qwl' })
  off()
  studentStore.setState({ name: 'qiqi' })
  if (test1Num != 1 && test2Num !== 1) {
    throw new Error('测试一次传入多个函数  error')
  }

  // 数组的位置
  const RandomLocation1 = (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }
  const RandomLocation2 = (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }
  studentStore.watch(['name', 'age'], RandomLocation1)
  studentStore.watch(['age', 'name'], RandomLocation2)
  if (!studentStore.eventBus.has('age&name')) {
    throw new Error('数组位置错误  error')
  }
  studentStore.clearWatch(['name', 'age'])
}
