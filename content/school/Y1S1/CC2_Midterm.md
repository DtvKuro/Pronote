# CC2 Fundamentals of Programming — Midterm

> Covers: Intro to Programming, Java Basic Syntax, Operators, User Input (Scanner), Problem-Solving Tools, Conditional Statements, Looping Statements, Parsing & ASCII.

---

## 1. Introduction to Computer Programming

**Computer programming** is the process of **designing, writing, testing, and maintaining** instructions (**code**) that a computer executes to perform specific tasks. Code is written in a **programming language** that both humans and machines can understand.

**Computer programmers** use logic and programming languages to write, revise, test, and update code.

**Real-life examples**

| Example | What the code does |
|---|---|
| ATM withdrawal | Checks PIN, verifies balance with the bank database, dispenses cash, prints receipt |
| Browsers & apps (Chrome, WhatsApp) | Sends network requests, renders text/media, processes taps and clicks |
| Traffic lights | Cycles colors using timers or sensors that detect cars |
| E-commerce checkout | Computes totals, taxes/discounts, authorizes cards, updates stock |

### The Computer System

A **computer system** is a programmable electronic device that **accepts input (data), processes it, and produces output** in the desired format. A computer is a **digital electronic machine** and **needs to be programmed**.

| Component | Meaning | Analogy |
|---|---|---|
| **Hardware** | **Physical** parts. If you can **touch** it, it's hardware. | Bones, muscles, organs |
| **Software** | **Instructions/programs** that tell hardware what to do. **Intangible**, can be updated without changing hardware. | The brain's instructions |

**Four functional units:** **Input Unit** → **CPU** → **Memory/Storage** → **Output Unit**

```
DATA  ──►  PROCESSING  ──►  INFORMATION
```

**Inside the system (lesson diagram)**

```
                 ┌──── Central Processing Unit (CPU) ────┐
                 │   Arithmetic Logic Unit (ALU) ─ Registers
                 │              Control Unit (CU)         │
                 └───────────────────┬────────────────────┘
                                     │ controls
 Input unit ──►  ┌──── Storage unit ─┴──┐  ──►  Output unit
                 │  Primary storage     │
                 │      ⇅               │
                 │  Secondary storage   │
                 └──────────────────────┘
```

| Part | Job |
|---|---|
| **ALU** | Does arithmetic and logic (comparisons) |
| **Registers** | Tiny, super-fast storage inside the CPU |
| **Control Unit** | Directs everything: input, output, and storage |
| **Primary storage** | Main memory (RAM), used while working |
| **Secondary storage** | Long-term storage (SSD, HDD) |

### Programming Languages

A programming language is the **middle man** between human ideas and machine execution. **High-level languages** let you use words like *read, write, add* instead of on/off switches.

| Level | Language | Key facts |
|---|---|---|
| **Low** | **Machine language** | Only **0s and 1s** (binary). Also called **machine code / object code**. **Executed directly by the CPU**. Can't be understood by humans in raw form. |
| **Low** | **Assembly language** | Uses **mnemonics** (ADD, SUB, MUL). Readable by humans. Needs an **assembler** to become machine code. |
| **High** | Java, Python, C++, JavaScript, Ruby | **Human-like syntax**, easier to read and write. Needs a **translator**. |

> **Low-level** = closer to the machine, faster, harder for humans.
> **High-level** = closer to English, easier, needs translation.

**Common languages and their uses**

| Language | Used for |
|---|---|
| **Python** | Data science, machine learning, AI, web development, automation, data analysis/visualization, game development |
| **Java** | **Android apps**, server-side apps, enterprise apps, web-based apps, big data, game development, IoT, cloud computing |
| **C++** | Game development, GUI apps, **operating systems**, database systems, embedded systems, networking, VR, computer vision |
| **JavaScript** | **Web development and apps**, server-side development, mobile apps, machine learning, IoT, automation, chatbots |
| **Swift** | **iOS and macOS apps**, deep learning, IoT, server-side development, machine learning, automation |
| **C#** | Game development, web development, **Windows apps**, backend services, IoT, robotics, cloud computing |

### Source Code vs Object Code

| Source Code | Object Code |
|---|---|
| Written by the programmer | Produced by a translator (compiler, etc.) |
| **Human-readable** (high-level language) | **Machine-readable** (binary) |
| Easy for humans to understand | Hard for humans to read; CPU executes it directly |

### Translators

**Translators** convert **source code** into **machine code** so the computer can run it.

| Translator | How it works | Examples |
|---|---|---|
| **Assembler** | Converts **assembly language** → machine code | — |
| **Compiler** | Translates the **entire** program **all at once** before running. Lists **all errors** at once. **Faster** than an interpreter but **harder to debug**. If there's an error, **no binary is created**. Produces an executable (e.g. `.exe`) | C, C++, Objective-C, Swift, Pascal |
| **Interpreter** | Translates and runs **line by line**. **Stops at the first error**. **Easier to debug**, but **slower** overall | Python, Ruby, JavaScript, Perl |
| **Hybrid** | Compiles the whole program into **bytecode**, then a runtime engine executes it line-by-line or block-by-block | **Java** (JVM) |

