# CC1 Introduction to Computing — Midterm

> Covers: Lesson 1 Intro to Computers (IPOS, components, generations, categories, software) · Lesson 2 Hardware: Input Devices, Keyboard Fundamentals, Output Devices, Storage Devices, Types of Computers.

---

## 1. Why Be Computer Literate?

Computers are everywhere: workplaces (letters, memos, payroll, inventory, invoices), banks (**ATMs**), homes, schools, hospitals, stores, airports, research centers. Since most routine activities now run on computers, **everyone needs basic computer knowledge**.

---

## 2. What Is a Computer?

A **computer** is an **electronic device** that **accepts data (input)**, **processes** it according to **instructions**, **produces information (output)**, and **stores** the results for future use.

It's not just a calculator: it performs **arithmetic and logical** operations on data.

### Data vs Information

| Data | Information |
|---|---|
| **Unorganized** raw facts: words, numbers, images, sounds | Data that is **organized, meaningful, and useful** |
| e.g. scores 85, 90, 78 | e.g. a report card showing an average of 84.3 |

Other examples of information: reports, newsletters, receipts, pictures, invoices, checks.

> **Memory trick:** **D**ata = **D**isorganized. **I**nformation = **I**mportant (it has meaning).

### The Information Processing Cycle (IPOS)

```
        INPUT  ──►  PROCESS  ──►  OUTPUT
                       ⇅
                    STORAGE
```

| Stage | Meaning |
|---|---|
| **Input** | **Data and instructions** entered into the computer |
| **Process** | The computer **manipulates data** according to software instructions |
| **Output** | **Processed results** shown to users or sent to another system |
| **Storage** | Data, programs, and results **saved for future use** |

**IPOS in action (lesson examples)**

| Pathway | Input | Process | Output | Storage |
|---|---|---|---|---|
| **Grade calculator** | Teacher types student scores | Software computes totals, averages, final grades | Final grade appears on the monitor | Grade record saved to the school database |
| **Document workflow** | Student **scans** a paper page | Software edits and converts it to **PDF** | PDF sent to a **printer** | File saved to an **SSD** |

> **Own example (GCash):** You type ₱100 and a number (**input**) → app checks balance and deducts (**process**) → "Sent!" appears (**output**) → transaction saved in history (**storage**).

---

## 3. Components of a Computer (The Computing Ecosystem)

| Layer | Meaning |
|---|---|
| **Peopleware** | The **users, managers, and developers** who operate and maintain the technology |
| **Data & Procedures** | The raw facts and the **rules** used to accomplish tasks |
| **Software** | **System programs (OS)** and **application programs** that give instructions |
| **Hardware** | The **physical, touchable** electronic parts and peripherals |

> **Hardware cannot act without software.**

| Hardware | Software |
|---|---|
| **Physical** parts you can **see and touch** | **Programs**, OS, and data in memory/storage |
| Keyboard, monitor, DVD | Java, Microsoft Office, OpenOffice |

---

## 4. The Five Generations of Computers

**Trend:** physical size and heat **decrease** while processing power **increases** (inverse relationship).

| Generation | Technology | Key facts |
|---|---|---|
| **1st** (1940s–50s) | **Vacuum tubes** | Massive, expensive, high heat, frequent maintenance (**ENIAC, UNIVAC I**) |
| **2nd** (late 50s–60s) | **Transistors** | Replaced tubes; smaller, faster, energy-efficient; rise of **high-level programming** |
| **3rd** (1960s–early 70s) | **Integrated Circuits (ICs)** | Many components on one chip; rise of **OS and time-sharing** |
| **4th** (1970s+) | **Microprocessors** | CPU on a **single chip**; era of **PCs, GUIs, networking** |
| **5th** (modern/future) | **AI & advanced computing** | Machine learning, NLP, GPUs, cloud, massive data |

> **Mnemonic:** **V**ery **T**iny **I**nsects **M**ake **A**nts = Vacuum tubes, Transistors, ICs, Microprocessors, AI

