
# Why React?

In a **Single-Page Application (SPA)** — a web application that runs on a single HTML page — a **Component-Based Architecture** is essential for organizing different sections and layouts efficiently.

React enables this by providing a **declarative, reusable, and scalable** component model that simplifies UI development.

---

# How React Works

## Node.js and npm

- **Node.js** → JavaScript runtime outside the browser  
- **npm** → Node package manager for dependencies and scripts  

> [!info] **npm Commands**  
> - `npm init` — initialize a new Node.js project  
> - `npm i` — install dependencies  
> - `npm i <package>` — install a specific package  
> - `npm run <script>` — run a script from package.json  

---

## App Setup

1. **Create React App (CRA)**  
   `npx create-react-app <appName>`  
   Slower because it includes full bundling and tooling.

2. **Vite**  
   `npm create vite@latest <appName>`  
   Faster — uses a modern build tool with optimized dev server.

### Key Files

| **File**        | **Purpose**                                |
|-----------------|---------------------------------------------|
| index.html      | Single HTML page of the SPA                 |
| package.json    | Project metadata, dependencies, and scripts |
| vite.config.js  | Vite build configuration                    |
| /src            | Main source folder for React code           |
| main.jsx        | Entry point, connects React to HTML         |
| App.jsx         | Root React component                        |
| App.css         | CSS specific to App.jsx                     |
| index.css       | Global CSS for the entire app               |

```
index.html  
   ↓  
main.jsx → connects React to the HTML page  
   ↓  
<App.jsx> → root component rendered inside #root  
   ↓  
App.css → component-specific styles  
index.css → global styles
```

---

## Syntax Overview

- **JSX (JavaScript XML)**  
  - One root-level element per component  
  - `<> </>` fragments for grouping  
  - `{}` for dynamic expressions  
  - camelCase attributes → `className`, `onClick`, `onChange`
- **Build tools:**  
  - CRA: Babel + Webpack  
  - Vite: ESBuild + Rollup  

---

## Built-In Optimization

React uses a **Virtual DOM** and **Reconciliation**.

### Steps

1. React generates a **new Virtual DOM** after state/props update  
2. It compares it with the **previous Virtual DOM**  
3. Updates only the **necessary changes** in the real DOM  

### Optimization Tips

- React compares list children in order  
- Inserting at the beginning is expensive  
- Use **unique key props** for lists  
- Avoid using array index as a key  

---

# React Components — Class Components

> [!info] **Features**  
> - Must include a `render()` method  
> - Can maintain **state**  
> - Can receive **props**  

## Example

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

---

## Props

Props are data passed from a parent to a child component.

- Immutable  
- Changing props triggers re-renders  
- Access via `this.props.propName`  
- In constructors:  
  - Accept `props` as argument  
  - Call `super(props)`  

### Passing Functions

When dealing with `this`, the binding context matters.

| **Method**             | **Example**                                       | **Notes**                |
|------------------------|---------------------------------------------------|---------------------------|
| Constructor binding    | `this.handleClick = this.handleClick.bind(this)`  | Best performance          |
| Arrow class property   | `handleClick = () => {...}`                       | Easiest to write          |
| Inline arrow           | `onClick={() => this.handleClick()}`              | OK for small use cases    |

---

## State

- Private to the component  
- Updates trigger re-render  
- Never mutate directly  

### Syntax

```jsx
this.state = { value: 0 };
this.setState({ value: 1 });
this.setState(prev => ({ value: prev.value + 1 }));
```

---

## Lifecycle Methods

React class components follow this flow:

`constructor()` → `render()` → `componentDidMount()` →  
`componentDidUpdate()` → `componentWillUnmount()`

### Mounting

- `constructor()` → initialize state, bind methods  
- `render()` → return JSX  
- `componentDidMount()` → run side effects  

### Updating

- `shouldComponentUpdate()` → control re-render  
- `render()`  
- `componentDidUpdate()`  

### Unmounting

- `componentWillUnmount()` → cleanup  

---

# React Components — Functional Components

Functional components are simple JavaScript functions that:
> [!info] **Features**  
> - Start with a **capitalized name**
> - Return JSX
> - Are **simpler** than class components
> - Use **Hooks** for state & side effects

