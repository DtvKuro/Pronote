# HCI 101 Human-Computer Interaction — Midterm

> Covers: Intro & History of HCI, Frameworks & Paradigms (Norman), Design & the Software Process, HCI in the Software Process, Design Rules, Implementation Support, Evaluation Techniques, Universal Design & User Support.

---

## 1. Introduction to HCI

### Key Vocabulary

| Term | Meaning |
|---|---|
| **HCI** (Human-Computer Interaction) | **Designing, evaluating, and improving** how humans interact with technology. Combines **design, computing, and human sciences**. Goal: **useful, usable, supportive** technology |
| **Interaction Design** | Designing interactive products that **support communication and interaction** in daily and work life, for real people in real contexts |
| **User Experience (UX)** | How a product **behaves and feels** in context |
| **Usability** | Effectiveness, efficiency, safety, utility, learnability, memorability |
| **User-Centered Design** | Involving **users, tasks, and contexts throughout** design |

### Why HCI Matters
- A system can **work** and still be **confusing, slow, unsafe, or inaccessible**.
- Design affects **errors, learning time, productivity, trust, and satisfaction**.
- **Early attention to users reduces costly redesign.**
- Technology must serve **diverse people in diverse contexts**.

### Good Design vs Poor Design

| Good Design | Poor Design |
|---|---|
| Clear and simple | Cluttered content |
| Easy to navigate | Weak visual hierarchy |
| Consistent patterns | Inconsistent controls |
| Helpful feedback | Unclear status and labels |
| Fast and safe task completion | More errors, delay, and stress |

> **Lesson examples:** A clean **mobile banking app** and a **LearnHub dashboard** (clear, grouped, labeled) were shown as **good**. A flashy **"SUPER MEGA SALE!!! CLICK EVERYTHING!!!" shopping page** and a cramped **desktop database tool** full of tiny icons and 9 tabs were shown as **poor**.

### History of HCI

| Era | Milestones | Key idea |
|---|---|---|
| **1940s** Foundations | **1945 Memex**: Vannevar Bush imagined a desk-like system for storing, connecting, and retrieving information. **1946 ENIAC**: one of the first general-purpose electronic computers, operated with switches, cables, plugboards, punched cards | Interaction required **technical expertise and direct machine control** |
| **1950s** Early interaction | **1950 Turing Test**: Alan Turing, judging machine intelligence through text conversation. **1952 Trackball** (Canadian DATAR system). **1955 Light pen**: point and draw directly on the display | People began **communicating with computers more directly** |
| **1960s** Interactive computing | **1960 Man-Computer Symbiosis**: J.C.R. Licklider, people and computers working together. **1963 Sketchpad**: Ivan Sutherland, graphical interaction with a light pen. **1964 Computer mouse**: Douglas Engelbart's wooden prototype. **1968 "Mother of All Demos"**: Engelbart showed the mouse, windows, hypertext, video calls, collaborative editing. **1969 ARPANET**: networked computers | From **operating machines** to **interacting with information** |
| **1970s** Personal & graphical | **1970 Xerox PARC** research center. **1973 Xerox Alto**: graphical display, keyboard, and mouse workstation. **1977 Personal computers** (Apple II) in homes and schools. **1979 VisiCalc**: first popular spreadsheet | Computers became **visual, personal, and useful** |
| **1980s** The GUI | **1981 Xerox Star**: commercial desktop with icons, folders, windows, mouse. **1983**: the term **"HCI" gained recognition**. **1984 Macintosh** popularized the GUI and mouse. **1989 World Wide Web**: proposed by **Tim Berners-Lee** | **Pointing, clicking, graphical desktops** became mainstream |
| **1990s** Web & everyday computing | **1991 Web goes public**. **1993 Mosaic** browser (text + images). **1995 Windows 95** (Start menu, taskbar). **1996 PalmPilot** (handheld, touch-based) | Interaction expanded from the **desktop to the Web and mobile** |
| **2000s and beyond** | **2000s Web 2.0** (create, share, collaborate). **2007 Multi-touch smartphones** (tap, swipe, pinch). **2010s Voice & wearables** (hands-free, context-aware). **2016 VR/AR**. **2020s Generative AI** (natural-language prompts) | Interaction became **mobile, natural, immersive, and intelligent** |

**Summary by era:** 1940s–60s = human factors and ergonomics · 1970s–80s = personal computing, GUIs, usability · 1990s–2000s = web and mobile · 2020s+ = technology embedded in everyday life.

> **HCI's central shift:** *Earlier* it asked **"Can people use it effectively?"** (performance, usability). *Today* it asks **"What experience does it create?"** (meaning, emotion, inclusion, people at the center).

> **Memory trick for the 1960s:** **L**icklider → **S**utherland → **E**ngelbart (**L**et **S**ketch **E**volve): symbiosis → Sketchpad → mouse.

### What Designers Must Consider

| Question | Covers |
|---|---|
| **Who** | Users' abilities, experience, culture, needs, accessibility |
| **What** | Goals and activities the product must support |
| **Where** | Physical, social, organizational, technological context |
| **How** | Input, output, flow, feedback, confirmation, recovery |

### Who Is Involved (Multidisciplinary Team)

| Role | Contributes |
|---|---|
| **Users & stakeholders** | Needs, goals, context, feedback |
| **UX designers** | Flows, prototypes, behavior, experience goals |
| **Developers** | Architecture, implementation, reliability, performance |
| **Psychologists** | Attention, memory, learning, decision-making |
| **Human-factors specialists** | Safety, comfort, workload, environment |
| **Visual designers & domain experts** | Communication and real-world rules |

### The Human Side of HCI (4 Human Factors)