> **Own example:** A compiler is a translator who reads your **whole essay**, then hands back a full translation (or a list of every mistake). An interpreter is a **live interpreter** at a meeting: translates sentence by sentence and stops the moment something makes no sense.

### How Java Runs (Hybrid)

```
MyProgram.java  ──javac──►  MyProgram.class  ──JVM──►  Output
 (source code)   compile     (bytecode)       run
```

1. **Write** source code in a text editor or IDE (`.java`).
2. **Compile** with `javac`, which produces **bytecode** (`.class`). Bytecode is **not yet machine code**.
3. **Run** with `java`. The **JVM** interprets the bytecode line by line, or uses **JIT (Just-In-Time) compilation** to turn it into native machine code for speed.

> Java bytecode runs on **any computer that has a JVM**, which is why Java is **platform independent** ("write once, run anywhere").

**Phases of programming:** **Write → Compile → Run**

### History of Java

| Fact | Detail |
|---|---|
| Creator | **James Gosling**, early **1990s** |
| Original purpose | Language for **digital devices** (set-top boxes, TVs). C++ was considered but rejected |
| Project name | **Green Project** |
| First name | **Greentalk** (file extension **`.gt`**) |
| Second name | **Oak**, after an oak tree outside Gosling's office |
| Why renamed | "Oak" was already trademarked by **Oak Technologies** |
| Final name | **Java**, from a type of **espresso bean** (named over coffee) |
| Principles | Robust, Portable, Platform Independent, High Performance, Multithreaded |
| Award | One of the **Ten Best Products of 1995** by **TIME Magazine** |
| First public version | **Java 1.0 (1995)** |
| Ownership | **Sun Microsystems** was acquired by **Oracle in 2010** |
| Latest (as of Aug 2026) | **Java 26 (Java SE 26)** |

**Java** is a general-purpose, **class-based, object-oriented** language designed to have as few implementation dependencies as possible.

### JDK vs JRE vs JVM

| Term | What it is | Who needs it |
|---|---|---|
| **JDK** (Java Development Kit) | Everything to **develop** Java: **compiler**, tools, libraries, docs. **Includes the JRE** | Programmers who **write** Java |
| **JRE** (Java Runtime Environment) | Everything to **run** Java: **JVM** + libraries | Users who only **run** Java apps |
| **JVM** (Java Virtual Machine) | **Executes bytecode**. Platform independent. Manages memory and **garbage collection** | Inside the JRE |

