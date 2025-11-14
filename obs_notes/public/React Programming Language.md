# Why React?

In a **Single-Page Application (SPA)** — a web application that runs on a single HTML page — a **Component-Based Architecture** is essential for organizing different sections and layouts efficiently.

React enables this by providing a **declarative, reusable, and scalable** component model that simplifies UI development.

---

# How React Works

## Node.js and npm

- **Node.js** → JavaScript runtime outside the browser  
- **npm** → Node package manager for dependencies and scripts  

> [!info] npm Commands  
> `npm init` — initialize a new Node.js project  
> `npm i` — install dependencies  
> `npm i <package>` — install a specific package  
> `npm run <script>` — run a script from package.json  

---

## App Setup

1. **Create React App (CRA)**  
   `npx create-react-app <appName>`  
   Slower because it includes full bundling and tooling.

2. **Vite**  
   `npm create vite@latest <appName>`  
   Faster — uses a modern build tool with optimized dev server.

### Key Files

| **File** | **Purpose** |
| --- | --- |
| index.html | The single HTML page of your SPA |
| package.json | Project metadata, dependencies, and scripts |
| vite.config.js | Optional Vite build configuration |
| /src | Main source folder for React code |
| main.jsx | Entry point, connects React to HTML |
| App.jsx | Root React component |
| App.css | CSS specific to App.jsx |
| index.css | Global CSS for the entire app |

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
- **Build tools**: Babel + Webpack (CRA) / ESBuild + Rollup (Vite)

---

## Built-In Optimization

React uses a **Virtual DOM** and a process called **Reconciliation**.

### Steps

1. React generates a **new Virtual DOM** after state/props update  
2. It compares it to the **previous Virtual DOM**  
3. Only the **necessary changes** are applied to the real DOM  

### Optimization Tips

- React compares list children in order  
- Inserting at the beginning is expensive  
- Use **unique key props** for list items  
- Avoid using the array index as a key  

---

# React Components — Class Components

> [!info] Features  
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

Props are data passed from a parent component to a child component.

- Immutable in the child  
- Changing props triggers re-renders  
- Access via `this.props.propName`  
- In constructor components:  
  - Receive `props` as argument  
  - Call `super(props)`  
- Destructuring: `const { name, age } = this.props;`

### Passing Functions

| **Method** | **Example** | **Notes** |
| --- | --- | --- |
| Constructor binding | `this.handleClick = this.handleClick.bind(this)` | Best performance |
| Arrow method | `handleClick = () => {...}` | Easiest to write |
| Inline arrow | `onClick={() => this.handleClick()}` | Acceptable for small cases |

## State

State stores component-specific data that changes over time.

- Private to the component  
- Updates trigger re-renders  
- Never mutate directly  

### Syntax

```jsx
this.state = { value: 0 };            // initialization
this.setState({ value: 1 });          // update
this.setState(prev => ({ value: prev.value + 1 })); // functional update
```

---

Still in Production



## Lifecycle Methods

React class components move through three major phases:

`constructor()` → `render()` → `componentDidMount()` →  
`componentDidUpdate()` → `componentWillUnmount()`

### Mounting Phase (component appears)

- **constructor()** → initialize state, bind methods  
- **render()** → returns JSX  
- **componentDidMount()** → side effects (fetching, subscriptions…)

### Updating Phase (state/props changes)

- **shouldComponentUpdate()** → control re-rendering  
- **render()** → updated JSX  
- **componentDidUpdate()** → runs after re-render  

### Unmounting Phase (component removed)

- **componentWillUnmount()** → cleanup logic (remove listeners, cancel timers…) 