| Factor | Meaning | Design response | If ignored... |
|---|---|---|---|
| **Perception** | Detecting info through sight, sound, other senses | Readable text, contrast, clear icons, status cues | Users **can't perceive it**, so they can't interact with it |
| **Cognition** | Attending, understanding, remembering, deciding, solving | Simple choices, logical grouping, recognition, feedback | Users **don't understand it**, so they make bad choices |
| **Psychology** | Emotions, motivation, expectations, habits, trust, anxiety | Supportive wording, predictable behavior, credible signals | Users **don't feel good about it**, so they won't trust or keep using it |
| **Ergonomics** | Fit with the body, device, environment, duration of use | Comfortable reach, adequate target size, reduced strain | Hard to **hold, reach, or use** → users get tired or frustrated |

> "Good design considers **the whole person** and **the whole context**."

> **Lesson examples:** A **tiny button** is an ergonomics + perception problem. An **unclear icon** is a perception + cognition problem. A **harsh error message** ("You did something wrong! Error code 42X7") is a psychology + cognition problem.

### Usability Goals (6)

| Goal | Meaning |
|---|---|
| **Effective** | Supports **accurate and complete** task accomplishment |
| **Efficient** | Reasonable **time, steps, and effort** |
| **Safe** | **Prevents serious errors** and supports recovery |
| **Utility** | Provides the **functions users actually need** |
| **Learnable** | New users can **become competent** |
| **Memorable** | Still understandable **after a period of non-use** |

> **Mnemonic:** **E**very **E**xcellent **S**ystem **U**sually **L**ooks **M**agical = Effective, Efficient, Safe, Utility, Learnable, Memorable

> **Own example (GCash, sending ₱500):** *Effective* if the money reaches the right person. *Efficient* if it takes few taps. *Safe* if it confirms the recipient's name before sending. *Utility* if it has the Send feature you need. *Learnable* if a first-timer figures it out. *Memorable* if you still remember how after a month.

### Experience Goals (Beyond Usability)
Products may also aim to be **satisfying, enjoyable, engaging, motivating, rewarding, creative, or emotional**. The right goals **depend on context**:
- **Safety-critical systems** prioritize **effectiveness and safety**.
- **Games** may *deliberately* add challenge, competition, and fun.

---

## 2. HCI Frameworks and Paradigms (Don Norman, Ch. 1)

### Framework vs Paradigm

| Framework | Paradigm |
|---|---|
| A **structured guide** used to analyze, design, or evaluate interaction | A **broad way of thinking** (lens) that shapes what good interaction should be |
| Organizes the questions and principles we apply | Changes how designers **see** users and technology |
| **= guide / structure** | **= way / style / mindset** |

> **Own example:** A **paradigm** is your belief: "I should eat healthy." A **framework** is the meal plan that tells you what to eat and when.

### Three Important Paradigms

| Paradigm | Focus |
|---|---|
| **1. Cognitive** | What happens **in the user's mind**: perception, attention, memory, decision-making, problem-solving |
| **2. Human-Centered Design** | Puts the **user's needs, abilities, behavior, and limitations first**. Understand → identify needs → create and test → improve through iteration |
| **3. Experiential & Emotional** | How the interaction **makes the user feel**: attractive, enjoyable, satisfying, frustrating, meaningful |

**Cognitive paradigm cycle (lesson diagram):**
User's **goal** (e.g. book a flight) → **Perception** (notice text, icons, layout) → **Attention** (focus on what matters) → **Memory** (past experience guides actions) → **Decision making** (choose the best action) → **Action** (mouse, keyboard, touch, voice) → **Feedback & evaluation** (system responds; did it achieve the goal?)

> Technology should match **how people think, learn, remember, and solve problems**.
> Example: a banking app with a **large balance** (perception), **quick actions in the center** (attention), **familiar icons** (memory: recognition, not recall), **organized history** (decision), **clear buttons** (action).

### Framework 1: Human-Centered Design (HCD)
Start with **people's needs, abilities, limitations, and real behavior**, then design technology to fit them.

**Norman's 4 steps:** **OBSERVE** (watch real users doing real tasks) → **IDEATE** (create solutions) → **TEST** (try with users) → **ITERATE** (revise using evidence)

**HCD paradigm, 5 steps (lesson diagram):** People first, technology second
1. **Understand users**: research, observe behavior, identify pain points
2. **Identify needs**: analyze insights, define real needs, prioritize
3. **Create solutions**: brainstorm, design with users in mind, build prototypes
4. **Test with users**: usability testing, gather feedback, measure effectiveness
5. **Improve through iteration**: refine, solve remaining problems, repeat

**Result:** solutions that are **useful, usable, desirable, meaningful**: they meet real needs, are easy to use, create positive experiences, reduce errors, and increase satisfaction and adoption.

**Why HCD matters**
- People are creative but also **distracted, tired, imperfect**. **Experts make mistakes too.**
- **Repeated errors reveal weak design.** *"If many users make the same mistake, investigate the design."*
- Design for people **as they really are**, not as we wish them to be.

### Framework 2: Principles of Interaction (6)

| Principle | Short meaning | Details | Example |
|---|---|---|---|
| **Affordance** | **Possible action** | The relationship between an object's properties and the user's abilities that **makes an action possible** | A chair affords sitting. A button affords pressing. **Glass** affords seeing through but blocks passing = **anti-affordance** |
| **Signifier** | **Visible clue** | A **perceivable clue** showing **where/how** to act. Types: **physical** (handle, push plate, arrow, label), **digital** (button shape, icon, link style, cursor change), **accidental** (footprints, worn surfaces) | "PUSH" sign on a door |
| **Constraint** | **Limits action** | Reduces possible actions to prevent errors. Types: **physical** (plug fits one port), **logical** (only one action makes sense), **cultural** (red = stop/danger) | Greyed-out "Next" until the form is filled |
| **Mapping** | **Control ↔ result link** | Relationship between a control and its result. **Poor:** 4 knobs in a line for 4 burners in a square. **Natural:** controls arranged like the burners | Volume slider: up = louder |
| **Feedback** | **What happened** | Shows result/progress. Must be **immediate, informative, noticeable, appropriate** | Sent ✓, progress bar, vibration, confirmation |
| **Conceptual model** | **How it works** | Simplified explanation that helps users **predict, explain, recover** | "Trash bin" = deleted files can be restored |

