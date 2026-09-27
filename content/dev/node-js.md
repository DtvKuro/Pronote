## INTRODUCTION TO NODE.JS

**Framework** is commonly use components.

Reuse components. Reduce overhead.

Node is not quite a framework.

_"An aynchronous event-driven Javascript runtime, Node.js is designed to build scalable network applications."_ - Node.js

**runtime environment** - allows Js to be used for different types of technology and be run in a desktop
**asynchronus event-driven** - doesnt have to be run top to bottom. And can only happen if the trigger is pulled.

**Node.js** - used because it allows user to build an application on computer using Javascript.
and also used because it allows developer to use Js all across the frontend and backend.
Js fullstack, Scalar, Fast, Non-blocking, Huge community.

---

## NODE REPL

### Read Eval Print Loop

computer environment where user inputs are read and evaluated, and then the results are returned to the user.

can be initialised by using the command _"node"_ in the terminal.

_ctrl + c_ - if you want to stop anything running in terminal or you wanna leave everything running in terminal.

**Native Modules** = commands prebundled with nodejs

**file system** = allows js to be more than just browser by allowing node to access files from your server/pc.

---

## NPM

### Node Package Manager

manages the packages/dependencies your project needs.

```bash
npm init             # initialises a new project and creates a package.json by asking you questions.
npm init -y          # initialises with all default values (skips the questions).
```

```bash
npm i <package-name>              # installs a package and adds it to dependencies (e.g. "npm i express").
npm install <package-name>        # same as above, "install" is the full word for "i".
npm i                             # installs all packages listed in package.json (use after cloning a project).
npm i <package-name> -D           # installs a package as a dev dependency (only needed during development).
npm i <package-name>@<version>    # installs a specific version (e.g. "npm i express@4.18.2").
npm i -g <package-name>           # installs a package globally (available system-wide, not just this project).
```

```bash
npm uninstall <package-name>      # removes a package and takes it out of package.json.
npm un <package-name>             # shorthand for uninstall.
npm uninstall -g <package-name>   # removes a globally installed package.
```