Example code:
```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

---

## Hooks Overview

Hooks enable: **State**, **Side effects**, **Context**, **Reusable logic** (custom hooks)

---
## useState()

```jsx
const [state, setState] = useState(initialValue);
```

- Runs only on first render  
- Can have multiple state variables  

### Updating State

```jsx
setState(prev => prev + 1);
setUser(prev => ({ ...prev, name: "Jason" }));
```

---
## useEffect()

Manages side effects: fetching, subscriptions, logging.

| **Dependency** | **Behavior**                |
|----------------|-----------------------------|
| none           | Runs after **every** render |
| `[]`           | Runs **once** on mount      |
| `[value]`      | Runs when **value** changes |

 **Cleanup**: Executed before re-running the effect:
1. Check for cleanup  
2. Run cleanup  
3. Run new effect  
---

## useReducer()
...

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### Reducer

```jsx
function reducer(state, action) {
  return newState;
}
```

Rules:

- Pure  
- No mutation  
- Must return a new object/array  

### Actions

```jsx
{ type: "increment" }
{ type: "add_todo", payload: "Buy milk" }
```

---

## useRef()

- Stores mutable values  
- Stores DOM elements  
- Persists across renders  

```jsx
const countRef = useRef(0);
countRef.current++;
```

---

# React Optimization

## useMemo()

```jsx
const sortedList = useMemo(() => sort(list), [list]);
```

## useCallback()

```jsx
const handleClick = useCallback(() => setCount(c => c + 1), []);
```

## React.memo()

```jsx
const Child = React.memo(function Child({ value }) {
  return <div>{value}</div>;
});
```

---

## Lazy Loading

```jsx
const About = React.lazy(() => import('./About'));
```

```jsx
<Suspense fallback={<p>Loading...</p>}>
  <About />
</Suspense>
```

---

# Controlled vs. Uncontrolled Inputs

## Uncontrolled

- DOM controls the value  
- Use refs  
 
```jsx
<input ref={inputRef} />
```

## Controlled

- React state controls the value  
- Rerenders on every change  

```jsx
<input value={email} onChange={e => setEmail(e.target.value)} />
```

# React Router DOM
enabling navigation between views and handling client-side routing
`<BrowserRouter>`: Route capabilities using browser's built-in history
`<Routes>`: Wraps a group of individual routes
`<Route>`: route paths and their associated components
Example
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const App = () => (

<BrowserRouter>
	<Routes>
		<Route path="/" element={<Home />} />
		<Route path="/dashboard" element={<Dashboard />} />
		<Route path="profile" element={<Profile />} />
		<Route path="about" element={<About />} />
	</Routes>
</BrowserRouter>
);
``` 

`<Link to="..." />`: routing page without refreshing 
`<NavLink to-"..." />`: showing the active state of the routes
`<Outlet />`: Placeholder for rendering child route components in nested routes
`useNavigate()`: Return a navigate() function to programmatically navigate
`useParams()`: Returns an object with dynamic params from the current URL
useLocation(): Returns the current location object containing

# Axios
A promise-based HTTP client for both browser and Node.js environments with:
- Automatic JSON conversion
- Intercept & Modify Request/Response
- Cancel Pending Requests
- CSRF Protection Support
Axios Interceptor: Function that allow you to modify or act upon ongoing requests and incoming responses


# Problems of Props Drilling
- Passing props through multiple nested components to reach a deeply nested child
- Intermediate components: Only forward props; they don't need to use them

## Context API
allowing us to pass data throughout the application
Role based API
- Provider: supplies the global data to all child
- Consumer: reads and uses the global data provided
- Context: the object that bridges the provider and consumer

# Context API in 3 Steps

## 1. Create a Context

```jsx
// UserContext.js
import React from 'react';
const UserContext = React.createContext();
export default UserContext;
```

## 2. Provide Value to Child Components

```jsx
// App.jsx
import React, { useState } from 'react';
import UserContext from "./UserContext";

const App = () => {
  const [user, setUser] = useState({ name: "Jane", email: "jane@dri", age: 20 });

  const increaseAge = () => {
    setUser((prevUser) => ({ ...prevUser, age: prevUser.age + 1 }));
  };

  return (
    <UserContext.Provider value={{ ...user, increaseAge }}>
      <ChildComponent />
    </UserContext.Provider>
  );
};
```

## 3. Consume Context Values

```jsx
// ChildComponent.jsx
import UserContext from "./UserContext";
import { useContext } from "react";

export default function ChildComponent() {
  const context = useContext(UserContext);
  return <>
    <p>User: {context.name} with {context.email} at age {context.age}</p>
    <button onClick={context.increaseAge}>Increase Age</button>
  </>;
};
```

---

**Flow:** `createContext()` → wrap tree with `Provider` + pass `value` → any child calls `useContext()` to read it.


## Redux
JS library for managing global state and logic
- Centralizes state in a predictable and structured manner using reducer
- Compatible with any frontend library/framework![[Screenshot 2026-02-26 at 11.07.23 PM.png]]