> **Quick check:** Is a door **handle** an affordance or a signifier? **Both**: it *allows* pulling (affordance) and *shows* where to grab (signifier).

**The System Image**
```
DESIGNER'S MODEL  ──►  SYSTEM IMAGE  ──►  USER'S MODEL
(how the designer    (interface, controls,   (how the user
 thinks it works)     labels, help)            thinks it works)
```
Good design makes the **user's model match the designer's model**. The only way they "talk" is through the **system image**.

### Paradigm Shifts

| Shift | Old view | New view |
|---|---|---|
| **1. Technology → People** | Start with what the **machine** can do; users must learn it; success = functions work | Start with what **people** need; system adapts to users; success = useful, usable, understandable. *"Can we build it?"* → *"Does it work well for people?"* |
| **2. Blame → Design** | "The user made a mistake." Add warnings, read the manual, more training | "**Why was the error likely?**" Improve signifiers, mapping, constraints, feedback, recovery. *Human error is a symptom, not the final explanation* |
| **3. Function → Experience** | **Functional**: completes its operation | **Usable** (effective, efficient, learnable, safe) → **Enjoyable** (confidence, satisfaction, trust) |

### The Paradox of Technology
**More capabilities = more complexity.** More features solve more problems but are **harder to find, learn, and control**. Good design **protects common tasks** from unnecessary complexity.

| Level | Key idea |
|---|---|
| **Paradigm** | Human needs guide technology |
| **Framework** | HCD process: observe, test, iterate |
| **Principles** | Interaction concepts (affordance → conceptual model) |
| **Result** | Useful, usable, understandable interaction |

---

## 3. Design and the Software Process (Part 1)

**Big idea:** Good systems come from understanding people, defining goals and constraints, exploring solutions, testing early versions, and improving them before deployment.

HCI isn't only studying systems. It's also **doing and making**. A system isn't successful just because it **works technically**. It must fit users' real needs and routines.

> **Lesson example:** An attendance app isn't good just because it records names. It should be **quick**, **prevent duplicates**, **protect student data**, and **fit the teacher's routine**.

### What Is Design?
**Design = achieving goals within constraints.**

| Concept | Meaning |
|---|---|
| **Goals** | What the design should achieve (purpose, users, why they need it) |
| **Constraints** | Limits the design must respect: **time, budget, materials/technology, standards, safety, privacy, security, environment (rain, weak signal), legal/ethical (copyright)** |
| **Trade-off** | A **reasoned choice** to relax a less important goal/constraint so a more important one can be met. Justified by **evidence and priorities**, not personal preference |

> **Lesson example:** A student portal due before enrollment **drops a non-essential animation** to focus on accurate records, security, accessibility, and on-time delivery.

### Golden Rule of HCI Design
**Understand computers AND understand people.**

| Understand computers | Understand people |
|---|---|
| Capabilities & limitations, platforms, tools, processing, storage, networks, input/output | Perception, memory, attention, physical abilities, social needs, work habits, common errors |

A powerful system **fails** if people can't use it. A great idea **fails** if the tech can't support it.

### Usability Must Start Early
Don't treat usability as a final test. User needs, accessibility, work practices, errors, feedback, navigation, and controls should shape **early decisions**, which **reduces costly redesign**.

### The Interaction Design Process

```
REQUIREMENTS → ANALYSIS → DESIGN → IMPLEMENTATION & DEPLOYMENT
        ↑__________ ITERATION & PROTOTYPING __________↓
```

| Phase | Purpose | Details |
|---|---|---|
| **1. Requirements** | Discover **what is needed** and how users currently work | Techniques: **interviews**, **direct observation**, **video recording (with consent)**, **examining documents/forms/tools** |
| **2. Analysis** | **Organize findings** to reveal key needs, repeated problems, patterns, unusual cases, conflicts | e.g. "Students on mobile data abandon uploads when file size isn't shown" |
| **3. Design** | Move from **what** is needed to **how** it will work | Task flow, navigation, labels, controls, layout, feedback, error prevention, accessibility |
| **4. Implementation & Deployment** | **Build and release** the system | Code, databases, documentation, training, installing. **Deployment is not the end**: feedback leads to improvements |

### Prototyping & Iteration
- **Prototype** = an early version or representation: **paper sketch, storyboard, wireframe, clickable mock-up, partially working product**.
- **Iteration** = create → test with representative users → find problems → revise → test again.

> **"The first design is only a hypothesis."**

### Time, Cost, and Quality
Balance **time, budget, and quality**. A product doesn't have to be perfect, but it must never sacrifice **safety, security, legality, core usability**.
> An acceptable product **on time and within budget** may be more useful than a perfect one delivered **too late**.

---

## 4. HCI in the Software Process (Part 2)

**Big idea:** Usability is designed **throughout** the life cycle, **not added at the end**.

**Software engineering** manages the software design process, called the **software life cycle** (plan, design, build, test, release, operate, improve).

### Waterfall Model

| Stage | Main question |
|---|---|
| **1. Requirements specification** | What must the system provide? |
| **2. Architectural design** | What major **components** are there, and how do they relate? |
| **3. Detailed design** | How will each component be refined into **modules**? |
| **4. Coding & unit testing** | Build and test **individual modules** |
| **5. Integration & testing** | Do combined parts **work together**? |
| **6. Operation & maintenance** | Support, fix, improve **after release** |

> **Limit:** Interactive systems rarely follow a straight line. Teams find missing requirements and usability problems as they go, so they need **iteration and feedback**.

### Functional vs Nonfunctional Requirements

| Functional | Nonfunctional |
|---|---|
| **What** the system must do | **How well** it should work |
| "Students can submit assignments" | Fast, secure, accessible, reliable, easy to use |

