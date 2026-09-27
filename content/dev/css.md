## INTRODUCTION TO CSS

### Cascading Style Sheets

Style Sheet Language

CSS
SAS
LESS

**Hakon Wium Lie**

Father of Cascading Style Sheets

---

## CSS TYPES

### Inline (For Single Element or For Testing)

_example:_
```html
<button style="color:blue"> Send </button>
```

### Internal (For Single Webpage)

```html
<head>
  <style>
    .button
    {
      color: blue;
    }
  </style>
</head>
<body>
  <button>Send</button>
</body>
```

### External (For Multi Page)

in head of html

```html
<link rel="stylesheet" href="style.css">
```

In css file

```css
button
{
color: blue;
}
```

---

## CSS SELECTOR

### Element Selector

```html
<h2>red</h2>
<h2>blue</h2>
<h2>green</h2>
```

```css
h2
{
  color: red;
}
```

Theyre all red since h2 is **"Element Selector"**. You select all h2.

### Class Selector (Multiple Elements)

```html
<h2 class="red-text">red</h2>
<h2>blue</h2>
<h2>green</h2>
```

```css
.red-text{
color: red;
}
```

### ID Selector (Only For One Element)

```html
<h2 id="Main">red</h2>
<h2>blue</h2>
<h2>green</h2>
```

```css
#main{
color:red;
}
```

### Attribute Selector

```css
P[draggable]{
color : red;
}
```

its gonna edit all paragraph that is draggable.

```css
P[draggable="false"]{
color: red;
}
```

Same concept but now it edits things that arent draggable.

### Universal Selector

It select all

```css
*{
color: red;
}
```

---

## RESPONSIVE WEBSITES

### 1. Media Query

```css
@media (max-width: 600px) {
  /* CSS for screens below 600px */
}
```

### 2. CSS Grid

Main container = display Grid

```css
grid-template-columns: 1fr 1fr;
grid-template-rows: 100px 200px 200px;
gap: 30px;

.first{
grid-column: span 2;
}
```

max screen (theres 1fr + 1fr basically the both of them will split for full screen).
`.first` with `grid-column: span 2` means this item will occupy 2 columns.

### 3. CSS Flexbox

```css
.flex-container{
display:flex;
}

.first{
flex: 2;
}

.second{
flex: 0.5;
}
```

this is like grid's 1fr 1fr but simplier. `.second` with `flex: 0.5` is half of the screen.

### 4. External Framework e.g Bootstrap Framework

```html
<div class="container">
  <div class="row">
    <div class="card col-6">Card</div>
    <div class="card col-2">Card</div>
    <div class="card col-4">Card</div>
  </div>
</div>
```

the width is 12 columns so we can use the class to use it easier (Import Bootstrap).

---

## FLEXBOX

**Flex-direction: row;**

```
---------------------------->>>
```

```css
flex-basis: 100px;
```

will set the items inside the container to have 100px width(row).

**Flex-direciton: column;**

```
l
l
l
V
```

```css
flex-basis: 100px;
```

sets item to have 100px height(column).

### Flex-Basis

Targets the items instead of parents.

`flex-wrap: nowrap;` = align-items works

`flex-wrap: wrap;` = align-content works

**FLEX: 1 1 0;** ==== SHORTER VERSION **FLEX: 1;**
**FLEX** = GROW SHRINK BASIS;

```css
flex: 0 0 400px;
```

---

## GRID LAYOUT

`grid-column: span 2` means it will occupy 2 spaces in the column.

which is short For

`grid-column-start: 1;` which line the grid will start from.
`grid-column-end: 3;` where the content will end.

so basically its occupying two spaces

```
1 (here) 2 (and here) 3 4 -1
```

one thing to take note is that the very right is -1 incase you want something to fill the whole screen.

You can do the same in ROW

### Moving A Content

Now in order to move a content somwhere you can use

```css
grid-column-start: 1;
grid-column-end: 3;
grid-row-start: 2;
grid-row-end: 3;
```

```
1 2 3 4 -1

2
 its here
column 1-3
row 2-3
3
```

You can also shorten it to

**grid-area:** row-start / column-start / row-end / column-end;
`grid-area: 2 / 1 / 3 / 3;`

---

## BOOTSTRAP NOTATION

### Display Utility Classes

Notation
Display utility classes that apply to all breakpoints, from xs to xxl, have no breakpoint abbreviation in them.
This is because those classes are applied from min-width: 0; and up, and thus are not bound by a media query.
The remaining breakpoints, however, do include a breakpoint abbreviation.

