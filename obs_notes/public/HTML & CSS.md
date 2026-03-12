**HTML (HyperText Markup Language)** is a **descriptive language** used to define the structure and layout of a web page through plaintext files.
# Basic Document Structure
- **`<html>`**: The root element that wraps all page content.
- **`<head>`**: Contains **metadata** and information not visible as primary content, such as titles, CSS styles, and scripts.
- **`<body>`**: Encloses all the content intended for display to the user.
# HTML Elements and Tags
- **Composition**: Elements are generally composed of an **opening tag** (`<>`), the **content**, and a **closing tag** (`</ >`).
- **Void Elements**: Special cases that use a **single tag** and contain no content, such as `<img>` or `<br />`.
- **Attributes**: Provide additional information to define an element's **behavior or appearance** (e.g., `id`, `class`, `src`, `href`).
- **Special Characters**: Since characters like `<` or `&` are reserved for HTML syntax, **character entities** (e.g., `&lt;`, `&amp;`) must be used to display them as text.
# Content and Text Structuring
HTML provides **semantic tags** that help browsers and search engines understand the meaning and layout of page components.
## Structural Semantic Tags
- **`<header>`**: Introductory content, logos, or navigation.
- **`<nav>`**: A block containing navigation links.
- **`<main>`**: The **primary content** of the document.
    - **`<article>`**: Self-contained compositions like blog posts or news.
    - **`<section>`**: Groups of related content under a heading.
    - **`<div>`**: A **generic container** used for grouping and styling when no semantic tag applies.
- **`<aside>`**: Content indirectly related to the main flow, such as sidebars.
- **`<footer>`**: Bottom-of-page content like contact info or copyright notices.
## Text Formatting
- **Headings**: Ranked from `<h1>` (top level) down to `<h6>`.
- **Paragraphs**: Defined by the `<p>` tag.
- **Lists**: **Unordered** (`<ul>`) for bullet points and **Ordered** (`<ol>`) for numbered sequences, both using `<li>` for items.
- **Inline Styling**:
    - **`<span>`**: Generic inline wrapper for styling or scripting.
    - **Semantic Emphasis**: `<em>` (emphasis), `<strong>` (importance), and `<mark>` (highlighting).
    - **Stylistic Tags**: `<b>` (bold), `<i>` (italic), and `<u>` (underlined).
# Interactive Components: Forms and Tables

## HTML Forms
Forms capture user input and are composed of several key elements:
- **`<input>`**: A void element for data entry.
    - **Attributes**: Includes `type` (e.g., `text`, `password`, `email`, `date`, `radio`), `placeholder`, `required`, and `readonly`.
- **`<label>`**: A caption for an input, linked by matching the `for` attribute to the input's `id`.
- **`<button>`**: Clickable triggers; `type="submit"` sends the form, while `type="reset"` clears it.
- **`<textarea>`**: Used for **multi-line** plain-text input.
- **`<select>` and `<option>`**: Creates a **drop-down list** for selecting values.
## HTML Tables
Used to display data in a **tabular format**.
- **Structure**: `<table>` encloses the data, `<tr>` defines rows, `<th>` defines header cells, and `<td>` defines standard data cells.
- **Cell Merging**: Use the `colspan` attribute to merge columns and `rowspan` to merge rows.
# CSS Rules and Selectors
**CSS (Cascading Style Sheets)** rules consist of a **selector** and a **declaration block**.
## Style Application
**Inline Style**: Apply styles directly within an HTML element using the style attribute
**Internal Style**: Use `<style>` element to define CSS rules within `<head>` section of HTML file
**External Style**: Using `<link>` element within `<head>` section to link to an external CSS file
## CSS Rule
- A set of properties associated with a selector
- Composition of
	- CSS Selector: Specifies which HTML elements are the target to be style
- Declaration Block
	- Contains one or more declarations, each including a style property and the corresponding value
