## INTRODUCTION TO EJS

From Submitting "name" with app.post

how do we get the "name" from the app.post
into a new html, using the name in it?

That is done using **Templating**.

Tho we can do it via `res.send("coding");`
but if the code is already complex page of html then its gonna be clustered, making the js file full with HTML.

#### Separation of Concern

```
Frontend          Backend
CSS (Style)    |
HTML(Structure)| JS(Functionality)
```

In order to separate them both we can use **Templating Language**,
or **"EJS"**

---

## EMBEDDED JAVASCRIPT (EJS)

Back to the problem, we can use EJS to render data from user using

```js
app.post("/", (req, res)=>{
  res.render("index.ejs", //here
    { name: req.body["name"]} //This is how you pass on the file from frontend to backend then back to frontend.
  ); //to here
});
```

Then in EJS we can do

```ejs
<body>
  <h1>
    Hello <%=name %> //the name in here shoulde match the "name:" from js because theyre one. Its like var name; then using name.
  </h1>
</body>
```

---

## SETUP

```
npm i ejs express
```

EJS files go inside a **views/** folder. Express automatically looks there.

```
project/
├── index.js
├── package.json
└── views/
    └── index.ejs
```

You dont need `app.set("view engine", "ejs")` or anything, express just knows to look in views/.

BUT theres a difference:

- If you DO set `app.set("view engine", "ejs")`, you can write `res.render("index")` without the extension.
- If you DONT set it, you have to write `res.render("index.ejs")` with the full extension.

Express auto-detects the engine from the file extension, so the config is just a convenience to skip typing ".ejs" every time. Thats literally it.

---

## RES.RENDER VS RES.SEND VS RES.SENDFILE

`res.send("text")` - sends raw text or HTML string.
`res.sendFile(__dirname + "/public/index.html")` - sends an actual file.
`res.render("index.ejs", { data })` - renders an EJS template and passes data to it.

**render** is specifically for templating. You use it when you need to inject backend data into the page.

---

## HOW RES.RENDER PASSES DATA

```js
res.render("index.ejs", {
  newVarForEJS: theVarInJS
});
```

the **left side (key)** is the variable name that EJS will use.
the **right side (value)** is the actual data from your JS server.

so if you do `{ Day: DayWeek }`, inside ejs you use `<%= Day %>` not `<%= DayWeek %>`.
the ejs file doesnt know DayWeek exists. it only knows what you gave it through that object.

you can pass multiple:

```js
res.render("index.ejs", {
  Day: DayWeek,
  name: "Japs",
  age: 20
});
```

---

## WHY VIEWS/ FOLDER

when you do `res.render("index.ejs")`, express internally looks for **views/index.ejs**.
you didnt configure this. its just express's default folder for templates.
so your .ejs files MUST be inside views/ or express wont find them.

---

## PASSING SERVER-SIDE LOGIC TO EJS

You can compute stuff in your server first then just pass the result.

```js
const today = new Date();
const dayNum = today.getDay();
let DayWeek;

if (dayNum == 0 || dayNum == 6){
  DayWeek = "weekend";
}else{
  DayWeek = "weekday";
}

app.get("/", (req, res)=>{
  res.render("index.ejs",
    {Day: DayWeek} //passing the computed result, not the raw number
  );
});
```

EJS just receives the final value. It doesnt care how you got it.

---

## LOGIC IN EJS VS SERVER

You can write logic in either place. Both work.

**Server-side (index.js)** - for heavy stuff like DB queries, API calls, auth, computation.
**EJS side (.ejs file)** - for simple display logic like showing/hiding elements, if/else for what to render.

In the 4.0 project the day check was done both server-side AND in ejs. Either works but doing it server-side keeps the template cleaner. _EJS should mostly just display, not compute._

---

## EJS TAGS

`<%= variable %>` JS Output, it can output the variables from backend as a text in the HTML.
`<% console.log("Hello") %>` JS Execute, This is not visible in the page and runs in the backend.
`<%- <h1> Hello </h1> %>` Render HTML, This is used for when the variable from backend has HTML tags, you can display the variable as pure text in HTML.
`<% % % %>` Shows the <% and %>, This is used for when making a website teaching about EJS and you need to show the EJS tags.
`<%# %>` Comment, Everything inside is not read.
`<%- include("file.ejs") %>` Insert another EJS File.

---

## PASSING DATA TO EJS TEMPLATE

Passing data from server to client and client to server.

### Server To EJS

is done via:

`res.render(index.ejs, newVar = var)` then `<%= newVar %>`

EJS Cannot detect variables so if we want it to check the JS file
incase the JS forgot to have passing data, EJS can check via

`<% if (locals.newVar) %>`

the EJS will check for data newVar in the JS

or it can be in the JS File via `res.locals`

`res` ONLY exists inside app.get, app.post, app.use, etc. because res is created fresh every time someone visits your site. you cant use res outside of those -- it doesnt exist there.

`res.locals` lets you set variables for EJS without passing them in `res.render()`.

_two ways to write it:_

```js
// one by one
res.locals.name = "Japs";
res.locals.year = 2026;

// or all at once
res.locals = { name: "Japs", year: 2026 };
```

both do the same thing. pick whichever.

if you put it inside middleware (app.use), every route after it can use those variables in EJS. so you set it once and its everywhere.

```js
app.use((req, res, next) => {
  res.locals = { year: 2026, siteName: "MyApp" };
  next();
});
```

now every `res.render()` in every route can use `<%= year %>` and `<%= siteName %>` without you passing them manually each time.

for one-time stuff that only one route needs, just pass it directly in `res.render("index.ejs", { name: name })`. dont overcomplicate it.

BUT `res.locals` in middleware cant use form data. middleware runs BEFORE the route, so it doesnt know what the client submitted yet. its only for stuff you already know -- like the year, site name, or a logged-in user from a session.

form data from POST only exists inside that specific app.post route via `req.body`. if you need that data in other routes later, store it somewhere (variable, database) and grab it from there -- not through `res.locals` middleware.

### Client To Server

is done via forms.

when a user submits a form, the browser sends the data to the server through app.post.

```html
<form action="/submit" method="POST">
  <input type="text" name="fName">
  <input type="submit" value="OK">
</form>
```

the **"name"** attribute in the input is the key. so in express you grab it with `req.body["fName"]`.
without bodyParser (or express.urlencoded) `req.body` is undefined. you need:

```js
app.use(bodyParser.urlencoded({ extended: true }));
```

then in your post route you can do whatever with the data and pass it back to EJS:

```js
app.post("/submit", (req, res) => {
  let name = req.body["fName"];
  res.render("index.ejs", { name: name });
});
```

_so the full loop is:_
**Client (form submit) -> Server (req.body) -> EJS (res.render with data) -> Client (sees the result)**

---

## CHECKING IF DATA EXISTS IN EJS

when you load the page via app.get, no data was passed. so if you do `<%= name %>` it crashes because name doesnt exist.

_fix: use `locals.name` to safely check._

```ejs
<% if (locals.name){ %>

  <h1>Your name is <%= name %></h1>
<% }else{ %>
  <h1>Hello! What is your Name?</h1>
<% } %>
```

**locals** is an object that holds all the variables passed to the template. if nothing was passed, `locals.name` is just undefined instead of throwing an error. its like a safe way to check "did the server send me this?"

---

## EJS PARTIALS AND LAYOUTS

#### Reusing EJS Code

linking Static files like css on EJS wont work.
we have to use a middle ware for css to be used.

```js
App.use(express.static("public"));
```

```
public -> style
       -> image
```

the EJS can now detect the location of href in the EJS

### Partials

allows user to reduce the code by acting as a template, to not repeat code.

_example:_

```ejs
<% -include("header.ejs") %>
CODING
<% -include("footer.ejs") %>
```