> **Lesson example (LMS components):** authentication, course content, assignments, messaging, grades.

### Verification vs Validation

| | Verification | Validation |
|---|---|---|
| Meaning | **Building the product right** | **Building the right product** |
| Question | Does it match the **specification**? | Does it meet **real user needs** in context? |

> A system can **pass verification but fail validation**. Example: an attendance app stores every record exactly as specified, but teachers find it **too slow in class**.

> **Memory trick:** **V**erification = **V**s. the document. **V**alidation = **V**alue to users.

**Formality gap:** the gap between **precise technical specifications** and **complex real-world user needs**. It's filled by observation, judgment, and user feedback.

**Management & contractual issues:** schedules, budgets, contracts, and acceptance criteria also shape what gets built.

### Usability Engineering
Makes usability **explicit and measurable** instead of just saying "user-friendly."

| Part of a usability specification | Meaning |
|---|---|
| **Usability attribute** | The quality to improve (e.g. learnability, error recovery) |
| **Measuring concept** | What is counted/timed/rated |
| **Measuring method** | **How** the data is collected |
| **Now level** | **Current** performance |
| **Worst-case level** | **Lowest acceptable** performance |
| **Planned level** | **Target** performance |
| **Best-case level** | **Ideal** performance |

> **Lesson example (backward recoverability, video recorder):** Method = number of actions to undo a wrong programming sequence. Planned = ≤ 2 actions. Best case = 1 cancel action.

> **Own example (online enrollment form):** Attribute: learnability · Concept: time to finish without help · Method: time 10 first-year students · Now: 15 min · Worst: 12 min · Planned: 8 min · Best: 5 min

### ISO 9241 Usability Categories

| Category | Meaning | Simple question |
|---|---|---|
| **Effectiveness** | **Accuracy and completeness** in achieving goals | Can users achieve what they want? |
| **Efficiency** | **Time, effort, resources** used | Without wasting effort? |
| **Satisfaction** | **Comfort and positive attitude** | Are users comfortable? |

**Examples of measures**

| Objective | Effectiveness | Efficiency | Satisfaction |
|---|---|---|---|
| Suitability for the task | % of goals achieved | Time to complete a task | Satisfaction rating |
| Appropriate for trained users | Number of power features used | Efficiency compared with an expert | Satisfaction with power features |
| Learnability | % of functions learned | Time to reach a learning criterion | Ease-of-learning rating |
| Error tolerance | % of errors corrected | Time spent correcting errors | Rating of error handling |

> **Use numbers to make goals testable, but don't let numbers replace understanding users.**

### Types of Prototypes

| Type | How it's used |
|---|---|
| **Throw-away** | Built quickly to test an idea, then **discarded** |
| **Incremental** | Parts built **separately**, then **combined** |
| **Evolutionary** | Repeatedly improved until it **becomes the final system** |

> **Own example:** A paper sketch of your app → **throw-away**. Building login first, then the dashboard, then payments → **incremental**. A beta app updated until v1.0 → **evolutionary**.

**Management issues:** reserve time for testing/redesign, plan iteration (not uncontrolled change), early prototypes may not show speed/security, contracts must allow revision.

### Prototyping Techniques

| Technique | Meaning |
|---|---|
| **Storyboards** | A **sequence of screens/events/actions**, on paper or animated. Good for discussing task flow cheaply |
| **Limited-functionality simulation** | Only **selected features** work, so users can test key interactions |
| **Wizard of Oz** | A **hidden person** performs a function that **appears automatic** (e.g. a "chatbot" whose replies are secretly typed by a researcher) |

> **Warning — Design inertia:** Weak early decisions **stay** just because the team already invested in them. Diagnose the **real** problem instead of patching symptoms.

### Design Rationale
A **record explaining why** a system was designed the way it is: questions, alternatives, evidence, arguments, criteria, decisions, trade-offs.

**Benefits:** communication across the life cycle, **reuse** of design knowledge, disciplined decisions, explains trade-offs, organizes many design options, preserves context.

| Type | Emphasis |
|---|---|
| **Process-oriented** | Preserves the **order of discussion and decisions** (e.g. IBIS) |
| **Structure-oriented** | Organizes **alternatives and relationships**, often after the discussion (e.g. QOC) |

**IBIS (Issue-Based Information System)**: process-oriented

| Element | Meaning | Example |
|---|---|---|
| **Issue** | A question/problem | How should students sign in? |
| **Position** | A possible answer | Password; one-time code; biometrics |
| **Argument** | Supports or objects to a position | OTP is safer but needs network access |
| **Sub-issue** | A smaller related question | How to recover access without signal? |

**gIBIS** = the **graphical** version of IBIS.

**QOC (Questions, Options, Criteria)**: structure-oriented, part of **design space analysis**

| Element | Role | Example |
|---|---|---|
| **Question** | The design problem | How should attendance be confirmed? |
| **Options** | Possible solutions | QR code, manual button, teacher scan |
| **Criteria** | Standards to compare options | Speed, privacy, accessibility, fraud prevention, offline use |

**DRL** is like QOC but with a **larger, more formal** language.

**Psychological design rationale:** studies how a design affects users' **tasks, thinking, behavior, strategies, and errors**. It's based on the **task-artifact cycle**:
> **Tools change how people do tasks, and changed tasks create new needs for tools.**

> **Own example:** Online class tools (artifact) changed how students submit work (task). That created new needs, like **file-size limits and upload progress bars**.

---

## 5. HCI Design Rules

**Design rules** are reusable statements that **guide or evaluate** interface decisions.

### Types of Design Rules