**Before electronics (Gears to Relays):** **Abacus** (ancient counting) → **Pascaline** (17th c., mechanical calculator) → **Analytical Engine** (Babbage's general-purpose mechanical computer) → **Punch cards** (mechanical data and instructions) → **Electromechanical** (physical switches and relays). Electronics then replaced moving parts, making computers much faster and more reliable.

---

## 5. Classifications of Hardware

1. **Peripheral devices**: any **external/auxiliary** device that provides input and output (mouse, keyboard, expansion cards, graphics cards, scanners, tape drives, microphones, speakers, webcams, digital cameras)
2. **Central Processing Unit (CPU)**: the **brain**
3. **Mass storage system / memory**

**Peripheral devices include:** **Input**, **Output**, **Storage**, and **Communication** devices.

### System Unit
A **box-like case** (metal or plastic) that houses the computer's electronic circuitry. The circuitry is on the **motherboard**.

| Part | Role |
|---|---|
| **Motherboard** ("the nervous system") | Main circuit board connecting all components |
| **CPU & Memory** ("the brain & short-term memory") | Chips housed on the motherboard |
| **Power Supply Unit / PSU** ("the heart") | Converts electrical power into the voltages the machine needs |
| **Cooling system** (fans/heat sinks) | Removes heat, keeps the system stable |
| **Ports/connectors** | Interfaces for external peripherals |
| **Storage drives** | Data retention |

> In laptops and phones, these same parts are **miniaturized** into one compact chassis.

**Two main components on the motherboard:** the **CPU** and **memory**. Both are **chips**.

### Communication Devices
Let computers **exchange data** with other computers over **transmission media** (cables, telephone lines, fiber optics).
- **Modem**: communicates via telephone lines or other means; most are **internal**.
- **Network**: **two or more connected computers** sharing input, processing, output, and storage.
- **Internet**: the **worldwide collection of networks** linking businesses, governments, schools, and individuals.

---

## 6. The CPU (Central Processing Unit)

The **brain** of the computer; it handles all instructions. In microcomputers, the CPU is on a **single chip (IC)** called a **microprocessor**.

| Part | Role | Nickname |
|---|---|---|
| **Arithmetic Logic Unit (ALU)** | Performs **arithmetic** (+ − × ÷) and **logical** operations (<, =, >) | "The Calculator" |
| **Control Unit (CU)** | **Manages and coordinates** all units; fetches instructions from memory, **interprets** them, and sends signals to other parts. Calls on the ALU for calculations | "The Air Traffic Controller" / **"Central Nervous System"** |
| **Registers / Memory Unit (cache)** | **Small, high-speed** circuits that hold data, instructions, and addresses while the ALU works | High-speed memory for instant access |
| **Buses** | Connections that carry signals between components. Data moves as **8-bit** units over a group of 8 wires. **3 types: data bus, control bus, address bus** | — |
| **Clock** | Allocates a fixed time slot for each micro-operation; CPU runs **in sync with clock pulses**. Speed measured in **MHz** (millions of cycles/second) | — |

> **Watch out:** The **CU** doesn't calculate; it **directs**. The **ALU** does the math.

---

## 7. Memory

**Memory** temporarily holds data and instructions **before, during, and after** CPU processing. It's the computer's **work area** (a collection of ICs).

| | **RAM** (Random Access Memory) | **ROM** (Read-Only Memory) |
|---|---|---|
| **Volatility** | **Volatile**: erased when power is off | **Non-volatile**: kept when power is off |
| **Purpose** | **Temporary working memory** for running programs | Stores **firmware / essential instructions** (e.g. **BIOS**) |
| **Typical use** | Running programs, processing data | **Booting** and hardware-control instructions |
| **Can be modified?** | **Yes** (read/write) | Traditionally **no**; modern forms can be rewritten |
| **Capacity (lesson)** | 640 KB to several MB (old models) | 64 KB to 256 KB |

> **Analogy:** RAM = a **whiteboard** (temporary workspace, wiped when you leave). Storage = a **filing cabinet** (keeps things long-term).

### Key Characteristics of RAM
1. **Temporary (volatile)**: unsaved work in RAM is lost if power suddenly goes out.
2. **Fast access**: much faster than HDDs/SSDs.
3. **Random access**: the CPU can jump to **any location directly**.
4. **Affects performance**: more RAM = more programs at once; too little = slow computer.

**Types of RAM**

| Type | Description |
|---|---|
| **DRAM** | Dynamic RAM; common **main memory** |
| **SRAM** | Static RAM; **faster, more expensive**; used for **CPU cache** |
| **SDRAM** | **Synchronized** with the system clock |
| **DDR RAM** | Double Data Rate; widely used today |
| **DDR4** | Common generation, good performance |
| **DDR5** | Newer; **higher bandwidth**, more efficient than DDR4 |

### ROM
When the computer turns on, it loads the **BIOS (Basic Input/Output System)** from ROM. ROM holds the programming that lets the computer **boot up**.

**Types of ROM**

| Type | Description |
|---|---|
| **PROM** | Programmable ROM; programmed **once** after manufacturing |
| **EPROM** | Erasable PROM; erased with **ultraviolet (UV) light**, then reprogrammed |
| **EEPROM** | **Electrically** erasable and rewritable |
| **Flash memory** | A type of EEPROM erased/rewritten **in blocks**; used in **USB drives, memory cards, SSDs** |

> **Memory trick:** **P**ROM = **P**ermanent once. **E**PROM = **E**rased by UV. **EE**PROM = **E**lectrically **E**rased.

### Memory vs Storage

| Memory (RAM/ROM) | Storage (HDD/SSD/Cloud) |
|---|---|
| **Primary** storage | **Secondary** storage |
| Holds data **temporarily** while processing (RAM) | Holds data **permanently** |
| Extremely **fast** | Slower, but **huge capacity** (GB/TB) |
| Whiteboard | Filing cabinet |

---

## 8. Computer Categories (Lesson 1)

Based on **size, speed, processing capability, and price**. (Categories overlap and change as technology improves.)

| Category | Key facts |
|---|---|
| **Personal Computer / Microcomputer (PC)** | Does all input, processing, output, and storage **by itself**. Most common (desktops, laptops). Has at least one input, output, storage device, memory, and a processor. The **microprocessor** = CPU on a single chip. Two popular series: **PC** (Windows) and **Apple Macintosh** (macOS) |
| **Minicomputer** | More powerful than a workstation, smaller than a mainframe. Supports **up to 4,000 users**. Accessed via **terminals**; **dumb terminals** have **no processing power**. Can act as a **server** |
| **Mainframe** | Large, powerful, expensive; used by **large organizations**; handles **hundreds to thousands** of users; stores tremendous data; can act as a **server** |
| **Supercomputer** | **Fastest, most powerful, most expensive**. Processes **more than 64 billion instructions per second**. Used for **weather forecasting, nuclear energy research, petroleum exploration** |

### Why Computers Are Powerful (5 Pillars)

| Pillar | Meaning |
|---|---|
| **Speed** | Data travels through circuits at **near the speed of light**: billions of operations per second |
| **Reliability** | **Low failure rate**; consistent results |
| **Accuracy** | **Error-free** results **if** input is correct. **GIGO: Garbage In, Garbage Out** |
| **Storage** | Holds **enormous** amounts of data, retrieved instantly |
| **Communications** | Can **share** input, processing, output, and storage with other computers (networks, Internet) |

> **Own example (GIGO):** If you type your grade as 58 instead of 85, the computer will "accurately" compute a failing average. The computer isn't wrong; the **input** was.

### Types of Users

| User | Uses computers for |
|---|---|
| **Home users** | Entertainment, communication, research, education, web, shopping, personal finance, word processing |
| **Small business users** | Productivity, communication software, browsers, e-mail, specialized software |
| **Mobile users** | Laptops on the road; often **presentation** software |
| **Large business users** | Productivity software, automated systems for most departments, large networks |
| **Power users** | **Workstations**/powerful computers for design, publishing, graphic art, **multimedia** |

---

## 9. Classifications of Software

| Class | Examples |
|---|---|
| **1. System Software** | **Operating System**, **Utilities** |
| **2. Programming Languages** | **1GL**: Machine language · **2GL**: Assembly language · **3GL**: C, BASIC, Pascal, Foxbase · **4GL**: PowerBuilder, SQL, Magic · **5GL**: Visual Basic, Visual FoxPro, Java, Visual C++ |
| **3. Application Software** | Word processing, spreadsheet, graphics, games, educational, desktop publishing, accounting package, **CAD** (Computer-Aided Design) |

> **Own example:** Windows 11 = **system software**. MS Word = **application software**. Python = **programming language**.

---

## 10. Input Devices

An **input device** lets users **enter data and commands** into memory.

| Type | Meaning | Examples |
|---|---|---|
| **Basic input devices** | **Essential** to operate a PC | **Keyboard, mouse** |
| **Special input devices** | **Not essential**; for special purposes | Trackball, light pen, touch screen, joystick, digitizer, scanner, OMR, BCR, OCR, MICR, voice input |

| Device | Key facts |
|---|---|
| **Keyboard** | Most common input device for **manual data entry**. Pressing a key sends an electric signal; a **keyboard encoder** sends the **binary code** to the CPU. **101-key** keyboard is the most popular |
| **Mouse** | Controls **cursor movement**; named for its shape. Has 1–3 buttons. **3 basic types: mechanical, opto-mechanical, optical**. Wireless mice also exist |
| **Trackball** | A **stationary** pointing device: an **upside-down mouse**. Roll the ball with fingers/thumb/palm. Sensors detect rotation on **two axes**. Used in some laptops. **Advantages: ergonomics** (less arm/wrist movement), **space-saving**, **precision** |
| **Light pen** | Pen-like pointing device to select menu items or **draw on the screen**. Has a **photocell** and optical system in a tube |
| **Touch screen** | Screen sensitive to **fingers**; point instead of pressing keys |
| **Joystick** | A stick with a spherical ball at **both ends**; the lower ball moves in a socket; moves in **all four directions**. Used for **CAD and gaming** |
| **Digitizer / Graphics tablet** | Converts **analog → digital**; used for fine **drawing** work |
| **Scanner (flatbed)** | Works like a **photocopier**; converts paper images to digital form for editing |
| **OMR** (Optical Mark Reader) | Reads **pen/pencil marks**; used to check **multiple-choice exam** answer sheets |
| **BCR** (Bar Code Reader) | Reads **bar codes** (light and dark lines) → alphanumeric value; used for **labeling goods, numbering books** |
| **OCR** (Optical Character Recognition) | Reads **printed text** character by character → machine-readable text; used for tickets, credit card bills, **ZIP codes** |
| **MICR** (Magnetic Ink Character Recognition) | Reads characters printed in **magnetic ink**; used in **banks** for **cheques** (bank code, cheque number) |
| **Voice input** (microphone) | Recognizes the **human voice**; stores sound digitally; for multimedia, music mixing |

> **Memory trick for scanners:** O**M**R = **M**arks · **B**CR = **B**ars · O**C**R = **C**haracters · MICR = **M**agnetic ink (banks)

---

## 11. Keyboard Fundamentals

Desktop keyboards have **101–105 keys**; laptops have fewer.

### Parts of the Keyboard

| Part | Description |
|---|---|
| **Typewriter keypad** (alphanumeric) | Letters, numbers, punctuation, basic keys |
| **Numeric keypad** | **Calculator-style** keys on the **right** for fast number entry |
| **Toggle keys** | Switch between **two states**: **Caps Lock, Num Lock, Scroll Lock, Insert** |
| **Special (computer) keys** | **Esc, Ctrl, Alt, Print Screen, Windows key, Menu key** |
| **Function keys** | **F1–F12** across the top; the command depends on the program (**F1 = Help** in many programs) |
| **Cursor/arrow keys** | Move the cursor |
| **Control keys** | Backspace, Enter, Tab, Delete, Space bar |

**Key classes (Lesson 2.1):** **letter keys** (26), **digit keys** (top row + numeric pad), **special character keys** (< > ? / { } [ ] @ # $ % & *), **non-printable control keys** (backspace, enter, tab, arrows, insert, delete, space), **function keys**.

> Press the key labeled **F1**, not the letter F then 1.

> **Note:** Lesson 2.2 says F1–**F12** (standard today); Lesson 2.1 says up to **F15** (older keyboards).

### Types of Keyboard Layout

| Layout | Key facts |
|---|---|
| **QWERTY** | Named after the **first six letters** of the top letter row. **Most widely used**, but may **limit typing speed** |
| **Dvorak** (pronounced *de-VOR-zhak*) | Puts the **most frequently typed letters in the middle** row to **improve speed** |

> Despite Dvorak's more logical design, **QWERTY is more widely used**.

### Typing Methods

| Method | Description |
|---|---|
| **Hunt and peck** | Staring at the keyboard to find each key and hitting it with the **index finger** |
| **10-finger method (touch typing)** | Fingers have **fixed positions**; you type "**blindly**" without looking |

### Home Row (Basic Position)
- **Left hand:** **A S D F**
- **Right hand:** **J K L ;**
- **Thumbs:** **Space bar**
- **F and J have small bumps** so you can find the position without looking.

**Finger assignments (touch typing)**

| Finger | Left hand | Right hand |
|---|---|---|
| **Pinky** | Q, A, Z, 1 (+ Tab, Caps Lock, Shift) | P, ;, /, 0 (+ Enter, Shift, Backspace) |
| **Ring** | W, S, X, 2 | O, L, ., 9 |
| **Middle** | E, D, C, 3 | I, K, ,, 8 |
| **Index** | R, F, V, T, G, B, 4, 5 | Y, H, N, U, J, M, 6, 7 |
| **Thumb** | Space bar | Space bar |

> **Lesson example:** To type **E**, the **left middle finger** reaches up from **D**, then returns to D.

### Objective and Advantages of the 10-Finger Method
**Objective:** anchor keyboard handling in your **subconscious**, so you focus on **content**, not on finding keys.

| Advantage | Meaning |
|---|---|
| **Speed** | Type much faster, saving time |
| **Efficiency** | Concentrate on the text; less mental back-and-forth |
| **Ergonomics** | No constant looking down → **upright, healthy posture** |

- Switching may make you **slower at first**. Don't be discouraged.
- Using fewer fingers is okay if needed; what matters is knowing key positions without thinking.

**Why it's worth it:** If you type **1 hour a day** (365 hrs/year) and **double** your speed, you save about **180 hours a year**, around **4½ work weeks** (40-hour weeks).

---

## 12. Output Devices

**Output devices** display or print processed information: **monitor, printer, plotter, speaker, computer output microfilm.**

### Monitor
Also called the **Visual Display Unit (VDU)**, the **main output device**. Forms images from **pixels**; **more pixels = sharper image**.

**By resolution:** **CGA** (Colour Graphics Adapter), **MDA** (Monochrome Display Adapter), **HGA** (Hercules Graphics Adapter), **EGA** (Enhanced Graphics Adapter), **VGA** (Video Graphics Adapter), **SVGA** (Super Video Graphics Adapter)

**By colour:** **Monochrome** (single colour, black/white) and **Colour** monitors

### Printers

```
PRINTERS
├── IMPACT (strikes ribbon onto paper)
│   ├── Character printers (1 character at a time)
│   │   ├── Daisy wheel
│   │   └── Dot matrix
│   └── Line printers (1 line at a time, faster)
│       ├── Drum
│       └── Chain
└── NON-IMPACT (no striking; a full page at a time = "page printers")
    ├── Laser
    └── Inkjet
(+ Thermal printers: direct thermal, thermal transfer)
```

| Printer | How it works |
|---|---|
| **Daisy wheel** | A plastic/metal hub with **spokes** (the "daisy wheel") strikes characters |
| **Dot matrix** | Prints characters as **dots** |
| **Drum** | A **rotating drum** with a ring of characters per print position |
| **Chain** | A **rotating chain** of characters per print position |
| **Laser** | Works like a **photocopier**; a **laser beam** writes the image |
| **Inkjet** | Sprays **tiny droplets of ink** from a moving print head |
| **Thermal** | Uses **heat** instead of liquid ink |

**How an inkjet prints:** computer sends the document → printer processes it → print head moves across the paper → ink droplets placed on specific spots → droplets form text/images → paper moves until done.

**Thermal printer types**

| Direct thermal | Thermal transfer |
|---|---|
| **Heat-sensitive paper** turns dark when heated | Heat transfers ink/wax from a **ribbon** |
| **No ink or toner** | Prints are **more durable** |
| Receipts, tickets, labels | Product labels, barcodes, shipping labels |

> **Own example:** The receipt from 7-Eleven or a grocery = **direct thermal** (it fades over time).

### Other Output Devices

| Device | Key facts |
|---|---|
| **Plotter** | Prints **high-quality graphics** (charts, drawings, maps) for engineering/science. **Flatbed** (pen moves on a stationary surface), **Drum** (pen **and** drum move), **Inkjet** (inkjet instead of pen; faster; multicoloured large drawings) |
| **Speakers** | Get audio from the **sound card** → sound waves. Most are **active** (built-in **amplifier**). Come in pairs for **stereo** sound |

---

## 13. Storage Devices

**Storage devices** store, save, and retrieve digital data: documents, photos, videos, programs, OS files.

| Primary storage | Secondary storage |
|---|---|
| Smaller size | **Large** capacity |
| Stores data **temporarily** | Stores data **permanently** |
| **Fastest** access | Slower |
| Also called **main memory / main store**; closely connected to the processor; holds programs being worked on | Can be **internal or external**; used to **transfer** data between computers |
| **RAM, ROM** | HDD, SSD, CD, USB, etc. |

A **storage medium** (plural: media) is the physical material data is stored on. A **storage device** records and retrieves data to/from the medium, and often acts as **input** (it transfers items into memory).

### Types of Secondary Storage

**1. Magnetic Storage**

| Device | Key facts |
|---|---|
| **Hard Disk Drive (HDD)** | Stores data **magnetically** on **platters** (disks coated with magnetic material), read by a **magnetic head**. **Pros:** large capacity (up to 10 TB in the lesson), data kept when off. **Cons:** slower than RAM/ROM; if it **crashes**, you lose your work. Usually **fixed inside**, not portable |
| **External hard drive** | **Portable**, connects via **USB**; for backups and when the internal drive is full; **higher capacity than flash drives** |
| **Floppy disk** | Small, **flexible** plastic disk with magnetic coating in a square jacket; read by a **Floppy Disk Drive (FDD)**. Sizes: **5¼" and 3½"**. Capacity: **360 KB to 1.44 MB**. Single- or double-sided |
| **Magnetic tape** | **Oldest** storage medium for large data; in **cassettes**. **Pros:** small, cheap, stores a lot. **Con:** **very slow** access |

**2. Optical Storage**: uses a **laser** to read/write discs

| Disc | Capacity | Laser | Types |
|---|---|---|---|
| **CD** (Compact Disc) | **~700 MB** (CD-ROM usually 650 MB) | **Red** | **CD-ROM** (read only), **CD-R** (write once), **CD-RW** (rewritable) |
| **DVD** (Digital Versatile Disc) | **~4.38 GB** (commonly 4.7 GB) | Red | **DVD-ROM** (read only), **DVD-R** (record once), **DVD-RW / DVD+RW** (record and erase many times) |
| **Blu-ray** (BD) | **25–50 GB** | **Blue** | For **HD video**; higher capacity and quality than DVD |

> Data on a CD is stored as **pits** on reflective material; the laser detects the pits and converts them to a digital signal.

> **Memory trick:** **ROM** = **R**ead **O**nly · **R** = **R**ecord once · **RW** = **R**e**W**rite

**3. Solid-State Storage**: stores data **electronically**, **no moving parts**

| Device | Key facts |
|---|---|
| **SSD** (Solid-State Drive) | Non-volatile, **electronic** (flash memory on microchips). **Pros:** much faster, no moving parts, **shock-resistant**, less power. **Cons:** **more expensive per GB** |
| **USB flash drive** | Small, portable flash-memory device via **USB port**; for transferring files, presentations, installers, small backups |
| **Memory card** (flash card) | Small non-volatile flash storage for **cameras and phones**. **SD (Secure Digital) card** is one **specific type** ("memory card" is the general term) |

**HDD vs SSD**

| HDD | SSD |
|---|---|
| Records **magnetically** on a **spinning platter** with a moving read/write arm | Stores **electronically** on **microchips** |
| Has **moving parts** | **No moving parts** |
| **Slower**, cheaper per GB | **Faster**, more expensive per GB |

**4. Photographic Storage**: stores documents as **tiny photographic images** on film

| Type | Description |
|---|---|
| **Microfilm** | A **roll** of **35 mm film**; a reader's lens enlarges the image |
| **Microfiche** | A **flat sheet/card** of transparent film with miniaturized pages (newspapers, catalogs) |

**Summary: Secondary Storage and Common Uses**

| Device | Common use |
|---|---|
| HDD | Computer storage, backups |
| SSD | OS, applications, fast storage |
| USB flash drive | Transferring files |
| Memory card | Cameras, smartphones, tablets |
| CD | Music, software, small files |
| DVD | Movies, software, data |
| Blu-ray | HD/4K video, large data |
| External HDD/SSD | Backups, large file transfers |
| **NAS** (Network Attached Storage) | Storage on a **network** shared by **multiple users**: file sharing and backups |

---

## 14. Types of Computers (Lesson 2)

### According to Purpose

| Type | Meaning | Examples |
|---|---|---|
| **General purpose** | For general tasks | Office work, sales analysis, accounting, invoicing |
| **Special purpose** | Built for **specific tasks** | Scientific research, **weather forecasting**, space applications |

### According to Technology Used

| Type | Meaning | Examples |
|---|---|---|
| **Analog** | Represents data as **continuously varying** physical quantities (current, voltage, frequency); measures pressure, temperature, speed | **Thermometer, speedometer** |
| **Digital** | Represents data in **discrete** numbers (**binary**); mainly general purpose | PCs, laptops, phones |
| **Hybrid** | **Both** analog and digital; uses **ADC** (analog-to-digital) and **DAC** (digital-to-analog) converters | Mainly used in **artificial intelligence** (also: hospital ICU monitors) |

> **Own example:** An old needle speedometer is **analog** (smooth movement). A digital clock showing 10:45 is **digital** (exact numbers).

### According to Size and Storage Capacity

| Type | Key facts | Examples |
|---|---|---|
| **Supercomputer** | **Biggest and fastest**; many CPUs working **in parallel**; weather, energy, defense, nuclear research, medicine, animation | **CRAY-3, CRAY-XMP-14, NEC-500, PARAM 9000, PARAM 10000** |
| **Mainframe** | Large and fast but smaller/slower than super. **Centralized**: many **terminals** share **one CPU**; thousands of users; **railway/airline reservations, banking** | **IBM 3090, IBM 4381, IBM 4300, IBM ES-9000** |
| **Minicomputer** | Medium-scale, slower than mainframe; many terminals on one CPU; used where processing can be **distributed** | **PDP-1, DEC MicroVAX, IBM AS/400** |
| **Microcomputer** | **Smallest** digital computer; CPU is a **microprocessor** (single-chip CPU); = **PC**. Stand-alone or a terminal. **Desktop or portable** (laptops, notebooks; **notebooks are smaller and lighter** than laptops) | Desktop, laptop |

> **Size order (biggest → smallest):** **S**uper → **M**ainframe → **M**ini → **M**icro ("**S**ome **M**en **M**ake **M**illions")

---

## Quick Check

1. What is the difference between data and information?
2. What are the four stages of the IPOS cycle?
3. Which generation introduced transistors? Integrated circuits?
4. Which CPU part performs arithmetic and logical operations?
5. Which CPU part is called the "central nervous system"?
6. What are the three types of buses?
7. RAM or ROM: which is volatile?
8. What does BIOS stand for, and where is it stored?
9. Which ROM type is erased using UV light?
10. What does GIGO mean?
11. A supercomputer can process more than how many instructions per second?
12. What device reads the answer sheets of multiple-choice exams?
13. What device is used in banks to read cheques?
14. What are the home row keys for each hand?
15. Which keys have small bumps?
16. Why is the QWERTY keyboard called that?
17. Impact or non-impact: which prints a full page at a time?
18. Which thermal printer needs no ink or ribbon?
19. What is the capacity of a Blu-ray disc, and what laser color does it use?
20. HDD vs SSD: which has no moving parts?
21. Microfilm vs microfiche: which is a flat sheet?
22. A thermometer is an example of what type of computer (by technology)?
23. Give one example of a mainframe computer.
24. Floppy disk sizes and capacity range?

<details>
<summary>Answers</summary>

1. **Data** = unorganized raw facts; **information** = organized, meaningful, useful data
2. **Input, Process, Output, Storage**
3. **2nd** gen = transistors; **3rd** gen = ICs
4. **ALU**
5. **Control Unit**
6. **Data bus, control bus, address bus**
7. **RAM**
8. **Basic Input/Output System**, stored in **ROM**
9. **EPROM**
10. **Garbage In, Garbage Out**: output accuracy depends on input accuracy
11. **64 billion**
12. **OMR** (Optical Mark Reader)
13. **MICR** (Magnetic Ink Character Recognition)
14. Left: **A S D F**; Right: **J K L ;**
15. **F and J**
16. Named after the **first six letters** of the top letter row
17. **Non-impact** (page printers)
18. **Direct thermal**
19. **25–50 GB**, **blue** laser
20. **SSD**
21. **Microfiche**
22. **Analog**
23. IBM 3090, IBM 4381, IBM 4300, or IBM ES-9000
24. **5¼" and 3½"**; **360 KB to 1.44 MB**

</details>
