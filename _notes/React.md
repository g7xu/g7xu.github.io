# React

## Why React?

In a Single-Page Application (web application with only a single HTML page), Component-Based Architecture is critical in organize all the sections and layout. As a result, React Application become critical

## How React…

- Node.js ⇒ runtime environment that allows JS to run outside the browser
- npm ⇒ project manager
    - package.json List project dependencies and scripts
    - quick command
    
    <aside>
    
    `npm init` — initialize a new Node.js package
    
    `npm i` — install dependencies
    
    `npm i {package name}` — install a specific package
    
    `npm run {scriptName}` — run script specified in package.json 
    
    </aside>
    
- CRA — `npx create-react-app {appName}` — setup React App (long time due to large application)
- Vite — `npm create vite@lastest` — faster, combines both compiler and bundler
    - File structure
    
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
    - Code Flow
    
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
    

Class Components

import React, { Components } from ‘React’

Pro

- More feature
- private data
- complex UI logic
- Provide lifecycle hooks

Functional Components

- as much as possible
- Pro
    - absence of `this` keyword
    - Solution without using state
    - Stateless