| Type | Generality | Authority | Best use | Example |
|---|---|---|---|---|
| **Principle** | **High** | Lower | Framing early decisions | "Make system status observable" |
| **Guideline** | Medium–high | **Advisory** | Choosing and reviewing details | "Use labels beside unfamiliar icons" |
| **Standard** | Usually **specific** | **High** | Meeting agreed requirements | ISO accessibility/ergonomic requirement |
| **Heuristic** | Broad | Advisory | **Rapid expert inspection** | "Prevent errors and support recovery" |
| **Design pattern** | Context-specific | Practice-based | Reusing a **proven solution** | "Safe place to return to" (Home) |

> **Standards** have the **highest authority** but the **most limited scope**. **Principles** are the most **general**.

**Why judgment is still needed:** Rules can **conflict** (more info = more visibility, but also more cognitive load). Check the **user goal, context, consequences, and evidence**.

**ISO 9241:** users achieve goals **effectively, efficiently, and satisfactorily** in a specified context.

### Usability Principles: Learnability, Flexibility, Robustness

| Quality | Central question | Simple test |
|---|---|---|
| **Learnability** | Can a new/returning user figure out what to do? | First-time user does a task without coaching |
| **Flexibility** | Can user and system work together in more than one way? | Check shortcuts / shifting responsibility |
| **Robustness** | Can users see progress, finish goals, and recover? | Interrupt a task or trigger a safe error |

**Learnability**

| Principle | Meaning | Example |
|---|---|---|
| **Predictability** | Guess the result of an action from what you've seen | Save icon works the same everywhere |
| **Synthesizability** | Understand how **past actions changed** the system | After uploading: status shows "Submitted" + timestamp |
| **Familiarity** | Uses knowledge users **already have** | Trash-bin icon = delete |
| **Generalizability** | Knowledge **transfers** to other parts | Swipe-left archives everywhere, not deletes in one place |
| **Consistency** | Similar situations → similar language, look, behavior | "Submit" always means final submission |

**Flexibility**

| Principle | Meaning | Example |
|---|---|---|
| **Dialogue initiative** | Don't force unnecessary sequences; let the user lead | Search or shortcuts instead of long menus |
| **Multithreading** | Supports **more than one task** at a time | Unfinished post stays while you check a file in another tab |
| **Task migratability** | Responsibility **moves between user and system** | Maps app suggests a route; driver accepts or changes it |
| **Substitutivity** | **Equivalent inputs/outputs** can replace each other | Type a date or pick from a calendar; list or grid view |
| **Customizability** | Changed by the **user (adaptability)** or by the **system (adaptivity)** | Text size setting = adaptable; recommendations = adaptive |

**Robustness**

| Principle | Meaning | Example |
|---|---|---|
| **Observability** | Users can see the **system's state** | Upload bar with file name, %, done state |
| **Recoverability** | Users can **fix errors**. **Backward** = undo; **forward** = fix and continue | Undo (backward); highlight a missing field without clearing others (forward) |
| **Responsiveness** | System communicates in a time/way users understand | Progress indicator instead of a frozen screen |
| **Task conformance** | Provides the needed functions (**task completeness**) in a way that fits the work (**task adequacy**) | — |

> **Mnemonic:** **L**earn, **F**lex, **R**ecover. Learnability = **"PS FGC"** (**P**lease **S**tudy **F**or **G**reat **C**hances): Predictability, Synthesizability, Familiarity, Generalizability, Consistency.

### Shneiderman's Eight Golden Rules

| # | Rule | Example |
|---|---|---|
| 1 | **Strive for consistency** | "Submit" always means final submission |
| 2 | **Enable shortcuts** (for frequent users) | Keyboard shortcuts, recent items, autofill |
| 3 | **Offer informative feedback** | "Saved," upload progress, clear validation message |
| 4 | **Design for closure** (clear beginning, middle, end) | Enrollment confirmation + next steps |
| 5 | **Prevent and handle errors** | Disable impossible dates, explain how to fix input |
| 6 | **Permit easy reversal** | "Recently Deleted" folder, Undo, Cancel |
| 7 | **Keep users in control** | Ask before destructive actions; let users stop a process |
| 8 | **Reduce short-term memory load** | Show password rules **beside** the field |

> **Mnemonic:** **C**ats **S**leep **F**or **C**omfort, **P**urring **R**elaxes **C**at **M**inds = Consistency, Shortcuts, Feedback, Closure, Prevent errors, Reversal, Control, Memory

### Norman's Seven Principles
1. Use **knowledge in the world** and **knowledge in the head**
2. **Simplify the structure** of tasks
3. **Make things visible**
4. **Get the mappings right**
5. Use **natural and artificial constraints**
6. **Design for error** (expect slips and mistakes)
7. **When all else fails, standardize**

### From Rule to Design Decision
Never just say "it's confusing." Use: **Evidence → Rule → Consequence → Recommendation**

| Part | Example |
|---|---|
| **Evidence** | Delete and Archive icons have no labels and the same gray style |
| **Rule** | Familiarity, consistency, error prevention, visible knowledge |
| **Consequence** | A first-time user may delete a message by mistake |
| **Recommendation** | Add labels, make Delete look different, provide Undo |

### Design Patterns
A **reusable solution** to a **recurring problem** in a specific context. The idea came from **architecture**. A pattern describes: **Context, Problem, Forces (trade-offs), Solution, Consequences.**

> **Example: "Safe place to return to":** give a stable **Home** so lost users can get back.

Linked patterns form a **pattern language**.

### Modern Systems (AI, Accessibility)
- **AI interfaces:** show capabilities and limits, keep user control (edit/reject/stop), give feedback during generation, be consistent, reduce memory load, prevent irreversible actions.
- **Accessibility:** don't rely on **color alone**; readable text, clear focus order, big enough targets, descriptive labels, keyboard support.

---

## 6. HCI Implementation Support

**Implementation support** = tools, services, and architectures that help developers turn designs into working interfaces. **Tools should support the design, not decide it.**

### Key Terms