### Principle
- Single Source of Truth (the entire application's state is stored in a single object within one store)
- State is Read-only: the only way to change the state is by dispatching actions
- State Updates with Pure Functions
	- Reducers are pure functions that specify how the state changes in response to actions

Store: Centralized storage for application state
Action: Describes what you want to do with type and payload field
Action Creator: A function to create actions
Reducer: Updates state based on actions (executioner)
Selector: Function to access specific data from state from components
![[Screenshot 2026-02-26 at 11.15.26 PM.png]]
- Component dispatches an action to the store
- Store sends the action and current state to the reducer
- Reducer updates the state and returns it to the store
- Store provides the updated state to the components, triggering a re-render


Redux DevTools: `npm i redux-devtools-extension` view redux details

## Defining Actions in Redux
Action Type: string represent the action
- standard way of naming it: `<reducerName>/<function name>`
Action Creator: A function that returns the representing the action.

We will send the action creator to store.dispatch -- why? 
- avoid repetition
- Hide complexity
- easy testing

## Setting Up Reducer in Redux
- A pure function that manages state updates based on dispatched actions
	- set initial state
	- Ensure immutability
		- Avoid directly mutating the state
		- Always return a new state object
	- Handle Actions
		- Use condition check to determine how to generate state
		- return unchanged state 

- CombineReduer()
	- all dispatch call will trigger all the reducer

# Accessing State in Redux & React-Redux

## Store Methods (Raw Redux)

Redux provides two key methods on the store:

- **`store.getState()`** — reads the current state as a one-time snapshot. Use chaining to access nested data: `store.getState().account.balance`.
- **`store.subscribe(callback)`** — registers a callback that fires every time state changes. Returns an `unsubscribe` function to cancel the listener.

## Manual Pattern (Without React-Redux)

```js
function Sample() {
  const [balance, setBalance] = useState(store.getState().account.balance);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBalance(store.getState().account.balance);
    });
    return () => unsubscribe();
  }, []);

  return <div>Balance: {balance}</div>;
}
```

**How it works:**

1. `useState` initializes `balance` with the current store value (one-time read).
2. `useEffect` with `[]` runs once on mount — subscribes to the store so that every future state change updates `balance` via `setBalance`.
3. The cleanup function (`return () => unsubscribe()`) runs on unmount — tells Redux to stop notifying this component, preventing memory leaks.

**Key distinction:** `useEffect` runs once to _install_ the listener. The subscribe callback is what fires on every Redux update. `unsubscribe` only fires once at the end to disconnect.

## React-Redux: The Modern Approach

The `react-redux` library eliminates all manual subscribe/unsubscribe boilerplate with three tools:

### 1. `<Provider>` — makes the store available app-wide

```jsx
<Provider store={store}>
  <App />
</Provider>
```

Wrap once at the root. Every component inside can access the store without importing it directly.

### 2. `useSelector` — read state (replaces getState + subscribe + cleanup)

```js
const balance = useSelector(state => state.account.balance);
```

One line replaces `useState` + `useEffect` + `subscribe` + `unsubscribe`. It automatically subscribes on mount, unsubscribes on unmount, and only triggers a re-render when the selected value actually changes.

### 3. `useDispatch` — dispatch actions

```js
const dispatch = useDispatch();
dispatch(addAccountDeposit(100));
```

Replaces direct `store.dispatch()` calls, keeping components decoupled from the store.

### Full Example

```jsx
import { useSelector, useDispatch } from 'react-redux';

function BankAccount() {
  const balance = useSelector(state => state.account.balance);
  const dispatch = useDispatch();

  return (
    <>
      <p>Balance: ${balance}</p>
      <button onClick={() => dispatch(addAccountDeposit(100))}>+100</button>
    </>
  );
}
```

No `useState`, no `useEffect`, no `subscribe`, no cleanup.

## Why React-Redux is Better

|Concern|Manual|React-Redux|
|---|---|---|
|Read state|`store.getState()`|`useSelector()`|
|Listen for changes|`subscribe()` in `useEffect`|Automatic|
|Cleanup|`return () => unsubscribe()`|Automatic|
|Dispatch|`store.dispatch()`|`useDispatch()`|
|Smart re-renders|No — re-renders on every state change|Yes — only when selected value changes|

**Bottom line:** `useSelector` does the same work as the manual pattern but handles subscription, cleanup, and render optimization automatically. The manual approach is worth understanding because it's what `useSelector` does under the hood.


general action creator
`export constant createAction = (type, payload) => ({type, payload});`