## Different types of Selectors
Selectors specify which HTML elements the styles should target:
- **Element (Type)**: Targets all elements of a specific tag (e.g., `h1`).
- **ID (`#`)**: Targets a single element with a unique ID.
- **Class (`.`)**: Targets all elements assigned to a specific class.
- **Attribute**: Targets elements with specific attributes or values (e.g., `input[type="text"]`).
- **Pseudo-class (`:`)**: Targets elements in a **specific state**, such as `a:hover`.
- **Pseudo-element (`::`)**: Targets **specific parts** of an element, such as `p::first-letter`.
- **Universal (`*`)**: Targets every element on the page.
- **Grouping**: Targets multiple selectors at once by separating them with commas (e.g., `h1, h2, h3`).
## Combinators
Combinators define the relationship between multiple selectors:
- **Descendant (space)**: Targets elements nested anywhere inside a specified ancestor.
- **Child (`>`)**: Targets only **direct children** of a parent.
- **Next-Sibling (`+`)**: Targets the element that is the **immediate next sibling**.
- **Subsequent-Sibling (`~`)**: Targets **all siblings** that follow a specified element.
## Grouping and Universal
- Grouping Selector: Applies the same styles to multiple selectors
- Universal Selector: Targets all elements in the documents
## Property Value Types
- **Absolute Length**: Fixed units like `px` (pixels), `cm`, or `in`.
- **Relative Length**: Flexible units like `em`/`rem` (relative to font size) or `vh`/`vw` (relative to **viewport height/width**).
- **Percentage (`%`)**: Relative to the parent element's dimensions.
- **Color**: Defined by keywords (e.g., `black`) or Hex codes (e.g., `#000000`).
- **Functions**: Used for calculations or transformations (e.g., `transform: rotate(90deg)`).
# Layout and Flexbox
The **`display`** property determines how an element is rendered (e.g., `block`, `inline`, `flex`).
![[Screenshot 2026-01-21 at 9.55.20 PM.png]]
![[Screenshot 2026-01-21 at 9.55.30 PM.png]]
## CSS Display, Box Model, and Position
### Position
Defines how an element is positioned in a document.
- **Positive** moves the element **away from that side**
- **Negative** moves it **towards that side**
Example:
```
top: 10px;   /* moves element DOWN */
top: -10px;  /* moves element UP */
```
### Position values
- static(default): element is not affected by the properties top, right, bottom, and left
- relative: offset is relative to the element's normal position
- absolute: offset is relative to the nearest positioned ancestor or viewport
- fixed: offset is relative to the viewport and remains fixed during scrolling 
- sticky: behaves like static at first, then “sticks” when scrolling past a threshold, uses top/right/bottom/left to decide where it sticks
### Margin
An invisible space around your box, value can be positive or negative
#### Margin Collapse
- When two margins touch, they may collapse into a single margin
- Merging Scenarios
	- Two positive values: collapse, the larger is used
	- Two negative values: collapse, the smaller is used
	- Only one is negative: collapse, the sum is used
### Border
- Define the line between margin and padding of box. They can be styed by setting their style, width, and color
- Can set the style
### Padding
- The space between border and the content area. It is used to push the content away from the border
- must be positive
### Display
how an element should be displayed on the web page
common values
- block: display like a block element
- inline: display like an inline element
- inline-block: no line break, affected by top & bottom margin and width & height
- flex: aiming at providing a more efficient way to layout, align and distribute space among items in a container
# Flexbox (Flexible Box Layout)
Flexbox is designed for **1-D layouts**, handling spacing and alignment in a single direction (row or column).
- **Approach**: It is **content-first**, meaning the layout adapts flexibly to the content size or the viewport.
- **Common Uses**:
	- **Vertically centering** content within a parent.
	- **Equally distributing** width or height among children.
	- Maintaining **uniform column heights** in multi-column layouts.
## Elements under Flexbox
- Flex Container: wrapper elements that are styled with display:flex
- Flex Item: direct child elements of a flex container
## Flex Container Properties
- flex-direction: define the main axis and direction of flex items
- flex-wrap: controls whether the flex items should wrap around to the next line or not
- flex-flow: setting flex-direction and flex wrap
- justify-content: align flex items in their main axis
- align-items: align the flex items in their cross axis
- align-content: align multiple rows or columns of flex items there is extra space on cross axis
- order: define order
- flex-baasis: initial size of the flex item
- flex-grow: a factor by which this item grows relative to the others
- flex-shrink: a factor by which this item shrinks relative to the others
- flex: setting flex-grow, flex-shrink, flex-basis
- algin-self: ...


https://flexboxfroggy.com/