```
┌──────────── JDK ────────────┐
│  compiler, tools            │
│  ┌──────── JRE ─────────┐   │
│  │  libraries           │   │
│  │  ┌────── JVM ─────┐  │   │
│  │  └────────────────┘  │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

> **Memory trick:** **D**evelop = J**D**K, **R**un = J**R**E, the **M**achine that executes = JV**M**.

### Errors and Debugging

**Debugging** is finding and fixing mistakes (bugs) that cause crashes, wrong results, or unexpected behavior.

| Error | Meaning | When detected | Example |
|---|---|---|---|
| **Syntax error** | Breaks the **rules/structure** of the language (misspelled keyword, missing `;`, missing bracket) | **Before** the program runs (compilation) | `System.out.println("Hi")` ← missing `;` |
| **Logical / Semantic error** | Syntax is correct but the **logic is wrong**, so the output is wrong | **While running** (or by noticing wrong results) | Using `-` instead of `+` when computing a total |

**Lesson examples**

```java
// SYNTAX ERROR: missing ");" so it won't compile
System.out.println("Hello, World!"
```

```java
// LOGICAL ERROR: compiles and runs, but the answer is wrong
int number = 10;
int result = number / 3;
System.out.println("The result is: " + result);   // prints 3, not 3.33
```

> **Own example:** "The cat drinked milk" is a **syntax** error (grammar). "The milk drank the cat" is a **logic** error: the grammar is fine, the meaning is wrong.

### IDE vs Text Editor

| Tool | Meaning | Examples |
|---|---|---|
| **IDE** (Integrated Development Environment) | A place to **write, run, and debug** code and convert it to machine code. Has **built-in error checking** and **autofill** | NetBeans, Eclipse, IntelliJ, Visual Studio |
| **Text Editor** | Software to create and edit **plain text** files, including source code. "The programmer's writing desk" | Notepad |

### Running Java from the Command Prompt

1. Install the JDK and add its `bin` folder to the **Path** environment variable.
2. Check the install: `java --version`
3. Go to your file's folder: `cd <folder>`
4. Compile: `javac FileName.java` (no message = success; creates `FileName.class`)
5. Run: `java FileName`

> The file must end in **`.java`**.

### Parts of a Java Program

```java
public class HelloWorld {                    // class name → file must be HelloWorld.java
    public static void main(String[] args) { // main() method → program starts here
        // Prints "Hello, World" in the terminal window.
        System.out.print("Hello, World");    // statement, ends with ; (terminator)
    }                                        // method body ends
}                                            // class body ends
```

**Class body** contains the **method body**, which contains the **statements**. Every statement ends with a **semicolon (`;`)**, the **terminator**.

---

## 2. Java Basic Syntax

### Basic Terminologies

| Term | Meaning | Example |
|---|---|---|
| **Class** | A **blueprint/template** that defines common properties and methods | Blueprint of a house; the `Human` class |
| **Object** | An **instance** of a class, the actual thing built from the blueprint | The actual house; Alice is an object of `Human` |
| **Method** | A **block of code** in a class that performs an action and can return a result | `main()`, `newMethod()` |
| **Parameter** | A **placeholder** in a method that says what information the method expects | `String word` in `newMethod(String word)` |

### Comments
Comments explain code and are **ignored by the compiler**. They can also disable code while testing.

| Type | Syntax | Use |
|---|---|---|
| **Single-line** | `// comment` | Until the end of the line |
| **Multi-line (block)** | `/* comment */` | Spans many lines |
| **Documentation (Javadoc)** | `/** comment */` | Used by the **javadoc** tool to generate documentation pages |

### Variables
**Variables** are **containers** that store data. The data stored is its **value**. You must **declare** a variable before using it.

### Data Types
A **data type** tells the computer:
1. **What kind** of data is stored (number, text, true/false, character)
2. **How much memory** to reserve
3. **What operations** are allowed (you can add two numbers, not two booleans)

#### Primitive Data Types ("value types")
Store the **actual value** directly. Simple, small, fixed size, fast.

**Whole numbers**

| Type | Size | Memory | Range |
|---|---|---|---|
| `byte` | 8 bits | 1 byte | −128 to 127 |
| `short` | 16 bits | 2 bytes | −32,768 to 32,767 |
| `int` | 32 bits | 4 bytes | −2,147,483,648 to 2,147,483,647 (**default** integer type) |
| `long` | 64 bits | 8 bytes | −9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |

> **1 byte = 8 bits.** More bits = more memory = bigger range.

**Decimal numbers**

| Type | Size | Precision | Note |
|---|---|---|---|
| `float` | 32 bits (4 bytes) | ~6–7 digits | Value must end in **`f` or `F`** → `2.5f` |
| `double` | 64 bits (8 bytes) | ~15–16 digits | **Default** decimal type, more accurate |

**Others**

| Type | Stores | Example |
|---|---|---|
| `boolean` | `true` or `false` only. Needed for if-statements and loops | `boolean isTall = true;` |
| `char` | **One** character in **single quotes** | `char grade = 'A';` |

#### Reference (Non-Primitive) Data Types
Store a **reference (memory address)** that points to where the data actually is, not the value itself.

| Type | Meaning | Example |
|---|---|---|
| `String` | A **sequence of characters**, written in **double quotes**. It's a **class**, not a primitive | `String name = "Pedro";` |
| **Array** | A collection of values of the **same type** in one variable. Indexes **start at 0** | `int[] nums = {10, 20, 30};` → `nums[0]` is 10 |

```
Primitive:   num1 → [ 50 ]      num2 → [ 50 ]      (each holds its own value)

Reference:   s1 ──┐
                  ├──►  "Pedro"                  (both point to the same object)
             s2 ──┘
```

> **Primitive vs Reference:** A primitive is the **item itself** in your hand. A reference is a **claim stub** that tells you where the item is stored.

> **Watch out:** `'A'` (single quotes) is a `char`. `"A"` (double quotes) is a `String`.

### Rules You Must Know

- **Source file name** must **exactly match the public class name** + `.java`. `public class Main` → `Main.java`
- Java is **case-sensitive**: `AB`, `Ab`, `aB`, `ab` are all different.
  `System.out.println("Hi");` ✓ but `system.out.println("Hi");` ✗ (lowercase `system`)
- **`main()`** is the **entry point**; the program starts here.

### Anatomy of the Main Method

```java
public static void main(String[] args) {
    System.out.println("Hello World!");
}
```

| Part | Meaning |
|---|---|
| `public` | **Access modifier**: controls visibility (anyone can access) |
| `static` | Lets `main()` run **without creating an object** of the class |
| `void` | The method **returns no value** |
| `main` | The method name, the program's **starting point** |
| `String[] args` | The **parameter**: an array of Strings |
| `System` | A **built-in class** |
| `out` | A **static member** of System, a `PrintStream` object used for output |
| `println()` | Prints text, then moves to a **new line** |
| `.` (dots) | Separate classes, objects, and methods |

**Creating your own method**

```java
public static void newMethod(String word) {
    // method body
}
```
`public` = access modifier · `static` = non-access modifier · `void` = return type · `newMethod` = identifier · `String word` = parameter · `{ }` = opening/closing braces

### Identifiers
**Identifiers** are the **names** you give to variables, classes, methods, packages, etc.

- Can **begin with** a **letter**, **currency symbol (`$`)**, or **underscore (`_`)**.
- After the first character: letters, **digits**, `$`, `_`.
- **Cannot start with a digit** (`2name` ✗).
- **Case-sensitive**.
- **Cannot be a keyword** (reserved word).
- Underscore is **not recommended** for variable names; convention is a **lowercase** first letter.

**Camel casing:** start lowercase, capitalize each next word, like a camel's hump: `myAge`, `firstName`, `isTall`, `favLetter`

| Valid | Invalid | Why invalid |
|---|---|---|
| `studentName` | `student name` | Space |
| `_count` | `2ndPlace` | Starts with a digit |
| `$price` | `class` | Keyword |
| `total2` | `my-age` | `-` not allowed |

### Java Keywords (reserved; can't be identifiers)

`abstract` `assert` `boolean` `break` `byte` `case` `catch` `char` `class` `const` `continue` `default` `do` `double` `else` `enum` `extends` `final` `finally` `float` `for` `goto` `if` `implements` `import` `instanceof` `int` `interface` `long` `native` `new` `package` `private` `protected` `public` `return` `short` `static` `strictfp` `super` `switch` `synchronized` `this` `throw` `throws` `transient` `try` `void` `volatile` `while`

### Declaration & Assignment

```java
// Declaration:        datatype identifier;
int age;
int a, b, c;

// Assignment:         identifier = value;
age = 18;

// Combined:           datatype identifier = value;
int numberSeen = 0, increment = 5;
double height = 12.34, prize = 7.3 + increment;
char answer = 'y';
```

In an assignment, the **right side is evaluated first**, then stored in the variable on the left.

**Literal examples from the lesson:**
```java
long transactionID = 81475245L;   // long ends with L
float grades = 2.5f;              // float ends with f
double prices = 845.25;
boolean isDead = false;
char gender = 'F';
String firstName = "John";
```

### Concatenation
Joining strings with **`+`** (the **concatenation operator**).

```java
String name = "Pedro";
System.out.println("Hello, " + name + " long time no see");
// Output: Hello, Pedro long time no see
```

> **Own example (trap):** `System.out.println("Sum: " + 5 + 3);` prints **`Sum: 53`**, because once a String appears, `+` glues text. Use `"Sum: " + (5 + 3)` to get `Sum: 8`.

### `print()` vs `println()`

| `println()` | `print()` |
|---|---|
| Prints, then moves to a **new line** (adds `\n`) | Prints and **stays on the same line** |

```java
System.out.println("Hello PLVWorld");
System.out.println("Thank you for Warm Welcome");
// Hello PLVWorld
// Thank you for Warm Welcome

System.out.print("Hello PLVWorld,");
System.out.print(" Thank you for Warm Welcome");
// Hello PLVWorld, Thank you for Warm Welcome
```

---

## 3. Java Operators

**Operators** are symbols that perform actions on variables and values.

**Types:** Arithmetic, Assignment, Relational, Logical, Unary, Bitwise, Ternary

### Arithmetic Operators

| Operator | Meaning | `10 ? 3` |
|---|---|---|
| `+` | Add | 13 |
| `-` | Subtract | 7 |
| `*` | Multiply | 30 |
| `/` | Divide | **3** (int ÷ int drops the decimal) |
| `%` | Modulus (**remainder**) | **1** |

> **Own examples:** `10 / 4` = **2** (int), but `10.0 / 4` = **2.5**.
> `%` is how you check even/odd: `n % 2 == 0` → even.

**Machine problem example:** 3 notebooks at ₱45 and 2 pens at ₱15
```java
int total = (3 * 45) + (2 * 15);   // 135 + 30
System.out.println("Total: " + total);   // Total: 165
```

### Assignment Operators

| Operator | Meaning | Same as |
|---|---|---|
| `=` | Assign | `x = 5` |
| `+=` | Add and assign | `x = x + 5` |
| `-=` | Subtract and assign | `x = x - 5` |
| `*=` | Multiply and assign | `x = x * 5` |
| `/=` | Divide and assign | `x = x / 5` |
| `%=` | Modulus and assign | `x = x % 5` |

```java
int num = 10;
num += 5;   // 15
num -= 3;   // 12
num *= 2;   // 24
num /= 4;   // 6
num %= 4;   // 2
```

### Relational (Comparison) Operators
Compare two values; the result is always a **boolean** (`true`/`false`). Used in conditions.

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `==` | Equal to | `5 == 5` | true |
| `!=` | Not equal to | `5 != 3` | true |
| `>` | Greater than | `7 > 2` | true |
| `<` | Less than | `4 < 10` | true |
| `>=` | Greater than or equal | `6 >= 6` | true |
| `<=` | Less than or equal | `3 <= 5` | true |

> **Trap:** `=` **assigns**, `==` **compares**.

```java
int michaelAge = 34, jordanAge = 30;
boolean whoIsOlder = michaelAge > jordanAge;
System.out.print("Is michael older than jordan? " + whoIsOlder);  // true
```

### Logical Operators
Combine or reverse conditions. Result is always boolean.

| Operator | Name | Rule |
|---|---|---|
| `&&` | AND | true **only if both** are true |
| `\|\|` | OR | true if **at least one** is true |
| `!` | NOT | **reverses** the value |

**Truth tables**

| A | B | A && B | A \|\| B |
|---|---|---|---|
| T | T | **T** | T |
| T | F | F | T |
| F | T | F | T |
| F | F | F | **F** |

| A | !A |
|---|---|
| T | F |
| F | T |

> **Memory trick:** **AND is strict** (everyone must agree). **OR is chill** (one yes is enough).

```java
int numOne = 15, numTwo = 30, numThree = 45;
boolean boolOne = (numOne > numTwo) && (numTwo == numThree);
//              = (15 > 30) && (30 == 45)
//              = false && false
//              = false
```

> **Own example:** You can go out if `(homeworkDone && !raining)`. Homework done but it's raining → `true && false` → **false**, you stay home.

### Unary Operators
Work on **one** operand.

| Operator | Name | Meaning |
|---|---|---|
| `+` | Unary plus | Positive value |
| `-` | Unary minus | Negates (changes sign) |
| `++` | Increment | Adds 1 |
| `--` | Decrement | Subtracts 1 |
| `!` | Logical complement | Reverses a boolean |

### Bitwise Operators
Work on the **binary bits** of integers (`byte`, `short`, `int`, `long`).

| Operator | Name | Rule |
|---|---|---|
| `&` | AND | 1 if **both** bits are 1 |
| `\|` | OR | 1 if **at least one** bit is 1 |
| `^` | XOR | 1 if the bits are **different** |

> **Own example:** `5 & 3` → `0101 & 0011` = `0001` = **1**; `5 | 3` = `0111` = **7**; `5 ^ 3` = `0110` = **6**

### Ternary Operator (`? :`)
A **one-line if-else** that takes **three operands**.

```
datatype identifier = condition ? valueIfTrue : valueIfFalse;
```
```java
String result = (age >= 18) ? "Adult" : "Minor";
```
1. The condition is checked.
2. If **true**, returns the first value.
3. If **false**, returns the second value.

---

## 4. Java User Input (Scanner Class)

**User input** is data entered **while the program is running**, instead of hardcoding values. The most common way is the **Scanner class** from the **`java.util` package**.

**Three steps**
```java
import java.util.Scanner;                    // 1. Import
Scanner input = new Scanner(System.in);      // 2. Create a Scanner object (reads from keyboard)
int age = input.nextInt();                   // 3. Read input
```

| Method | Reads |
|---|---|
| `nextInt()` | An **integer** |
| `nextDouble()` | A **decimal** number |
| `nextLine()` | A **whole line** of text, **including spaces** |
| `next()` | A **single word** (stops at a space) |
| `nextBoolean()` | `true` / `false` |

```java
import java.util.Scanner;

public class UserInputExample {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.print("Enter your age: ");
        int age = input.nextInt();

        System.out.println("Hello " + name + ", you are " + age + " years old.");
    }
}
```

> **Own example:** Typing `Juan Dela Cruz`: `nextLine()` gets **Juan Dela Cruz**, `next()` gets only **Juan**.

### Pitfall: `nextLine()` after `nextInt()` / `nextDouble()` / `next()`
After you type a number and press **Enter**, `nextInt()` takes the number but **leaves the Enter** behind. The next `nextLine()` grabs that leftover Enter, so the string input is **skipped**.

**Fix:** add an **extra `nextLine()`** to consume the leftover Enter.

```java
System.out.print("Enter any number: ");
int number = scanner.nextInt();
scanner.nextLine();                 // consumes the leftover Enter key
System.out.print("Enter any word: ");
String word = scanner.nextLine();
```

---

## 5. Problem-Solving Tools in Programming

**Program design tools** are used to **plan the logic before coding**. They catch errors early, save time, and keep steps in the right order.

| Tool | Meaning |
|---|---|
| **Algorithm** | A **written step-by-step procedure** in plain English, like a **recipe**. Says *what to do and in what order*, without caring about the language yet |
| **Pseudocode** | Plain English **mixed with code-like structure**. Also called **"false code."** A **bridge** between algorithm and real code. Uses keywords like `START`, `END`, `INPUT`, `OUTPUT`, `IF`, `WHILE`, `DECLARE`, `DISPLAY` |
| **Flowchart** | A **graphical** representation using **shapes and arrows** to show the flow of steps |

> **Remember:** There is **no single correct algorithm**. Different steps are fine as long as the **logic is correct** and it **produces the right output**.

**Why flowcharts help:** logic is easy to see at a glance, the sequence is clear, non-programmers can understand them, and missing steps are easy to spot before coding.

### Flowchart Symbols

| Symbol | Shape | Use |
|---|---|---|
| **Terminal** | **Oval / rounded rectangle** | **Start** or **End** |
| **Process** | **Rectangle** | A step or calculation (`sum = a + b`) |
| **Input/Output** | **Parallelogram** | Entering data (**Input**) or showing results (**Display**) |
| **Decision** | **Diamond** | A **yes/no (true/false)** question; branches out |
| **Connector** | **Circle** | Continues the flow where a **matching labeled** circle is |
| **Flow lines** | **Arrows** | Show the **direction** of the program |

### Worked Example: Add Two Numbers

**Algorithm**
1. Start.
2. Declare three variables: numOne, numTwo, and sum.
3. Assign or input values to numOne and numTwo.
4. Add numOne and numTwo.
5. Store the result in sum.
6. Display sum.
7. End.

**Pseudocode**
```
START
    DECLARE numOne, numTwo, sum
    INPUT numOne
    INPUT numTwo
    sum ← numOne + numTwo
    DISPLAY sum
END
```

**Flowchart**
```
(Start) → [numOne = 0, numTwo = 0, sum = 0] → /Input numOne, numTwo/
        → [sum = numOne + numTwo] → /Display sum/ → (End)
```
`( )` terminal · `[ ]` process · `/ /` input/output

### Worked Example: Meters to Centimeters (12 m, cm = m × 100)

**Pseudocode**
```
START
    DECLARE meters, centimeters
    INITIALIZE meters ← 12
    centimeters ← meters * 100
    DISPLAY centimeters
END
```
Output: **1200**

---

## 6. Java Flow of Control

**Control structures** decide the **flow of execution** in a program. There are **three**:

| Structure | Meaning |
|---|---|
| **Sequence** | Steps run **one after another**, in order, with **no branching or skipping** |
| **Selection** (decision) | Uses a **condition** to **choose a path** (if, switch) |
| **Iteration** (looping) | **Repeats** statements **as long as a condition is true** (while, do-while, for) |

---

## 7. Selection / Conditional Statements

Conditional statements decide **which code runs and which is skipped**. Java's two main selection statements are **`if`** and **`switch`**.

Common forms: **if**, **if-else**, **if-else-if ladder**, **nested if**, **switch**

### `if` Statement
Runs the block **only if** the condition is true. If false, **nothing happens**.

```java
if (condition) {
    // runs if true
}
```
```java
if (age >= 18) {
    System.out.println("You are allowed to vote.");
}
```

> Any expression that gives `true`/`false` can be a condition, including a boolean variable or a method returning a boolean.

### `if-else` Statement
Chooses between **two** actions.

```java
if (condition) {
    // runs if true
} else {
    // runs if false
}
```
```java
if (number % 2 == 0) {
    System.out.println("The number is even.");
} else {
    System.out.println("The number is odd.");
}
```

**Pass/fail example (average ≥ 75)**
```java
average = (grade1 + grade2 + grade3) / 3;
if (average >= 75) {
    System.out.println("Status: PASSED");
} else {
    System.out.println("Status: FAILED");
}
System.out.printf("Average Grade: %.2f%n", average);
```

> `printf("%.2f", x)` prints `x` with **2 decimal places**.

**Discount example (10% off if total ≥ ₱1,000)**
```java
double price, totalAmount = 0, discount = 0, finalAmount = 0;
int quantity;
// ... read price and quantity ...
totalAmount = price * quantity;

if (totalAmount >= 1000) {
    discount = totalAmount * 0.10;
    finalAmount = totalAmount - discount;
} else {
    finalAmount = totalAmount;
}
```
> Initializing to `0` gives variables a **starting/default value** before they're used.

A block can hold **multiple statements** inside `{ }`.

### `if-else-if` Ladder
Checks **many conditions top to bottom**. The **first true** one runs, and the **rest are skipped**. `else` runs if none are true.

```java
if (condition1) {
    // block 1
} else if (condition2) {
    // block 2
} else if (condition3) {
    // block 3
} else {
    // none were true
}
```
```java
if (grade >= 90 && grade <= 100) {
    System.out.println("Excellent!");
} else if (grade >= 80 && grade <= 89) {
    System.out.println("Very Good!");
} else if (grade >= 75 && grade <= 79) {
    System.out.println("Good!");
} else if (grade >= 0 && grade < 75) {
    System.out.println("Failed.");
} else {
    System.out.println("Invalid grade. Please enter a number between 0 and 100.");
}
```

**Multi-branch decision making** means choosing from several outcomes. It's commonly done with if-else-if or nested if-else, and is treated almost like its own statement type.

### Nested `if`
An `if` **inside another `if` or `else`**. The **inner** if only runs if the **outer** condition is true.

> **Rule:** an `else` belongs to the **nearest `if`** in the same block that doesn't already have an `else`.

```java
if (grade < 0 || grade > 100) {
    System.out.println("Invalid grade.");
} else {
    if (grade >= 75) {
        if (grade >= 90) {
            System.out.println("Excellent!");
        } else {
            System.out.println("Passed.");
        }
    } else {
        if (grade >= 50) {
            System.out.println("Needs Improvement.");
        } else {
            System.out.println("Failed badly.");
        }
    }
}
```

> **Own example:** Grade 82 → not invalid → 82 ≥ 75 ✓ → 82 ≥ 90 ✗ → **"Passed."**

### Comparing Strings
- For **primitives**, use `==`.
- For **Strings (objects)**, `==` checks if both point to the **same memory location**, not the same text. **Use `equals()` instead.**

| Method | Does |
|---|---|
| `equals()` | Compares text, **case-sensitive** |
| `equalsIgnoreCase()` | Compares text, **ignores case** |
| `contains()` | Checks if a string **contains** a substring |
| `charAt(index)` | Gets **one character** at a position (starts at 0) |

```java
if (color.equalsIgnoreCase("Red")) {          // "red", "RED", "Red" all match
    System.out.println("Stop!");
} else {
    System.out.println("Color not defined");
}

if (name.contains("John")) {
    System.out.println("So, you are also a John!");
}
```

> **Own example:** `"Hello".equals("hello")` → **false**; `"Hello".equalsIgnoreCase("hello")` → **true**; `"Hello".charAt(1)` → **'e'**

### `switch` Statement
Compares **one variable** against a list of **specific constant values** (int, byte, short, char, String, enum).

**Four keywords**

| Keyword | Role |
|---|---|
| `switch` | Starts the structure, followed by the test expression in `( )` |
| `case` | A possible value, followed by a **colon** `:` |
| `break` | **Ends** the switch so it doesn't continue to the next cases |
| `default` | Runs if **no case matches** (like `else`) |

```java
switch (day) {
    case 1:
        System.out.println("It's Monday!");
        break;
    case 2:
        System.out.println("It's Tuesday!");
        break;
    // ... cases 3 to 7 ...
    default:
        System.out.println("Invalid");
        break;
}
```

**With a char (reading one letter via `charAt(0)`)**
```java
char grade = input.next().charAt(0);
switch (grade) {
    case 'A': System.out.println("Excellent!"); break;
    case 'B': System.out.println("Very Good!"); break;
    case 'C': System.out.println("Good!"); break;
    case 'D': System.out.println("Needs Improvement."); break;
    case 'F': System.out.println("Failed."); break;
    default:  System.out.println("Invalid Grade.");
}
```

**Important rules**
- A switch checks **equality only**. You **can't** use `>`, `<`, etc. in cases.
- Case values must be **unique constants** (literals, not variables). **No duplicates**.
- Without `break`, execution **falls through** into the following cases. This is called **fall-through**.
- Fall-through can be **useful** when several cases share the same code.
- `default` can be placed **anywhere**, but it's usually last.
- An inner switch and outer switch **can** share case values.

> **Own example (fall-through):**
> ```java
> int n = 2;
> switch (n) {
>     case 1: System.out.println("One");
>     case 2: System.out.println("Two");
>     case 3: System.out.println("Three");
> }
> ```
> Output: **Two** and **Three**, since there's no `break`, so it keeps going after case 2.

### Rule Switch (Java 12+)
A newer, shorter switch. It uses **arrows (`->`)** instead of `case ...:`, allows **several values in one case** (separated by commas), and needs **no `break`** (no fall-through).

```java
switch (expression) {
    case value1, value2 -> {
        // code for value1 or value2
    }
    case value3, value4 -> {
        // code for value3 or value4
    }
    default -> {
        // default code
    }
}
```

**Traditional vs rule switch: vowel or consonant**
```java
// Traditional: stacked cases + break
switch (letter) {
    case 'A': case 'E': case 'I': case 'O': case 'U': case 'Y':
    case 'a': case 'e': case 'i': case 'o': case 'u': case 'y':
        System.out.println("It's a VOWEL!"); break;
    default:
        System.out.println("It's a CONSONANT");
}

// Rule switch: one line, no break
switch (letter) {
    case 'A', 'E', 'I', 'O', 'U', 'Y', 'a', 'e', 'i', 'o', 'u', 'y' ->
        System.out.println("It's a VOWEL!");
    default -> System.out.println("It's a CONSONANT");
}
```

### Shorthand If-Else (Ternary)
```java
String checkAge = (age >= 18 && age <= 100) ? "You are in legal age" : "You are a minor";

String result = color.equalsIgnoreCase("Red") ? "Stop!" : "Color not defined";
```

---

## 8. Increment and Decrement Operators

| Operator | Name | Rule |
|---|---|---|
| `++x` | **Pre-increment** | **Increment first**, then use |
| `x++` | **Post-increment** | **Use first**, then increment |
| `--x` | **Pre-decrement** | **Decrement first**, then use |
| `x--` | **Post-decrement** | **Use first**, then decrement |

```java
int x = 5;  int y = ++x;   // x = 6, y = 6
int a = 5;  int b = a++;   // b = 5, a = 6
int p = 5;  int q = --p;   // p = 4, q = 4
int m = 5;  int n = m--;   // n = 5, m = 4
```

> **Memory trick:** Read it left to right. `++x`: the `++` comes **first**, so it adds first. `x++`: `x` comes first, so you **use x first**.

---

## 9. Looping (Iteration) Statements

**Loops** repeat a block of statements (the **loop body**) **as long as a boolean condition is true**. When it becomes **false**, the loop **terminates** and the program moves on.

**Iteration** = one complete run of the loop body.

### Three Types of Loops

| Loop | Condition checked | Runs at least once? | Best for |
|---|---|---|---|
| **while** | **Before** the body (first) | **No**, may run 0 times | Unknown number of repetitions |
| **do-while** | **After** the body (last) | **Yes, always at least once** | When the body must run once first (menus, input prompts) |
| **for** | Before each iteration | No | **Known** number of repetitions (**counter-controlled**) |

### `while` Loop
```java
while (condition) {
    // body
}
```
```java
int i = 1;                          // starting point
while (i <= 5) {
    System.out.println("Count: " + i);
    i++;                            // increment to avoid infinite loop
}
// Count: 1 ... Count: 5
```

### `do-while` Loop
```java
do {
    // body
} while (condition);   // note the semicolon
```
```java
int i = 1;
do {
    System.out.println(i);
    i++;
} while (i <= 5);
```

> **Own example:** If `i = 10`, `while (i <= 5)` prints **nothing**, but `do { ... } while (i <= 5)` prints **10** once.

### `for` Loop
```java
for (initialization; condition; update) {
    // body
}
```
| Part | Role | Example |
|---|---|---|
| **Initialization** | Sets the starting value of the loop control variable | `int i = 1` |
| **Condition** | Checked **before each** iteration; loop continues while true | `i <= 5` |
| **Update** | Changes the variable **after each** iteration | `i++` |

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Count: " + i);
}
```

**Order:** initialize → check condition → run body → update → check condition → …

> **Own example (countdown):**
> ```java
> for (int i = 10; i >= 1; i--) {
>     System.out.print(i + " ");
> }
> System.out.println("Liftoff!");
> // 10 9 8 7 6 5 4 3 2 1 Liftoff!
> ```

### Loops by How Many Times They Repeat

| Type | Meaning |
|---|---|
| **Definite (count-controlled)** | Runs a **known, fixed** number of times. Most common: **for loop** (while/do-while can also be definite with a counter) |
| **Indefinite** | Runs **until a condition changes** (e.g. until the user types "exit"). Number of repetitions isn't known in advance |
| **Infinite** | **Never stops** on its own; the condition is always true. Sometimes intentional (servers, monitoring), but usually a **bug** that freezes programs or eats resources |

> **Own example:** `while (true) { }` is infinite. Forgetting `i++` in a while loop also makes it infinite.

### Nested Loops
A loop **inside** another loop. For **each** iteration of the outer loop, the inner loop runs **completely**.

```java
while (condition1) {          // outer loop
    // statements for outer loop
    while (condition2) {      // inner loop
        // statements for inner loop
    }
}
```

> **Own example:**
> ```java
> for (int row = 1; row <= 3; row++) {
>     for (int col = 1; col <= row; col++) {
>         System.out.print("*");
>     }
>     System.out.println();
> }
> // *
> // **
> // ***
> ```

**Sample tasks from the lesson:** factorial of a number (5! = 120), the first *n* Fibonacci numbers (0 1 1 2 3 5 8 13 21 34), even numbers 2–20, multiplication table of 2, and a menu that repeats until the user chooses Exit.

> **Own example (factorial):**
> ```java
> int factorial = 1;
> for (int i = 1; i <= number; i++) {
>     factorial *= i;
> }
> // number = 5 → 1×2×3×4×5 = 120
> ```

---

## 10. Java Parsing Methods

**Parsing** means **converting a String** into another data type (int, double, boolean). This is useful because **user input often comes in as a String**.

| Method | Converts String → |
|---|---|
| `Integer.parseInt(s)` | `int` |
| `Double.parseDouble(s)` | `double` |
| `Float.parseFloat(s)` | `float` |
| `Boolean.parseBoolean(s)` | `boolean` |

```java
String str = "50";
String str1 = "50";
int num = Integer.parseInt(str);
int num1 = Integer.parseInt(str1);
int result = num + num1;
System.out.println(result);        // 100 (not "5050")