As such, the classes are named using the format:

**.d-{value}** for xs
**.d-{breakpoint}-{value}** for sm, md, lg, xl, and xxl.
Where value is one of:

none
inline
inline-block
block
grid
inline-grid
table
table-cell
table-row
flex
inline-flex
The display values can be altered by changing the display values defined in $utilities and recompiling the SCSS.

The media queries affect screen widths with the given breakpoint or larger.
_For example, .d-lg-none sets display: none; on lg, xl, and xxl screens._

### Class Names In Bootstrap

**{Property}-{sides}-{size}** for xs
**{Property}-{sides}{breakpoint}-{size}** for sm, md, lg, xl, and xxl.

**property** is

**m** - margin
**p** - padding

**sides** is

**t** - top
**b** - bottom
**s** - start
**e** - end
**x** - classes that sets both *-left and -*right
**y** - classes that sets both *-top and -*bottom

**size**

0-5 and auto

_example_

```html
 <div class="col mb-3">
```

margin bottom 3

---

## DARK MODE

```html
  <!doctype html>
<html lang="en" data-bs-theme="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  </head>
  <body>
    <h1>Hello, world!</h1>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  </body>
</html>
```

`data-bs-theme="dark"` changes the website to dark mode.

You can find bootstrap template for your website online for free.

---

## BOX MODEL

Every HTML element is a box made of 4 layers:

**Content** (the actual text/image)
|
**Padding** (space between content and border)
|
**Border** (the visible edge)
|
**Margin** (space outside the border, between other elements)

```css
padding: 10px; /* all sides */
padding: 10px 20px; /* top-bottom left-right */
padding: 10px 20px 10px 20px; /* top right bottom left (clockwise) */
```

margin works the same way.

```css
margin: 0 auto;
```

centers a block element horizontally. 0 = no top/bottom margin, auto = equal left-right margin.

---

## DISPLAY PROPERTY

`display: block;` takes full width, stacks vertically.
`display: inline;` only takes needed width, stays on the same line, CANT set width/height.
`display: inline-block;` stays on same line BUT you CAN set width/height.
`display: none;` hides the element completely.

inline-block is the key to putting things side by side before flexbox/grid.
you can make cards sit next to each other with inline-block.

```css
.card {
display: inline-block;
width: 150px;
vertical-align: top;
}
```

`vertical-align: top;` aligns them at the top instead of baseline.

problem: inline-block has a small gap between elements caused by whitespace in HTML.
flexbox and grid dont have this problem.

---

## VERTICAL-ALIGN

`vertical-align: top;` aligns inline-block elements to the top.
`vertical-align: middle;` aligns to the middle.

only works on inline and inline-block elements.
useful when you have a paragraph and a button on the same line.

---

## BOX-SHADOW

`box-shadow: 0 1px 5px rgba(0,0,0,0.15);`

gives the floating card effect. `rgba(0,0,0,0.15)` is black with 15% opacity for a subtle shadow.

```css
box-shadow: 0 1px 6px rgba(0,0,0,0.1); /* Google search bar style */
```

format: _x-offset y-offset blur-radius color_

---

## OBJECT-FIT AND OBJECT-POSITION

`object-fit: cover;` crops image to fill the box without stretching.
`object-fit: contain;` fits the whole image inside the box (may leave gaps).

`object-position: center;` where the crop focuses.

```css
img {
width: 200px;
height: 200px;
object-fit: cover;
object-position: center;
border-radius: 100px;
}
```

this makes a circular profile picture. object-fit cover is the key
so the image doesnt get squished into the square.

`border-radius: 10px;` rounded corners.
`border-radius: 100px;` full circle (if width and height are equal).
`border-radius: 50%;` also makes circle, works for any size.

---

## HOVER AND ACTIVE STATES

`:hover` = when the mouse is over the element.
`:active` = when the element is being clicked.

```css
button:hover {
background-color: #333;
opacity: 0.8;
}

button:active {
background-color: gray;
}
```

hover is for visual feedback. active is for click feedback.

---

## TRANSITIONS

`transition: all 0.2s;` smoothly animates ALL property changes over 0.2 seconds.

without transition, hover changes are instant. with it, they fade smoothly.

```css
button {
background-color: black;
color: white;
padding: 10px 20px;
transition: all 0.15s;
}

button:hover {
padding: 10px 30px; /* button stretches on hover */
}

button:active {
box-shadow: none; /* shadow disappears when clicked */
}
```

you can also target specific properties:

```css
transition: background-color 0.2s;
transition: opacity 0.15s;
transition: box-shadow 0.2s;
```

