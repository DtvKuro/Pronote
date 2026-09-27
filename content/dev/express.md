## INTRODUCTION TO EXPRESS

**Express** is a JS Framework which is used for backend
and **Node** is a runtime environment that allows Javascript be used on the pc itself.
Instead of just being in a website.

Express + Node = Full

Express allows us to use JS and Node much faster and easier.

Creating the server side using express and node. As in the application which the server calls out.
The application will be done using Express + Node.

**Localhost** is server hosted locally making our computer the server of website

_localhost:portnumber_

port is a door in a computer with number.

once you set the server to listen to that port, when we access localhost.
Its gonna look in the computer for portnumber, then through that port it can find the application thats listening and ready to respond to any request like sending HTML, CSS or JS.

A Server has alot of ports(or a door in this case) is because the server must take multiple amounts of request without interfering with each other.

---

## HTTP

**HTTP** - Hyper Text Transfer Protocol

is a language that allows computers to connect to other computer.

### Request Vocab

**GET** - Request resource (HTML,CSS, JS, etc.)
**POST** - Sending resource to the server (User's Input to the server)
UPDATING{
**PUT** - Replacing resource.
**PATCH** - Patch up a resource. Specific resource that wants to be sent or replaced.
}
**DELETE** - Deletes resource from DB, client, or server.

---

## CREATING A SERVER

```js
import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.listen(port,()=>{
  console.log(`Server running on port ${port}.`);
});
```

`import express from "express";` in order to use express functions.
`const app = express();` getting hold of express function as constant variable.
`const port = 3000;` setting the port that client request to.
When `localhost:3000` is ran it GET'S "/" or root which then executes everything inside the function.
`app.listen` starts the server on port 3000 with a callback that logs a message.

---

## HOW TO KILL A SERVER

You first have to find it with this:

```bash
netstat -ano | findstr :portnum
```

Then you find the PID then write it here

```bash
taskkill /PID PIDHere /F           # for terminal use
taskkill -PID PIDHere -F           # also works, short version
taskkill //PID PIDHere //F         # for GitBash Terminal
```

---

## ENDPOINTS

**/Endpoint** - where you want something to go.

In here you are targeting the root which is / equivalent to `localhost:3001/`

```js
app.get("/", (req, res) => {
  res.send("Hello, World");
});
```

you can do more like this. This would be `localhost:3001/about`

```js
app.get("/about", (req, res) => {
  res.send("Hello, World");
});
```

---

## POSTMAN

**HOW TO MAKE REQUEST.**

CLIENT to HTTP to DATABASE > SERVER > APPLICATION

### HTTP Response Status

Informational responses (100 -- 199)
Successful responses (200 -- 299)
Redirection messages (300 -- 399)
Client error responses (400 -- 499)
Server error responses (500 -- 599)

What if you wanna work on backend first so you can test it and pass it to frontend.

You can use **POSTMAN**.

### Postman Practice - Testing Different Routes

```js
app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.post("/register", (req, res) => {
  res.sendStatus(201); // 201 means resource was created
});

app.put("/user/angela", (req, res) => {
  res.sendStatus(200);
});

app.patch("/user/angela", (req, res) => {
  res.sendStatus(200);
});

app.delete("/user/angela", (req, res) => {
  res.sendStatus(200);
});
```

You are sending a DATA with POST.
Put will replace all of data in angela rather than just updating the outdated one. So you have to fetch data first, and have to put all updated info before PUT.
PATCH lets you change a single thing in the data.
DELETE will delete the data.

`sendStatus(code)` - sends just the HTTP status code as the response (e.g. 200, 201).
**PUT** replaces ALL data so you need to send everything. **PATCH** only updates what you specify.

---

## MIDDLEWARE

```
Server ---> Middleware ----> GET, PUT, POST, PATCH, DELETE
```

Middleware can be used for the following:

**preprocess the request** - middleware can change modify the request before it comes to final route.
**logging the request** - request time, what type of request, request status.
**Authentication** - it can check if the request came from client that is authorized.
**Identify Errors** - before it goes to the handler.

---

### Body-Parser

Example of middleware is **body-parser**
Body-parses is already in the Express Library.

which can be accessed like this:

```js
app.use(express.urlencoded({ extended: true }));
```

_Example of parse._

Action is the route that i want the server to handle. Method is how i want the data to be processed.

```html
<form action ="/login" method="POST">
    <label for="email">Email</label>
    <input type="text" name="email" required>
    <label for="password">Password</label>
    <input type="text" name="password" required>
    <input type="submit" value="Submit">
</form>
```

`label` is where we label the next input.
`input` has type and name which is what the user inputted. `required` means the input cannot be submitted if theres no data inputted.
`submit` type is typically a button.

Make a public folder in the project and thats where the static files likes HTML, CSS, Images, things that dont need to change.

#### Getting Root Directory

Getting the root directory (important for cloud projects, not just local):

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
```

converts the file URL to an actual directory path.

#### res.sendFile vs res.send

`res.send("text")` - sends text/HTML as the response.
`res.sendFile(__dirname + "/public/index.html")` - sends an actual file from the directory as the response.

```js
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  console.log(req.body);
});
```

`req.body` contains the data sent from the form (parsed by body-parser/urlencoded middleware).

---

## STATIC FILES MIDDLEWARE

EJS handles templates but NOT static assets like CSS, images, or client-side JS.
To serve those, you need `express.static` middleware.

```js
app.use(express.static("public"));
```

This tells Express: "anything in the public/ folder can be accessed directly by the browser."

```
project/
├── index.js
├── views/
│   └── index.ejs        ← templates (rendered by res.render)
└── public/
    ├── styles/
    │   └── main.css      ← static files (served directly)
    └── images/
        └── logo.png
