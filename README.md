<a href="[/README.md](https://github.com/Ganlvin/data-store/blob/main/README.md)">English</a>   
<a href="https://github.com/Ganlvin/data-store/blob/main/README_CN.md">简体中文</a>

- [Introduction](#introduction)
  - [how to use](#how-to-use)
  - [1、npm Install dependencies](#1npm-install-dependencies)
  - [2、import package](#2import-package)
    - [Node](#node)
    - [TypeScript](#typescript)
  - [3、quick start](#3quick-start)
  - [4、API methods](#4api-methods)
    - [Define a store (defineStore)](#define-a-store-definestore)
    - [Change state data (setState)](#change-state-data-setstate)
    - [Watch state data (watch)](#watch-state-data-watch)
      - [basic use](#basic-use)
      - [Other parameters](#other-parameters)
      - [Deep listening](#deep-listening)
      - [Watch multiple state value](#watch-multiple-state-value)
      - [Multiple callback functions](#multiple-callback-functions)
      - [cancel listening](#cancel-listening)
        - [offWatch](#offwatch)
        - [clearWatch](#clearwatch)
        - [clearAllWatch](#clearallwatch)
    - [dispatch method](#dispatch-method)
  - [5、TypeScript support](#5typescript-support)

# Introduction

This is a state management library. Compared with Pinia, vuex, and Redux, it is more lightweight and very simple to use. Like Pinia, it can create multiple Store instances. At the same time, when the state data in the Store instance changes , you can call back the corresponding function, that is to say, it is responsive, and it also supports TypeScript.

## how to use

## 1、npm Install dependencies

```shell
npm install @onpaper/data-store
```

## 2、import package

### Node  

 Write the following code in the JavaScript file

```js
// es module
import pkg from "@onpaper/data-store";
const { defineStore } = pkg;

// commonjs
const { defineStore } = require("@onpaper/data-store");
```

### TypeScript

if you use TypeScript

```js
import { defineStore } from "@onpaper/data-store";
```

## 3、quick start

```js
import { defineStore } from "@onpaper/data-store";
// 1.define a store
const studentStore = defineStore({
  state: {
    name: 'jack',
    hobby:[],
    friends: {
      name: 'rose'
    }
  },
  actions: {
    getStudentInfoAction(ctx, payload) {
      // axios sends network requests or other asynchronous events
      // ctx is state
      ctx.name = 'Bob'
      // dispatch function the incoming payload
      console.log(payload) // -> { id: 123 }
      // this is store instance
      console.log(this === studentStore) // -> true
    }
  }
})

// 2. watch state
// first ： state key
// second ： The function to call back when the listen parameter changes
studentStore.watch('hobby', (newHobby, oldHobby) => {
  console.log(newHobby, oldHobby) // -> ['playGames'] []
})

// listen at the same time "name" "age" ，Any change will be called back fn1 fn2
studentStore.watch(['name', 'age'], [fn1, fn2])

// 3. change the data
studentStore.setState({ hobby: ['playGames'] })

// 4. Callback function execution
//console.log(newHobby, oldHobby)


//5. dispatch dispatch async method
// first : Function name registered in actions
// second : You can customize a payload to the action function parameter of the call
studentStore.dispatch('getStudentInfoAction', { id: 123 })

// 6. Callback function execution
// fn1 fn2
```

## 4、API methods

### Define a store (defineStore)

```js
import { defineStore } from "@onpaper/data-store";

const studentStore = defineStore({
  state: {
    name: 'jack',
    friends: {
      name: 'rose'
    }
  },
  actions: {
    getStudentInfoAction(ctx, payload) {
      // ...Perform asynchronous operations such as network requests
    }
  }
})
```

Use the defineStore method, passing in the custom state parameter to initialize the store

### Change state data (setState)

```js
const studentStore = defineStore({
  state: {
    name: 'jack',
    hobby: [],
    friends: {
      name: 'rose',
      hobby: []
    }
  }
})

// Method 1: Use the setState method
const hobby = ["runnig"]
studentStore.setState({ name: "lucy", hobby })

// Method 2: Direct change
studentStore.state.hobby = ['baseball']
studentStore.state.friends.name = "Bob"
```

There is no difference between the two methods, which one is more convenient to use

### Watch state data (watch)

#### basic use

```js
// 1. generate store
const studentStore = defineStore({
  state: {
    name: 'jack',
    hobby: [],
    friends: {
      name: 'rose',
      hobby: []
    }
  }
})

// 2. listen data
// first ： key of state
// second ： The function to call back when the monitored parameter changes
studentStore.watch('hobby', (newHobby, oldHobby) => {
  console.log(newHobby, oldHobby) // -> ['playGames'] []
}s

// 3. change the data
studentStore.setState({ hobby: ['playGames'] })

// 4. Callback function execution
//console.log(newHobby, oldHobby)

```

If the changed value is the same as the last value, the callback function will not be called

#### Other parameters

```js
// watch(stateName,callfunction,option,this)
studentStore.watch(
  'name',
  function (newValue, oldValue) {
    console.log(this) //  { test: 123 }
  },
  {
    // option
    immediate: true // Execute the callback function immediately
  },
  //  this
  { test: 123 }
)
```

option can pass the immediate parameter to execute the callback function immediately, and the last parameter of watch can be bound to the this of the callback function

#### Deep listening

The watch function performs deep listening by default, which means that the callback function will be executed even if the multi-level nested data changes.

```js
// 1. friends nest friends
const studentStore = defineStore({
  state: {
    name: '',
    friends: {
      name: 'jack',
      friends: {
        name: 'rose',
        hobby: [{ test: 'fail' }]
      }
    }
  }
})

// 2. Listen to the state.friends 
studentStore.watch('friends', (newValue, oldValue) => {
  console.log(newValue.friends.hobby[0].test)  //  -> success
  console.log(oldValue.friends.hobby[0].test) //  ->  fail
})

// 3. change data
const testObj = studentStore.state.friends.friends.hobby[0]
testObj.test = 'success'
```

#### Watch multiple state value

```js
const studentStore = defineStore({
  state: {
    name: '',
    age: 0
  }
})

// Also listen to "name" "age"
// The parameters of the callback function are returned as an array
studentStore.watch(['name', 'age'], ([newName, newAge], [oldName, oldAge]) => {
  console.log(newName, newAge)
  console.log(oldName, oldAge)
})

// Any changes to the listened property will execute the callback function
studentStore.setState({ name: 'jack' })
studentStore.setState({ age: 18 })
```

When listening to multiple state properties, the first parameter passed in is an array of listening properties. When any property in the array changes, the callback function will be executed, and the parameters of the callback function will be returned as an array.

#### Multiple callback functions

```js
const studentStore = defineStore({
  state: {
    name: '',
    age: 0
  }
})

studentStore.watch(['name', 'age'], [test1, test2])
```

The callback function can also pass in an array of functions. When the property changes, the functions in the array will be called **sequentially**

#### cancel listening

watch will return a cancel function, and executing the cancel function can cancel the watch directly

```js
// method 1：  The watch function returns a cancel function
const offWatch = studentStore.watch(['hobby',"name"], newHobby => {
  // ....
})
// Execute cancel function to cancel listening
offWatch()
```

##### offWatch

Sometimes it is inconvenient to use the cancel function, so you can use the offWatch method

```js
// method 2： offWatch
// Added three callback functions log1, log2, log3
studentStore.watch('age', [log1, log2, log3])

//first : cancel listening name
//second ： Functions that need to be canceled
studentStore.offWatch('age', log1)  // only cancel log1
studentStore.offWatch('age', [log2, log3]) // cancel log2 and log3
```

##### clearWatch

If you want to cancel all the callback methods of some listening properties at once

```js
// clearWatch 
studentStore.watch('age', [log1, log2, log3])
studentStore.clearWatch('age')

studentStore.watch(['age','name'], [log1, log2, log3])
studentStore.clearWatch(['age','name'])
```

##### clearAllWatch

If you want to cancel all listeners of the store instance

```js
//clearAllWatch
studentStore.watch('age', [log1, log2, log3])
studentStore.watch(['age', 'name'], [log1, log2, log3])

studentStore.clearAllWatch()
```

### dispatch method

```js
const studentStore = defineStore({
  state: {
    name: ''
  },
  actions: {
    getStudentInfoAction(ctx, payload) {
      // axios sends network requests or other asynchronous events
      // ctx is state
      ctx.name = 'jack'
      // dispatch the incoming payload
      console.log(payload) // -> { id: 123 }
      // this is the store instance
      console.log(this === studentStore) // -> true
    }
  }
})

//The state callback function will be called 
//when the actions registered function modifies the state
studentStore.watch('name', newName => {
  console.log(newName) // -> jack
})

// first : Function name registered in actions
// second : You can send a payload to the dispatch function 
studentStore.dispatch('getStudentInfoAction', { id: 123 })
```

First register the function in actions, use the dispatch method to pass in the function name to call, and you can pass the payload when calling

## 5、TypeScript support

example:

```js
interface IStudentData {
  name: string
  age: number
  hobby: string[]
  friends: friendType
}

type IActionFn = {
  getStudentInfoAction?: (ctx: IStudentData, payload: any) => void
}
  
// The first parameter is the state type, the second is the actions type
const studentStore = defineStore<IStudentData, IActionFn>({
  state: {
    // ....
  },
  actions: {
    //...
  }
})
```

