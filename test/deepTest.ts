import { defineStore } from '../src/index'

type friendType = {
  name: string
  age: number
  hobby: any[]
  friends?: friendType
}

interface IStudentData {
  name: string
  age: number
  hobby: string[]
  friends: friendType
}

export function deepTest() {
  const studentStore = defineStore<IStudentData>({
    state: {
      name: '',
      age: 0,
      hobby: ['game'],
      friends: {
        name: 'qiqi',
        age: 18,
        hobby: ['shopping'],
        friends: {
          name: 'xiaoming',
          age: 11,
          hobby: [{ test: 'fail' }]
        }
      }
    },
    actions: {}
  })

  // 首层 state 监听
  const test1 = studentStore.watch(
    ['name', 'age'],
    ([newName, newAge], [oldName, oldAge]) => {
      if (
        newName !== 'zhuzhu' ||
        oldName !== '' ||
        newAge !== 0 ||
        oldAge !== 0
      ) {
        throw new Error('首层 state 监听  error')
      }
    }
  )

  studentStore.state.name = 'zhuzhu'
  studentStore.setState({ name: 'zhuzhu' })
  test1()

  // 首层中的对象 监听
  const test2 = studentStore.watch('hobby', newValue => {
    if (newValue.length !== 2 && newValue[1] !== 'swimming') {
      throw new Error('首层 state 监听 hobby error')
    }
  })

  studentStore.state.hobby.push('swimming')
  test2()

  // // 对象深度监听
  const test3 = studentStore.watch('friends', newValue => {
    if (newValue.age !== 20) {
      throw new Error('对象深度监听 监听 friends age error')
    }
  })
  studentStore.state.friends.age = 20
  test3()

  const test4 = studentStore.watch('friends', (newValue, oldValue) => {
    if (newValue.hobby[1] !== 'eating') {
      throw new Error('对象深度监听 监听 friends hobby error')
    }
    if (oldValue.hobby.length !== 1) {
      throw new Error('对象深度监听 监听 friends hobby length error')
    }
  })
  studentStore.state.friends.hobby.push('eating')

  test4()

  // 超深度监听
  const test5 = studentStore.watch('friends', (newValue, oldValue) => {
    if (newValue.friends?.hobby[0].test !== 'success') {
      throw new Error('超深度监听 success error')
    }

    if (oldValue.friends?.hobby[0].test !== 'fail') {
      throw new Error('超深度监听 fail error')
    }
  })

  const testObj = studentStore.state.friends.friends?.hobby[0]
  testObj.test = 'success'
  test5()
}
