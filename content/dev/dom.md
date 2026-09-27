## WAYS TO USE JAVASCRIPT

### 1. Inline Javascript

onload is when body loaded up it
will alert the message 'Hello World!' but inline javascript is not recommended
since its hard to debug just like css.

```html
<body onload="alert('Hello World!')"></body>
```

### 2. Script Tag

you use a script tag to write js inside in it.

```html
<script type="text/javascript">
  alert("Hello World!");
</script>
```

### 3. External Source

you create a index.js file and script src that file from
the html. you put it in the end before body so that it loads up everything
before modifying.

```html
<script src="" charset="utf-8"></script>
```

---

## DOM

### Document Object Model

`document.querySelector()` looks for element inside the ().

```js
document.querySelector("h1").innerHTML = "Goodbye";
```

`.innerHTML = "Blah";` allows you to replace the one inside the () to be "Blah";

**DOM** converts elements into a tree structure. Which allows us to access or manipulate the elements.
It also maps out the connection to others through the tree diagram.

```
    DOCUMENT
       |
      HTML
      /   \
    HEAD   BODY
     |     |
   TITLE  BUTTON
     |     |
  "DOM"  "Click Me"
```

In console of dev tools, you can type document to see the whole document object model.
`#document` is the entire html file.

in order to navigate it tho you have to do
`document.firstElementChild;` this will give you the first element which is HTML and everything inside of it.

Then you went even farther which is the first folder of html which is head
`document.firstElementChild.firstElementChild;` you will get head and everything inside of it.

and you can use this for the body
`document.firstElementChild.lastElementChild;` you will get body and everything inside of it.

```
HTML
L HEAD - TITLE
|
|
L BODY - H1
```

In order to access the H1

`document.firstElementChild.lastElementChild.firstElementChild;`

```
HTML                        BODY              H1
```

You can manipulate the H1 by making it a variable.

```js
var heading = document.firstElementChild.lastElementChild.firstElementChild;
heading.innerHTML = "Goodbye";
```

This will manipulate the HTML elements. DOM To Goodbye

you can do variety of manipulation in the element like styling.

```js
heading.style.color = "red";
```

```html
<input class="checker" type="checkbox">Click Me</input>
```

`document.querySelector("input").click();` will click the checkbox for you.

---

## PROPERTY AND METHOD

An element has **property** and **method**.

### Property

property is something that describes the element like color, size, etc.

_Examples:_
- `.innerHTML`
- `.style`
- `.firstElementChild`

### Method

method is something that the element can do like click, focus, etc.

_Examples:_
- `.click()`
- `.appendChild()` - add another child
- `.setAttribute()` - set an attribute to the element like id, class, etc.

**getter of property** = `className.property;` e.g. `button.color;` which will extract the color of the element with class checker.
**setter of property** = `className.property = "value";` e.g. `button.color = "red";` which will change the color of the element to red.

**Call Method** = `className.method();` e.g. `button.click();` which will click the button element.

**Method** is something that an object can do like click, focus, etc.

---

## DEFER VS ASYNC (SCRIPT LOADING)

When you link an external script with `<script src="">`, the browser normally
STOPS parsing the HTML, downloads the script, runs it, then continues parsing.
This is why we put scripts at the bottom of `<body>`.

But there are two attributes that let the browser keep parsing while downloading:

### Loading Attributes

#### defer

- Browser downloads the script in the background while parsing HTML.
- Script WAITS to execute until the HTML is fully parsed.
- Multiple defer scripts run in the ORDER they appear in the HTML.
- Acts like placing your script at the bottom of `<body>`, but starts downloading earlier.

```html
<script src="app.js" defer></script>
```

_Use when:_
- Your script needs DOM elements (buttons, divs, etc.)
- Script order matters (e.g., jQuery must load before a plugin that uses it)

#### async

- Browser downloads the script in the background while parsing HTML.
- Script runs IMMEDIATELY after download finishes, even if HTML isn't done parsing.
- Multiple async scripts run in whatever order they finish downloading (no guaranteed order).

```html
<script src="tracker.js" async></script>
```