boolean flag = Boolean.parseBoolean("true");   // true
```

---

## 11. ASCII

**ASCII** (**American Standard Code for Information Interchange**) represents characters as **numbers** so computers can store and process text.

- Standard ASCII: **128** characters, numbered **0–127**
- **Extended ASCII**: adds **128–255** (special symbols, accented letters)
- Java stores characters as **Unicode**, which matches ASCII for standard characters.

**Char → ASCII:** cast to `int`
```java
char c = 'A';
int ascii = (int) c;       // 65
```

**ASCII → Char:** cast to `char`
```java
int ascii = 65;
char c = (char) ascii;     // 'A'
```

> **Handy values:** `'A'` = **65**, `'a'` = **97**, `'0'` = **48**, space = **32**.
> Lowercase is uppercase **+ 32** → `(char)('A' + 32)` = `'a'`

---

## Quick Check

1. What does the JVM execute?
2. Compiler vs interpreter: which stops at the first error?
3. What was Java's name before "Java," and why was it changed?
4. What is the output of `System.out.println(17 % 5);`?
5. What is the output of `System.out.println(7 / 2);`?
6. `int x = 3; int y = x++ + 2;` What are x and y?
7. `(5 > 3) || (2 > 8)` → ?
8. Which flowchart symbol represents a decision?
9. Why should you use `equals()` instead of `==` for Strings?
10. What happens in a switch when you forget `break`?
11. Which loop always runs at least once?
12. What are the three parts inside a for loop's parentheses?
13. `Integer.parseInt("12") + Integer.parseInt("8")` → ?
14. `(char) 66` → ?
15. Which is a valid identifier: `2total`, `total-2`, `total_2`, `int`?

<details>
<summary>Answers</summary>

1. Bytecode (`.class` files)
2. Interpreter
3. Oak (before that, Greentalk). Oak was already trademarked by Oak Technologies.
4. **2**
5. **3** (int division drops the decimal)
6. y = 3 + 2 = **5** (post-increment uses 3 first), x = **4**
7. **true** (OR needs only one true)
8. Diamond
9. `==` compares memory locations; `equals()` compares the actual text
10. **Fall-through**: it continues into the following cases
11. do-while
12. Initialization; condition; update
13. **20**
14. **'B'**
15. `total_2`

</details>
