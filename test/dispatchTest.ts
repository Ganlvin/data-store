import { defineStore } from '../src/index'
import { IStudentData, IActionFn } from './type'

export function dispatchTest() {
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
    actions: {
      getStudentInfoAction(ctx, payload) {
        if (payload.id !== 123) {
          throw new Error('payload error')
        }

        if (this !== studentStore) {
          throw new Error('this error')
        }

        ctx.name = 'jack'
      }
    }
  })

  studentStore.watch('name', newName => {
    if (newName !== 'jack') {
      throw new Error('watch error')
    }
  })

  studentStore.dispatch('getStudentInfoAction', { id: 123 })
}
