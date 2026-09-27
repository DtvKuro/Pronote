## INTRODUCTION TO HTML

### HyperText Markup Language

Markup Language (not a programming language)

**Tim Berners-Lee**

Father of HTML and the World Wide Web

---

## HTML STRUCTURE

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Page Title</title>
  </head>
  <body>
  </body>
</html>
```

`<!DOCTYPE html>` tells the browser its an HTML5 document.
`<title>` is the text that shows up on the browser tab.
**head** = metadata, links, title (stuff the user doesnt see directly)
**body** = everything the user actually sees on the page

---

## BASIC HTML ELEMENTS

### Headings

```html
<h1>Biggest</h1>
<h2>Second</h2>
<h3>Third</h3>
<h4>Fourth</h4>
<h5>Fifth</h5>
<h6>Smallest</h6>
```

h1 is the main heading. Only use ONE h1 per page for SEO.
h2-h6 for subheadings.

### Paragraph

```html
<p>This is a paragraph.</p>
```

block element. takes full width and starts on a new line.

### Anchor (Links)

```html
<a href="https://google.com">Go to Google</a>
```

**href** = the URL where the link goes.

```html
<a href="https://google.com" target="_blank">Google</a>
```

**target="_blank"** = opens the link in a new tab.

### Buttons

```html
<button>Click Me</button>
```

buttons dont do anything by themselves. you need JS or a form for that.

---

## INLINE VS BLOCK

**BLOCK** elements take the full width and start on a new line.

```html
<h1> <p> <div> <form> <ul> <ol> <li>
```

**INLINE** elements only take as much width as they need and stay on the same line.

```html
<a> <span> <img> <input> <button> <strong> <em>
```

_example:_

```html
<p>This is <span style="color:red">red</span> text</p>
```

span is used to style a piece of text inside a block element without breaking the line.

---

## TEXT FORMATTING

**<strong>Bold</strong>** - semantic bold (important text)
**<b>Bold</b>** - visual bold only (not semantic)

**<em>Italic</em>** - semantic italic (emphasized)
**<i>Italic</i>** - visual italic only

**<br>** - line break (self closing, no `</br>`)

use strong and em over b and i because search engines understand them better.

---

## HTML ENTITIES

Special characters that cant be typed directly in HTML.

```html
&#62;  = >
&#60;  = <
&#183; = middle dot
&#10003; = checkmark
&amp;  = &
&copy; = copyright symbol
```

useful when you need symbols that HTML would interpret as code.

---

## LISTS

### Unordered List (Bullets)

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

### Ordered List (Numbered)

```html
<ol>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>
```

li = list item. always wrapped inside ul or ol.

---

## IMAGES

```html
<img src="image.jpg">
```

self closing tag. no `</img>` needed.

_important attributes:_

**src** = the path or URL to the image
**alt** = text shown if image fails to load (also for accessibility)
**width** = sets width
**height** = sets height

```html
<img src="kaoru.jpg" alt="Kaoru" width="200px">
```

if you only set width, height auto adjusts to keep the ratio.

---

## DIV

```html
<div>Content here</div>
```

the most used HTML element. its a container that groups other elements together.
div is a block element by default (takes full width).
by itself it does nothing visible. you style it with CSS.

### Nesting Divs

You can put divs inside divs to build complex layouts.

```html
<div class="card">
  <div class="profile-section">
    <img src="pfp.jpg">
  </div>
  <div class="info-section">
    <p class="name">Kuroo</p>
    <p class="username">@FxKuroo</p>
  </div>
  <div class="action-section">
    <button>Follow</button>
  </div>
</div>
```

think of it like boxes inside boxes.
the outer div is the whole card, inner divs organize the sections.

---

## INPUTS

```html
<input type="text" placeholder="Enter your name">
```

**type** determines what kind of input it is:

**text** = regular text
**password** = hides the characters
**email** = validates email format
**number** = only numbers
**checkbox** = a toggle box
**radio** = pick one from a group

**placeholder** = gray hint text shown before user types

```html
<input type="text" placeholder="Search...">
```

input is self closing. no `</input>`.

---

## LINKING CSS AND JS

### External CSS

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

### External JS

```html
<body>
  <script src="script.js"></script>
</body>
```

putting script at the bottom makes sure the HTML loads first before JS runs.

### Google Fonts Link

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
```

---

## META TAGS

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

`charset="utf-8"` is character encoding so special characters display properly.
`viewport` meta is required for responsive design. without it, mobile browsers zoom out the page.

---

## PROJECTS BUILT

1. Buttons (Subscribe, Join, Tweet) - learned hover, active, transitions
2. YouTube Video Card - learned text styling, spans, Google Fonts
3. Simple Webpage - first HTML page with links and buttons
4. Google Homepage Clone - centered layout, search input styling, box-shadow
5. Facebook Friend Suggestions - inline-block cards, profile pics, hover effects
6. Twitter/X Post - nested flexbox, profile + content layout
7. Email Inbox - flex rows with space-between, bold subjects, time display
8. Discord Sidebar - fixed positioning, dual sidebars, hover effects on icons
9. Product Cards with Overlays - absolute positioning, hover opacity transitions
10. Modal Popup - fixed overlay with flex-centered card