| Term | Meaning |
|---|---|
| **Windowing system** | Low-level support for windows, input devices, graphics, shared display |
| **Toolkit** | Collection of reusable **interaction objects** (buttons, menus, fields, dialogs) |
| **Widget** | A reusable interface object = visible presentation + behavior |
| **UIMS** (User Interface Management System) | Separates and coordinates **presentation, dialogue, and application** functions |
| **Event** | A meaningful occurrence: click, key press, touch, timer, data update |
| **Callback** | Code registered to run **when an event happens** |
| **Feedback** | Visible, audible, or haptic response |

### Layers of Implementation Support

| Layer | Main service | Benefit |
|---|---|---|
| **Windowing system** (lowest) | Manages display and input: windows, pixels, pointer, focus | **Device independence**, multiple apps at once |
| **Interaction toolkit** | Reusable objects: buttons, menus, fields | **Consistency**, faster development, reuse |
| **UIMS** (highest) | Coordinates presentation, dialogue, application | **Separation of concerns**, portability |

### Windowing Systems
- **Device independence:** apps request "draw a line / get pointer position" through an **abstract interface**; drivers handle the actual hardware → **portability**.
- **Resource sharing:** coordinates screen, keyboard, pointer, clipboard, and audio among many apps; decides **which window gets input (focus)**.

**Three architectural choices**

| Architecture | Strength | Limitation |
|---|---|---|
| Each **application** manages processes | Maximum control | Every app handles sync; poor portability |
| Management in the **OS kernel** | Strong integration | Tied to that OS |
| Management as a **separate service** | Portability, modularity | Communication boundaries must be designed |