_Use when:_
- The script is independent (doesn't touch the DOM or rely on other scripts)
- _Examples: analytics, ads, tracking pixels_

### Best Practices For Script Placement

#### Why NOT Put Scripts At The Bottom of Body (Old Approach)

- Putting `<script>` at the bottom means the browser waits until the ENTIRE HTML
  is parsed before it even STARTS downloading the script.
- On large websites this is slow. If a page takes more than 2 seconds to load,
  users leave.
- The better approach: put scripts in `<head>` with defer or async so the browser
  starts downloading them immediately while still parsing HTML.

#### The Modern Approach

Put your scripts in `<head>` and use defer or async.
This gives you the best of both worlds:
- Scripts start downloading right away (not waiting for full HTML parse)
- HTML parsing is not blocked

```html
<head>
  <script src="app.js" defer></script>       <!-- for DOM-dependent scripts -->
  <script src="analytics.js" async></script>  <!-- for independent scripts -->
</head>
```

#### Module Scripts

Scripts with `type="module"` automatically behave like defer (loaded in order,
executed after HTML is parsed). No need to add defer manually.

```html
<script type="module" src="app-module.js"></script>
```

### Summary Table

```
Feature         | defer                          | async
Blocks parsing? | No                             | No
Runs when?      | After HTML is fully parsed      | As soon as download finishes
Script order?   | Preserved (runs in order)       | Not guaranteed
Best for?       | DOM-dependent scripts (UI, app) | Independent scripts (ads, analytics)
```

---

## GETELEMENT COMMANDS

```js
document.getElementsByTagName("li");
```

will show an Array of li elements and their content.

Putting `[]` after the `("li")` allows you to choose which in the array you will modify.
_Example:_

```js
document.getElementByTagName("li")[2].style.color = "black";
```

```js
document.getElementsByClassName("ClassName");
```

it'll still show as Array even if theres only one element in the class.

You have to use `[]` (Array call out), in order to use the content inside.

```js
document.getElementById("Id").style.color = "Whitesmoke";
```

Id is only for single element so this will not show up as an Array.

---

## MODERN SELECTORS

### querySelector

```js
document.querySelector();
```

this works for tag, id, class, etc. The name is the same as CSS combining names also works for child and parent.

```js
document.querySelectorAll();
```

this will work if you want to target all elements inside the (). It will show as an array. And use `[]` to specify which will be used.

### classList

```js
document.querySelector("button").classList;
```

This will give an array of classnames that has uses a button.

```js
document.querySelector("button").classList.add("Invisible");
```

you can add another class which can now be accessible in CSS after this command.

IN CSS

```css
.Invisible{
  visibility: hidden;
}
```

```js
document.querySelector("button").classList.remove("invisible");
```

you can make the button reappear by removing the class again.

```js
document.querySelector("button").classList.toggle("invisible");
```

if the button is invisible then it will make it visible but if the button is visible then its gonna be invisible.

Whenever you put this command it will log in console as true or false. This is for debugging the behaviour. Take note that there must be css style targetting "invisible" so that whenever you use the toggle command the style you did will work.

---

## MANIPULATING CONTENT

You can manipulate the content on HTML using two commands.

**1.** `.innerHTML` - This is good however if you put span inside it. The result will include the `<span>` and any other HTML tags inside the h1.

```js
document.querySelector("h1").innerHTML;
```

A great use for this is putting HTML tags inside. like span for example:

```js
document.querySelector("h1").innerHTML = "<em>Wowwers</em>";
```

This will put the emphasis on h1.

**2.** `.textContent` - This will output the textContent only. Also usable through manipulation.

```js
document.querySelector("h1").textContent;
```

---

## MANIPULATING HTML ELEMENT ATTRIBUTES

_Examples of attributes: id, class, href, style, title, img, etc._

`.attributes` will show all attributes that are inside all `<a>`. For example since its a, there should be href. That will be the output.

```js
document.querySelector("a").attributes;
```

`.getAttribute("href")` will allow you to get the content of href, after viewing what attribute is in a.

```js
document.querySelector("a").getAttribute("href");
```

`.setAttribute("href", "value")` will allow you to change the content of the attribute by first putting the target attribute which in this case is href then comma, the content you wanna change it to.

```js
document.querySelector("a").setAttribute("href", "https://www.roblox.com");
```

---

## EVENT LISTENER

```js
document.querySelector("button").addEventListener(type, listener)
```

**Type** could be an event like click, scroll up, etc.
**Listener** is the function that would be called if click is detected.

_Example:_

The function dont have () because thats auto call. Its bare so that it only activates when click happens.

```js
document.querySelector("button").addEventListener("click", handleClick);

function handleClick(){
  alert("Clicked");
}
```

_Another example on how to use addeventlistener:_

#### Anonymous Function

```js
document.querySelector("button").addEventListener("click", function(){
  alert("Clicked");
});
```

#### How To Use Loop In A Function

```js
for (var i = 0; i<7; i++){
  document.querySelectorAll("button")[i].addEventListener("click", function () {
    alert("You got clicked mr sir");
  });
}
```

---

## DEBUGGER

Hold shift and enter to use the debugger.

```js
debugger;
function();
```

This shows the step by step process of the function you called.

---

## HIGHER ORDER FUNCTIONS

**higher order functions** are functions that can take other functions as input.

_Example:_

```js
function add(num1, num2){
  return num1 + num2;
}
function multiply(num1, num2){
  return num1 * num2;
}
function divide(num1, num2){
  return num1 / num2;
}
function minus(num1, num2){
  return num1 - num2;
}

function calcu(num1, num2, operator){
  return operator(num1,num2);
}
```

This way you can use the calcu function to call the add function.

---

## PLAYING SOUNDS ON JAVASCRIPT

```js
var audio = new Audio('./sounds/tom-1.mp3')
audio.play();
```

`this` command identifies which button was clicked.

---

## SWITCH STATEMENT

For multiple choices where theres so many options that if else will become too long, you can use **Switch**.

```js
switch(input){
  case "condition":
    blahblah
    break;

    default: }
```

---

## OBJECTS

### Assigning Objects

```js
var bellBoy1 = {
  name: "Cy",
  age: 19,
  hasWorkPermit: true,
  languages: ["French", "English"]
}

bellBoy1.name
bellBoy1.age
bellBoy1.languagess[0]
```

### Dot Notation vs Bracket Notation

**Dot notation** only works when you type the property name directly.

```js
bellBoy1.name // works, you're typing "name" directly
```

**Bracket notation** lets you use a variable to decide which property to access.

```js
var key = "name";
bellBoy1[key]  // works, looks for the property "name"
bellBoy1.key   // WRONG, looks for a property literally called "key", not "name"
```

Use bracket notation when the property name is stored in a variable (e.g., from user input or a function parameter).

---

### Creating Objects With Constructor

#### Constructor Function

Basically like a factory to create an Object.

The function's first letter must be capital so it can be identified as **Constructor Function**.

```js
function BellBoy (name, age, hasWorkPermit, languages){
  this.name = name;
  this.age = age;
  this.hasWorkPermit = hasWorkPermit;
  this.languages = languages;
}
```

#### Initialising Object

```js
var bellBoy1 = new BellBoy("Cy", 19, true, ["Japanese", "English", "Tagalog"]);
```

---

## METHODS

**Method** = function inside an object

```js
var bellBoy1 = {
  name: "Cy",
  age: 19,
  hasWorkPermit: true,
  languages: ["French", "English"]
    moveSuitcase: function(){
      alert("May i take your suitcase?");
      pickupSuitcase();
      move();
    }
}
```

_Calling method_

```js
bellBoy1.moveSuitcase();
```

You can use this Method in Constructor Function the same way.

```js
this.moveSuitcase = function(){
  alert("May i take your suitcase?");
  pickupSuitcase();
  move();
}
```

---

## KEYBOARD AS EVENTLISTENER

Its document because the event will listen to the whole page for keyboard. Unlike for the mouse clicks which only targetted the button.

The event input lets us know what was pressed so that the function was executed.

```js
document.addEventListener("keydown", function(event) {
  console.log(key);
})
```

---

## UNDERSTANDING CALLBACKS

#### How To Respond To Events

`addEventListener()` is a Higher Order Function because it can take function as input, The "respondToKey"

The function taking input is called **Callback Function**, allowing us to wait for something to happen before executing.

```js
document.addEventListener("keypress", respondToKey(event));
```

You can access the event through callback like this. You can use event as _event, evt or e_.

You will get information about the event that happened, namely click. You can get things like location of click on screen and client, or if its trusted, if ctrl was used while clicking, alt key, and many more.

```js
document.addEventListener("click", respondToKey(event));

function respondToKey(event){
  console.log(event);
}
```

#### How addEventListener Works Under The Hood

```js
function anotherAddEventListener(typeofEvent, callback){

  // detects the event

  var eventThatHappened = {
    eventType: "click",
    key : 'p',
    pressDuration: .2
  }

  if (eventThatHappened.eventType === typeofEvent){
    callback(eventThatHappened)
  }

}
```

---

## SETTIMEOUT

```js
setTimeout(function() {
  // what you wanna happen
}, timeout in millisecond)

setTimeout(function (){
  activatedDrum.classList.remove("pressed");
}, 1000);
```