```

Once you add this middleware, in your EJS you reference files relative to public/ (public/ becomes the root):

```html
<link rel="stylesheet" href="/styles/main.css">
<img src="/images/logo.png">
```

NOT `../public/styles/main.css` — that wont work because the browser doesnt know your folder structure. Express maps public/ to the root `/` so you just write `/styles/main.css`.

Without `express.static("public")`, Express wont serve ANY files from that folder. Your CSS, images, and scripts will all 404.

---

## MIDDLEWARE TYPES

**Pre-processing** = body-parsing(integrated in express.)
**Static Files** = express.static(integrated in express.)
**Auth**
**Logging** = morgan(package)
**Error**

---

## MORGAN

**Morgan** is used to log the route and get info like Get, or status code or OS or browser and many more.
It is used like this,

```js
import morgan from "morgan";
```

#### Predefined Log Formats

Like in the example above, you have five predefined formats that you can use in order to easily get the info you need. They are:

**"combined"**: which gives you the Apache standard combined format for your logs.
**"common"**: referencing the Apache standard common format.
**"dev"**: A color-coded (by request status) log format.
**"short"**: Shorter than the default format, including just the few items you'd expect a request logline would have.
**"tiny"**: Even shorter, just the response time and a few extra items.

#### How To Use The Log Formats

```js
import morgan from "morgan";
const app = express();

app.use(morgan("combined"));
```

| Format   | Remote Addr | User | Timestamp | Method/URL | Status | Size | Referrer | User Agent | Response Time |
|----------|-------------|------|-----------|------------|--------|------|----------|------------|---------------|
| combined | yes         | yes  | yes       | yes        | yes    | yes  | yes      | yes        | no            |
| common   | yes         | yes  | yes       | yes        | yes    | yes  | no       | no         | no            |
| dev      | no          | no   | no        | yes        | yes    | yes  | no       | no         | yes           |
| short    | yes         | no   | no        | yes        | yes    | yes  | no       | no         | yes           |
| tiny     | no          | no   | no        | yes        | yes    | yes  | no       | no         | yes           |

---

**combined** - Standard Apache combined log output.

```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
```

_will output_

```
::1 - - [27/Nov/2024:06:21:42 +0000] "GET /combined HTTP/1.1" 200 2 "-" "curl/8.7.1"
```

**common** - Standard Apache common log output.

```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
```

_will output_

```
::1 - - [27/Nov/2024:06:21:46 +0000] "GET /common HTTP/1.1" 200 2
```

**dev** - Concise output colored by response status for development use. The :status token will be colored green for success codes, red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for information codes.

```
:method :url :status :response-time ms - :res[content-length]
```

_will output_

```
GET /dev 200 0.224 ms - 2
```

**short** - Shorter than default, also including response time.

```
:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
```

_will output_

```
::1 - GET /short HTTP/1.1 200 2 - 0.283 ms
```

**tiny** - The minimal output.

```
:method :url :status :res[content-length] - :response-time ms
```

_will output_

```
GET /tiny 200 2 - 0.188 ms
```

---

## MIDDLEWARE ORDER MATTERS

Express runs middleware in the order you write them, top to bottom.

The proper structure is:

1. `app.use()` - global middleware (body-parser, morgan, auth, etc.)
2. `app.get() / app.post() / app.put() / app.patch() / app.delete()` - route handlers
3. `app.listen()` - always last, starts the server

_Example:_

```js
app.use(express.urlencoded({ extended: true })); // 1st - parse the body
app.use(morgan("tiny")); // 2nd - log the request
app.use(authMiddleware); // 3rd - check if user is allowed