---

## CURSOR

`cursor: pointer;` shows the hand icon when hovering.

always add this to clickable elements that arent already links or buttons.
buttons have pointer by default but divs and spans dont.

---

## OPACITY

`opacity: 1;` fully visible.
`opacity: 0.5;` 50% transparent.
`opacity: 0;` invisible but still takes up space.

different from `display:none` which removes the element from the layout entirely.

commonly used for hover effects:

```css
.button:hover {
opacity: 0.8;
}
```

---

## STYLING INPUTS

```css
input {
border: 1px solid gray;
border-radius: 5px;
padding: 10px 15px;
}
```

to remove the default border completely:

```css
input {
border: 0;
outline: none;
box-shadow: 0 1px 6px rgba(0,0,0,0.1);
}
```

`outline: none;` removes the blue glow on focus. The subtle shadow replaces it.
this is how Google styles their search bar.

---

## GOOGLE FONTS

Step 1: Go to _fonts.google.com_
Step 2: Pick a font _(example: Montserrat, Roboto)_
Step 3: Copy the `<link>` tag and paste it in your `<head>`

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
```

Step 4: Use it in CSS

```css
body {
font-family: "Montserrat", sans-serif;
}
```

wght@400;700 means you're loading regular (400) and bold (700) weights.
sans-serif is the fallback if the font fails to load.

---

## UNIVERSAL SELECTOR RESET

```css
* {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
```

`*` selects ALL elements on the page.
this removes default browser spacing and sets a consistent font.
most websites start with some version of this reset.

---

## NESTED FLEX

you can put flex containers inside flex containers.
this is how you build complex layouts like email inboxes or social media posts.

- outer flex = row (profile pic on left, content on right)
- content flex = column (header on top, text below)
- header flex = row with space-between (name on left, time on right)

`flex-shrink: 0;` prevents an item from shrinking when the container gets small.
useful for profile pictures that should stay the same size.

---

## POSITION

`position: static;` default. element flows normally in the document.

### Fixed

`position: fixed;` stays in place even when you scroll.

```css
.header {
position: fixed;
top: 0;
left: 0;
right: 0;
}
```

`right: 0;` stretches full width.

fixed removes the element from normal flow.
the page scrolls but the fixed element stays put.
used for: headers, sidebars, floating buttons, modals.

### Absolute

`position: absolute;` positions relative to the nearest positioned parent.

```css
.close-btn {
position: absolute;
top: 5px;
right: 5px;
}
```

if no parent has position set, it positions relative to the whole page.
**IMPORTANT:** the parent needs `position: relative;` for absolute to work relative to it.

### Relative

`position: relative;` the element stays in normal flow but you can nudge it.

mostly used as a PARENT for absolute children.

```css
.card {
position: relative;
}

.badge {
position: absolute;
top: -10px;
right: -10px;
}
```

this is how you make sale badges, close buttons, timestamps on thumbnails, etc.

#### Inset Shorthand

`inset: 0;` same as top:0; right:0; bottom:0; left:0;

useful for full-screen overlays.

```css
.overlay {
position: fixed;
inset: 0;
background-color: rgba(0,0,0,0.5);
}
```

---

## Z-INDEX

**z-index** controls which element appears on top when they overlap.

higher z-index = on top
lower z-index = behind

only works on positioned elements (relative, absolute, fixed).

```css
.modal {
z-index: 100;
}

.shade {
z-index: 99;
}
```

modal sits on top of the shade because 100 > 99.

---

## MODAL (POPUP)

A modal is a box that appears on top of everything with a dark background behind it.

```css
.shade {
position: fixed;
inset: 0;
background-color: rgba(0,0,0,0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal {
background-color: white;
padding: 30px;
border-radius: 10px;
}
```

the shade covers the whole screen and centers the modal using flexbox.
`rgba(0,0,0,0.5)` is black at 50% opacity so you can still see the page behind it.

---

## HOVER OVERLAY

when you hover over a product image, a semi-transparent overlay appears with an "Add to Cart" button.

```css
.product {
position: relative;
}

.overlay {
position: absolute;
bottom: 0;
left: 0;
right: 0;
height: 40%;
background-color: rgba(0,0,0,0.7);
opacity: 0;
transition: opacity 0.3s;
display: flex;
align-items: center;
justify-content: center;
}

.product:hover .overlay {
opacity: 1;
}
```

the overlay is always there but invisible (opacity: 0).
on hover, opacity becomes 1 and it fades in.
the button inside the overlay becomes clickable.