**Client-server (X Window System):** apps are **clients** requesting display services from a **server** (tied to the user's display). A **window manager** handles focus and overlapping/tiled windows. "Server" = display provider, not necessarily a remote computer.

### Programming the Dialogue

| Approach | How it works | Best fit | Risk |
|---|---|---|---|
| **Read-evaluation loop** | A central loop reads an event, checks its type, runs matching code | Simple, sequenced/**modal** interaction | Loop gets complicated |
| **Notification-based** | Components register **callbacks**; the system calls them when events happen | Graphical, **non-modal**, event-driven UIs | State scattered across handlers |

```
Central event loop                 Notification-based
repeat                             saveButton.onClick(save)
  event = readEvent()              quitButton.onClick(quit)
  if event is SAVE: save()
  if event is QUIT: quit()         function save(event):
until finished                       store current work
```

- **Modal** = you **must respond** to the dialog before doing anything else (use sparingly).
- **Non-modal** = you can **keep working elsewhere** while it's open.
- **"Going with the grain":** every framework makes some structures easier. Don't let what's **easiest to code** decide the user experience.

> **Own example:** "Are you sure you want to delete?" pop-up = **modal**. Messenger chat bubble while browsing = **non-modal**.

### Interaction Toolkits
Provide reusable **widgets**, event handling, consistent look and feel, and accessibility info. Lesson examples: **Java AWT** (basic, platform-oriented) and **Swing** (higher-level, model-view separation). Modern: HTML, Android/iOS UI, JavaFX, .NET, Flutter, React.

> **Native semantics before custom appearance:** use built-in controls first. Custom-drawn ones may lose keyboard support, focus, and screen-reader info.

### UIMS: Why Separate Presentation from Semantics?
**Portability, reusability, multiple interfaces** (desktop/mobile/voice), **customizability, testability**.

### Conceptual Architectures

**Seeheim Model**: separates:
1. **Presentation**: perceivable input/output
2. **Dialogue control**: interaction sequence and structure
3. **Application interface (semantics)**: connects to functions and data

**Levels of feedback**

| Level | Meaning | Example |
|---|---|---|
| **Lexical** | Immediate physical/display response | Pointer moves; button looks pressed |
| **Syntactic** | Shows a valid interaction structure | Menu item highlights on hover |
| **Semantic** | Reflects application meaning/data | Cart total updates after adding an item |

> Semantic feedback is slower (needs processing); fast lexical/syntactic feedback **reassures** users input was received.

**Arch/Slinky Model:** refines the layers; the "slinky" means layers can be **thicker or thinner** depending on the system (a drawing app is presentation-heavy; a data system is logic-heavy).

### Component Models: MVC and PAC

| Model | Parts | Main idea |
|---|---|---|
| **MVC** | **Model** (stores logical state) · **View** (renders it) · **Controller** (interprets input) | Perfect separation is uncommon |
| **PAC** | **Presentation** (input/output) · **Abstraction** (logical state) · **Control** (mediates, connects agents) | Clean for hierarchies and multiple views, less common in frameworks |

> **Watch out:** In **MVC**, the **Model** holds the data. In **PAC**, the **Abstraction** holds the data.

**Tracing "Add to Cart" through MVC:**
1. User taps Add to Cart → 2. **Controller** interprets the event → 3. **Model** updates the cart and total → 4. **View** shows the new quantity/price → 5. User evaluates the feedback.

Bug hunting: can't reach the button by keyboard → presentation/input. Wrong total → model. Model updates but the screen doesn't → broken model-view link.

### Specifying Dialogue

| Technique | Useful for | Watch out |
|---|---|---|
| **State-transition diagram** | States, events, transitions | Too many states/arrows in big systems |
| **Event language/handlers** | Mapping events to actions | Overall journey hard to see |
| **Declarative UI** | Stating what the UI should be | Runtime behavior still needs reasoning |
| **Constraints** | Relationships that must stay true | Conflicts are hard to diagnose |
| **Graphical specification** | Drawing components and linking actions | May **hide global paths** |

**Drift of dialogue control:** dialogue can live **inside** the app, in a **separate** controller, or **near presentation** (visual tools). Each affects testability and flow visibility.

**Modern principles:** one clear source of truth, immediate acknowledgment, don't freeze during long tasks (show progress, allow cancel), keep user data on errors, test keyboard/screen readers/zoom, don't leak private data in logs, test **whole task flows**.

---

## 7. HCI Evaluation Techniques

**Evaluation** = systematically collecting and interpreting evidence about a design. It's **not a final inspection**; it happens **throughout** the life cycle.

| Term | Meaning |
|---|---|
| **Usability problem** | A feature that makes a task ineffective, inefficient, unsafe, confusing, or unsatisfying |
| **Inspection method** | Evaluation by **experts** (no users) |
| **Usability testing** | Watching **representative users** do **representative tasks** |
| **Qualitative data** | Descriptions, comments, behaviors, themes |
| **Quantitative data** | Numbers: time, errors, completion rate, ratings |
| **Formative evaluation** | To **improve** a design **during** development |
| **Summative evaluation** | To **judge** a finished system against goals |

> **Memory trick:** **Form**ative = still **form**ing. **Sum**mative = the final **sum**-up.

### Three Goals of Evaluation
1. **Assess functionality**: does it provide and correctly perform the required services?
2. **Assess the effect on the user**: performance, understanding, workload, satisfaction
3. **Identify specific problems**: where, when, why interaction breaks down

### Evaluation Across the Life Cycle

| Stage | Artifact | Methods |
|---|---|---|
| Early concept | Scenario, storyboard, sketch | Review, walkthrough, interview |
| Prototype | Paper/interactive prototype | Think aloud, heuristic evaluation, cooperative evaluation |
| Implementation | Working system | Usability test, experiment, logging, questionnaire |
| Use over time | Deployed system | Field study, diary, interview, analytics |

### Evaluation WITHOUT Users (Expert Inspection)
Efficient, but **can't replace real users**: experts **predict** problems; users **reveal** them.

**Cognitive Walkthrough**: focuses on **learnability** (can a **new user** discover the right action?)
- Prep: define users & what they know, choose a task, list the correct action sequence, prepare the prototype.
- **Four questions at each step:**
  1. Will the user try to achieve the **correct goal**?
  2. Will the user **notice** the correct action is available?
  3. Will the user **connect** the action with the goal?
  4. Will the user **understand the feedback** and know progress was made?

**Heuristic Evaluation**: **several experts independently** check the interface against usability principles (heuristics), then combine findings.
Record: **Location, Evidence, Heuristic violated, Consequence, Severity, Recommendation.**
> Domain-specific heuristics can catch issues generic lists miss.

**Review-based:** uses **published research** (check if it transfers to your users/context).
**Model-based:** uses a predictive model, like **GOMS** = **G**oals, **O**perators, **M**ethods, **S**election rules (estimates skilled performance).
**Design rationale:** past decisions show what to evaluate.

### Evaluation WITH Users

| Setting | Advantages | Limitations | Best for |
|---|---|---|---|
| **Laboratory** | Controlled, equipment, fewer interruptions | **Artificial** context | Focused comparisons, risky tasks |
| **Field** | **Natural** setting, real context, long-term | Noise, less control; being watched changes behavior | Context-dependent work, mobile, long-term use |
| **Remote** | Wide reach, own devices, cheap | Setup issues, less visibility, privacy | Distributed users |

**Artifacts:** **simulation** (imitates behavior), **prototype** (enough to explore flow), **full implementation** (real performance).

### Experimental Evaluation
Tests a **hypothesis** under **controlled** conditions.

| Factor | Meaning | Example |
|---|---|---|
| **Participants** | Represent target users | First-year students new to the portal |
| **Independent variable (IV)** | What you **deliberately change** | Menu: alphabetical vs task-based |
| **Dependent variable (DV)** | What you **measure** | Completion time, errors, rating |
| **Hypothesis** | Testable prediction linking IV → DV | "Task-based menus reduce completion time" |
| **Null hypothesis** | Says **no difference** | "Menu type won't change completion time" |
| **Experimental design** | Assignment, order, controls, analysis | Counterbalanced within-participant |

> **Memory trick:** **I** change the **I**ndependent variable; the **D**ependent variable **D**epends on it.

> **Measure more than speed:** faster isn't better if users make more serious errors. Define measures **before** collecting data.

### Observational Methods

| Method | How | Watch out |
|---|---|---|
| **Think aloud** | User **says what they're thinking** while doing the task | Talking may change performance; don't teach or defend the UI |
| **Cooperative evaluation** | User **and evaluator can ask each other** questions | May influence behavior; record when help was given |
| **Post-task walkthrough** | Replay the recording; user **explains** their actions afterward | Memory may reconstruct events |

**Protocol analysis (recording methods)**

| Record | Strength | Limitation |
|---|---|---|
| **Paper & pencil notes** | Cheap, easy | Limited by writing speed |
| **Audio** | Captures think-aloud | Hard to match with screen events |
| **Video/screen recording** | Accurate sequence | Obtrusive; consent, storage, analysis burden |
| **Interaction logging** | Automatic timing, paths, errors | Lots of data; **doesn't show intention** |
| **User diary/notebook** | Good for long-term use | Delayed, subjective, incomplete |

### Query Techniques
- **Interviews**: flexible, in-depth; time-consuming, affected by memory and wording. Use neutral prompts: *"What did you expect to happen?"*
- **Questionnaires**: same questions to many people, easy to compare; less flexible.

| Question style | Example |
|---|---|
| **General/factual** | How often do you use this service? |
| **Open-ended** | What was most difficult and why? |
| **Scalar** | Easy to use: 1 (strongly disagree) to 5 (strongly agree) |
| **Multiple choice** | Which device did you use? |
| **Ranked** | Rank these three layouts |

> Avoid **double questions, leading wording, undefined terms, overlapping choices, scales that flip direction**. **Pilot** it first.

### Eye Tracking & Physiological Measures
- **Fixation**: gaze stays on one spot (may mean attention or difficulty)
- **Saccade**: rapid jump between points
- **Scan path**: the sequence of gaze movements
- **Physiological**: heart rate, blood pressure, **GSR** (galvanic skin response), **EMG** (muscles), **EEG** (brain)

| Can indicate | Can't prove alone |
|---|---|
| Where attention goes | What the user understood or intended |
| Change in arousal | Whether the emotion was positive/negative or caused by the UI |
| When a response happened | Which usability problem caused it |

### Choosing a Method
**Start with the evaluation question.** Then consider: stage, setting, type of evidence (subjective/objective, qualitative/quantitative), level of detail, interference, participants, resources, **ethics** (consent, privacy, withdrawal).

**Triangulation / mixed methods:** no single method reveals everything. Inspect → observe users → ask follow-ups → compare. Agreement = more confidence.

**AI-assisted evaluation:** can help with transcription and clustering, but findings are **leads for human review**, not final truth.

---

## 8. Universal Design & User Support

### Universal Design
Designing so **more people** can use a product comfortably, planning for different **abilities, situations, ages, and interaction methods** from the start.

**7 Principles of Universal Design**

| Principle | Example |
|---|---|
| **1. Equitable use** | Form works with both mouse **and** keyboard |
| **2. Flexibility in use** | Type a search **or** use voice |
| **3. Simple and intuitive use** | Payment screen shows the next step in plain language |
| **4. Perceptible information** | Video captions; phone shows a visual alert **with** sound |
| **5. Tolerance for error** | Confirm before deleting + Undo |
| **6. Low physical effort** | Form **saves progress** so you don't retype |
| **7. Size and space for approach and use** | Kiosk controls reachable by people of different heights |

> **Mnemonic:** **E**very **F**riend **S**hould **P**ractice **T**olerance, **L**ove, and **S**pace

### Multi-sensory Interaction

| Term | Meaning | Example |
|---|---|---|
| **Multimodal** | Uses **different senses** (sight, hearing, touch) | Phone shows a message, plays a sound, vibrates |
| **Multimedia** | Uses **different content forms** (text, images, video) | Text + images + silent video are all **visual** (same sense) |

> **Trap:** Multimedia ≠ multimodal. Multimedia can still use just **one sense**.

**Speech & sound**
- **Speech recognition**: spoken input → text/commands (dictation). Struggles with noise, accents.
- **Speech synthesis**: system **speaks** output (screen readers). Keep on-screen text too.
- **Auditory icon**: a **real-world sound** with natural meaning (camera **shutter** sound)
- **Earcon**: a **designed sequence of tones** (distinct success/error beeps)

> **Memory trick:** **Ear**con = **ear**-made-up tune. **Auditory icon** = **actual** real sound.

**Touch, handwriting, gestures**
- **Haptic feedback**: communicates through **touch** (vibration after a tap; **refreshable Braille display**)
- **Handwriting input**: stylus writing (style affects recognition)
- **Gestures**: swipe/point; unfamiliar gestures need a **visible alternative** (Back button + swipe back)

**Different users & situations:** captions on a noisy commute, screen readers for blind users, voice/large controls for limited hand movement, readable text for older users. **Test with diverse users**; consider language and culture.

### User Support
Help that lets people learn a feature, complete a task, or recover from a problem.

| Type | Meaning | Example |
|---|---|---|
| **Help message** | Answers a **specific question** | "Your file is over 25 MB. Compress it or choose a smaller file" (not just "Upload error") |
| **Documentation** | Explains **more of the system** | User manual |
| **Context-sensitive help** | Help tied to **what you're doing now** | Tooltip on an unfamiliar icon; password rules shown **before** you submit |
| **Tutorial** | **Teaches** how to do a task | Onboarding walkthrough |
| **Wizard** | **Guides step by step**, next steps depend on your answers | Account recovery: email → code → new password |
| **Adaptable support** | **User chooses** the help type | Beginner mode, language setting |
| **Adaptive support** | **System changes** help based on behavior | Coding app offers a hint after repeated errors (must be dismissible) |

**Good help:** easy to find, accurate, consistent, easy to dismiss, uses familiar words, gives **specific next steps**, and is updated when the app changes.

---

## Quick Check

1. What is the difference between a framework and a paradigm?
2. A door handle is an example of an affordance, a signifier, or both?
3. Four knobs in a straight line controlling burners arranged in a square is an example of poor ___.
4. What does "design" mean in HCI, in four words?
5. What is the golden rule of HCI design?
6. Verification vs validation: which asks "Are we building the right product?"
7. Which prototype is discarded after testing?
8. In a Wizard of Oz prototype, who performs the "automatic" function?
9. IBIS elements: Issue, ___, Argument, Sub-issue.
10. QOC stands for?
11. Which design rule type has the highest authority but narrowest scope?
12. A user can type a date or pick it from a calendar. Which flexibility principle?
13. Undo is ___ recovery; highlighting a missing field so you can fix it is ___ recovery.
14. In MVC, which part stores the data?
15. A pop-up you must answer before continuing is ___ interaction.
16. Which evaluation method focuses on whether a new user can discover the correct action?
17. In an experiment comparing two menu layouts by completion time, what are the IV and the DV?
18. Formative vs summative: which is done during development to improve the design?
19. A camera shutter sound is an ___; a designed success beep is an ___.
20. Name the three ISO 9241 usability categories.

<details>
<summary>Answers</summary>

1. A paradigm is a broad **way of thinking**; a framework is a **structured guide** for analyzing/designing/evaluating
2. **Both**
3. **Mapping**
4. **Achieving goals within constraints**
5. **Understand computers and understand people**
6. **Validation**
7. **Throw-away**
8. A **hidden person**
9. **Position**
10. **Questions, Options, Criteria**
11. **Standard**
12. **Substitutivity**
13. **Backward**; **forward**
14. **Model**
15. **Modal**
16. **Cognitive walkthrough**
17. IV = **menu layout**; DV = **completion time**
18. **Formative**
19. **Auditory icon**; **earcon**
20. **Effectiveness, Efficiency, Satisfaction**

</details>
