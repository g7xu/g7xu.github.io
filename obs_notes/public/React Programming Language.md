
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