app.get("/", (req, res) => { // 4th - handle the route
  res.send("Home");
});

app.listen(3000); // Last - start server
```

#### Why Order Matters

- Express processes middleware top to bottom using `next()`.
- If auth middleware is placed AFTER a route, that route runs without auth check = security risk.
- If body-parser is placed AFTER a POST route, `req.body` will be undefined because the body wasnt parsed yet.
- If morgan is placed AFTER routes, it wont log requests that were already handled.

Think of it like a checklist before the request reaches the route:
_parse body -> log it -> check auth -> THEN handle the route._

Morgan (logging) goes near the top, not the bottom.
Even though it tracks response time, it works by starting a timer when the request enters and stopping when the response is sent. So it needs to be placed early to catch everything.

---

## CUSTOM MIDDLEWARE

we use `app.use()` method to specify a middleware

```js
app.use((req, res, next) => {
  console.log("Request Method: " + req.method);
  next()
});
```

Inside the `app.use` we can pass a function that has req, res, and next.
The `next()` function determines when we should move on from the middleware into the next function.

This is how you make custom logger.
by making a function then console logging it.
then calling `next()` function to move on.

If you dont put the next function then the website will never reach the next code that is below.

```js
var logger = function(req, res, next){
  console.log("Request Method: " + req.method);
  console.log("Request URL: localhost:" + port + req.url);
  next()
}

app.use(logger);
```

---

## WHY MIDDLEWARE NEEDS 3 PARAMETERS (req, res, next)

Middleware functions always take 3 inputs: (req, res, next).
This is NOT just convention -- Express actually checks how many parameters your function has to know what it is.

- **2 params (req, res)** = route handler
- **3 params (req, res, next)** = middleware
- **4 params (err, req, res, next)** = error-handling middleware

#### What Each One Is For

**req** - the request object. Lets you read what the user sent (URL, method, body, headers, etc.)

**res** - the response object. Middleware sometimes needs to END the request early.
For example, if a user isnt authorized, the middleware can send back a 401 and stop the chain right there.

```js
function checkAuth(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send("Not allowed");
    return;
  }
  next();
}
```

stops here, never reaches the route if not authorized.

Without res, middleware couldnt reject requests, send errors, or redirect users.

**next** - a callback function that Express gives you. You didnt create it, Express did.
When you call `next()`, it tells Express "im done, pass the request to the next middleware or route."
If you dont call `next()`, the request hangs forever and eventually times out.

The key thing: next is a PARAMETER (input) because Express injects it into your function when it calls your middleware.
Express internally does something like: `yourMiddleware(req, res, functionThatRunsTheNextMiddleware);`
That third argument is a function Express built that knows which middleware comes next in the chain.

Think of middleware as a chain of checkpoints:

```
Request -> [Logger] -> [Auth Check] -> [Rate Limiter] -> [Route Handler] -> Response
```

At each checkpoint, the middleware can either:

1. Call `next()` - pass to the next checkpoint
2. Use `res` to respond - stop the chain, send something back

The 3 parameter signature is ONLY for middleware. Regular route handlers just use (req, res) since they are the end of the chain.
