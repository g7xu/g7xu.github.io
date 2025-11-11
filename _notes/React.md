# React Programming Language

# Why React?

In a **Single-Page Application (SPA)** — a web application that operates on a single HTML page — a **Component-Based Architecture** is essential for organizing different sections and layouts efficiently.

React enables this by providing a **declarative, reusable, and scalable** component model that simplifies UI development.

# How React…

## **Node.js and npm**

- Node.js ⇒ Runtime environment that allows JavaScript to run outside the browser
- npm ⇒ Node package manager, used to manage dependencies and scripts.
    
    <aside>
    
    `npm init` — initialize a new Node.js package
    
    `npm i` — install dependencies
    
    `npm i {package name}` — install a specific package
    
    `npm run {scriptName}` — run script specified in package.json 
    
    </aside>
    

## App Setup

1. Create React App (CRA) — `npx create-react-app <appName>` — Takes longer due to the larger bundled setup
2. Vite —  `npx create-react-app {appName}` — Faster setup combining both compiler and bundler.
    
    
    | **File** | **Purpose** |
    | --- | --- |
    | index.html | The single HTML page of your SPA |
    | package.json | Project metadata, dependencies, and scripts |
    | vite.config.js | Optional Vite build configuration |
    | /src | Main source folder for React code |
    | main.jsx | Entry point, connects React to HTML |
    | App.jsx | Root React component |
    | App.css | CSS specific to App.jsx |
    | index.css | Global CSS for the whole app |
    
    ```markdown
    index.html
       ↓
    (main.jsx) → connects React to the HTML page
       ↓
    <App.jsx> → root component rendered inside #root
       ↓
    App.css → styles specific to App
    index.css → global styles for the entire app
    ```
    

## Syntax Overview

- **JSX (JavaScript XML)** — HTML-like syntax for writing components
    - one root-level element per component
    - `<></>` to group multi elements
    - `{}` dynamic expression
    - camelCase attributes `className` `onClick` `onChange`
- **Engines**: Babel & Webpack

## Build-in optimization

This process is called **Reconciliation** (uses a **Virtual DOM** — a lightweight copy of the real DOM — for fast updates and rendering).

**Steps:**

1. Generate a new Virtual DOM after state/props change.
2. Compare it with the previous Virtual DOM (Diffing Algorithm).
3. Apply **only the necessary changes** to the real DOM.

**Optimization Tip:**

- React compares child elements in order.
- Adding an element at the beginning may trigger a full re-render.
- **Solution:**
    - Always use a unique key prop for lists.
    - Avoid using array index as a key.

# React Components - Class

<aside>

**Feature:**

- Must include a **render()** method.
- Can maintain **state** and receive **props**.
</aside>

**Example:**

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

## Props

Data passed from a parent component to a child component

- Immutable by the child.
- Trigger re-renders when changed.
- access value via `this.props.propName`
- if declare a constructor, `props` passed in as an argument **AND** invoke `super(props)`
- props destructure `const { name, age } = this.props;`
- Func reference
    
    
    | **Method** | **Example** | **Notes** |
    | --- | --- | --- |
    | Constructor binding | this.handleClick = this.handleClick.bind(this) | Best for performance |
    | Arrow method | handleClick = () => {...} | Best for simplicity |
    | Inline arrow | onClick={() => this.handleClick()} | OK for small cases only |

## State

Component-specific data that can change over time

- within component scope
- changes trigger re-render
- not be mutated directly
- modification syntax

```jsx
this.state = { stateName: value }; // initialization
this.setState({ stateName: newValue }); // update
this.setState(prevState => ({ stateName: newValue }));
```

## Lifecycle

The lifecycle represents the stages from when a component appears on the page (mounted) to when it is removed (unmounted).

`constructor()` → `render()` → `componentDidMount()` → `componentDidUpdate()` → `componentWillUnmount()` 

### **Mounting Phase**

Components were being created

- `constructor()`: initialize state and used to bind class methods
- `render()`: no side effect return JSX
- `componentDidMount()`: side-effects, such as data fetching, setup…

### Updating Phase

changes to a component’s state or props trigger a re-render

- `shouldComponentUpdate(nextProps, nextState)`: control whether the component should re-render
- `render()`: updated JSX to be rendered
- `componentDidUpdate(preProps, preState)`:  Executed after the component is re-rendered

### Unmounting Phase

The phase when a component is removed from the DOM

- `componentWillUnmount()`: execute before component is removed from the DOM