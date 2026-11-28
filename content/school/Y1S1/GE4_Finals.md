# GE4 Mathematics in the Modern World — Finals
**Covers:** Unit 5 (Statistics Basics & Levels of Measurement) · Unit 6 (Measures of Central Tendency, Ungrouped Data) · Unit 7 (Grouped Data) · Unit 8 (Graph Theory) · Unit 9 (Linear Programming, Corner-Point Method)

> **How to use this:** Every math topic has 3 parts: **① the idea in plain words → ② the rule/formula → ③ a worked example, step by step.** The actual exam items are worked out in full and marked **📌 (exam item)**. Each unit ends with a practice quiz, and there is a mixed **Mock Exam** at the very end. Do the quizzes without looking, then read the explanations for the ones you missed.

---

## UNIT 5 — STATISTICS BASICS

### 5.1 What is Statistics?
- **Statistics** = the science of **collecting, organizing, analyzing, and interpreting data** to make decisions.
- **Data** = the facts or numbers we collect (scores, heights, shoe sizes, answers to a survey).

### 5.2 Population vs Sample
| Term | Meaning | Example |
|---|---|---|
| **Population** | The **WHOLE group** you want to study | **All** first-year students of the university |
| **Sample** | A **PART (subset)** of the population that you actually measure | **50** first-year students picked from the list |

### 5.3 Parameter vs Statistic
| Term | Describes the… | Example |
|---|---|---|
| **Parameter** | **POPULATION** | The average age of **all** first-year students is 18.4 |
| **Statistic** | **SAMPLE** | The average age of the **50 students surveyed** is 18.6 |

> 🔑 Memory trick: **P**arameter → **P**opulation. **S**tatistic → **S**ample.

> ⚠️ "Statistics" (the subject) and "a statistic" (a number that describes a sample) are different things. In exam items, "statistic" usually means the second one.

### 5.4 Levels of Measurement (lowest → highest)
Data can be measured at 4 levels. Each level has **everything the level below it has, plus one more feature**.

| Level | What you can do | Has a true zero? | Examples |
|---|---|---|---|
| **① Nominal** | **Names / labels / categories only**. No order. | No | Gender, religion, blood type, jersey number, civil status, course (BSIT, BSN) |
| **② Ordinal** | Categories **with a specific ORDER / RANK**, but the gaps between ranks are not equal | No | Class rank (1st, 2nd, 3rd), satisfaction (poor, fair, good, excellent), year level, military rank, Likert scale |
| **③ Interval** | Ordered, **equal gaps** between values, but **NO true zero** (zero does not mean "nothing") | No | Temperature in °C or °F, IQ score, calendar year |
| **④ Ratio** | Ordered, equal gaps, **AND a TRUE zero** (zero means "none") | **Yes** | Height, weight, age, income, number of children, distance, time to finish a race |

> 🔑 **Ordinal = the values have a specific order.** If the question says "ranked" or "in order" but you cannot measure the exact gap, it's **ordinal**.
> 🔑 **Interval vs Ratio test:** ask "Does 0 mean NONE?" 0 kg = no weight → **ratio**. 0 °C is not "no temperature" → **interval**.

> ⚠️ A jersey number (#23) is a **number** but it is **nominal**. It is only a label. You can't say #23 is "better" than #10.
> ⚠️ 20 °C is NOT "twice as hot" as 10 °C (interval: no true zero, so ratios mean nothing). But 20 kg IS twice 10 kg (ratio).

---

## 📝 UNIT 5 QUIZ

```quiz
Q: The whole group of people or things you want to study is called the:
* Population
- Sample
- Parameter
- Statistic

Q: A number that describes a SAMPLE is called a:
* Statistic
- Parameter
- Population
- Variable
> Parameter goes with Population; Statistic goes with Sample.

Q: "The average allowance of ALL 3,000 students in the school is ₱150." The ₱150 is a:
* Parameter
- Statistic
- Sample
- Nominal value
> It describes the whole population, so it is a parameter.

Q: A researcher surveys 100 out of 3,000 students. The 100 students are the:
* Sample
- Population
- Parameter
- Statistic

Q: Which level of measurement has values with a specific order but unequal gaps?
* Ordinal
- Nominal
- Interval
- Ratio

Q: Blood type (A, B, AB, O) is measured at what level?
* Nominal
- Ordinal
- Interval
- Ratio
> Labels only, no order.

Q: Temperature in degrees Celsius is measured at what level?
* Interval
- Ratio
- Ordinal
- Nominal
> Equal gaps, but 0 °C does not mean "no temperature."

Q: Weight in kilograms is measured at what level?
* Ratio
- Interval
- Ordinal
- Nominal
> 0 kg means no weight at all, so it has a true zero.

Q: A customer rates service as poor, fair, good, or excellent. This is:
* Ordinal
- Nominal
- Interval
- Ratio

Q: A basketball player's jersey number is measured at what level?
* Nominal
- Ordinal
- Interval
- Ratio
> It is a number, but only a label.

Q: Which level is the ONLY one with a true zero?
* Ratio
- Interval
- Ordinal
- Nominal
```

---

## UNIT 6 — MEASURES OF CENTRAL TENDENCY (UNGROUPED DATA)

A **measure of central tendency** is **one number that represents the "center" or typical value** of a data set. The three main ones are the **mean, median, and mode**.

### 6.1 The Mean (average)
- **Idea:** add everything up, then divide by how many there are.
- **Formula:** **x̄ = Σx / n** (Σ = "sum of", n = number of values)

**📌 Worked example (exam item):** Find the mean of **70, 72, 77, 78, 86, 84, 79**.
- **Step 1:** add → 70 + 72 + 77 + 78 + 86 + 84 + 79 = **546**
- **Step 2:** count → n = **7**
- **Step 3:** divide → 546 / 7 = **78**
- ✅ **Mean = 78**

> 🔑 **The mean is the measure that is GREATLY AFFECTED BY EXTREME SCORES (outliers).** One very high or very low value pulls it up or down.

### 6.2 The Median (middle value)
- **Idea:** the value in the **middle** after you **sort** the data.
- **Step 1 is ALWAYS: arrange from lowest to highest.**

| n is… | Median is… | Position |
|---|---|---|
| **Odd** | the **single middle** value | position (n + 1)/2 |
| **Even** | the **average of the 2 middle** values | average of positions n/2 and n/2 + 1 |

**📌 Worked example (exam item):** Blood pressure readings **135, 121, 119, 116, 130, 121, 131**. Find the median.
- **Step 1:** sort → **116, 119, 121, 121, 130, 131, 135**
- **Step 2:** n = 7 (odd), middle position = (7 + 1)/2 = **4th**
- **Step 3:** the 4th value is **121**
- ✅ **Median = 121**

**Worked example (even n):** 4, 8, 10, 12
- Already sorted, n = 4 (even) → the 2 middle values are **8 and 10**
- Median = (8 + 10)/2 = **9**

> ⚠️ The #1 median mistake: **forgetting to sort first.** In the BP example, the unsorted middle value is 116, which is wrong.

### 6.3 The Mode (most frequent)
- **Idea:** the value that appears **most often**.

| Type | Meaning | Example |
|---|---|---|
| **No mode** | No value repeats (or all appear equally often) | 2, 4, 6, 8 → no mode |
| **Unimodal** | **One** mode | 5, 7, 7, 9, 12 → mode **7** |
| **Bimodal** | **Two** modes | 8, 8, 9, 10, 10 → modes **8 and 10** |
| **Multimodal** | More than two modes | 1, 1, 2, 2, 3, 3, 4 → modes 1, 2, 3 |

> 🔑 The mode is the **only** measure you can use for **nominal** data (e.g., the most common blood type, the most saleable shoe size).

**📌 Worked example (exam item):** **8, 8, 9, 10, 10**
- **Mean:** (8 + 8 + 9 + 10 + 10)/5 = 45/5 = **9**
- **Median:** already sorted, n = 5 (odd) → 3rd value = **9**
- **Mode:** 8 appears twice, 10 appears twice → **bimodal: 8 and 10**
- ✅ **Mean = Median (both 9)**, and the data is bimodal.

**Worked example:** **5, 7, 7, 9, 12** → Mean = 40/5 = **8** · Median = 3rd value = **7** · Mode = **7**

### 6.4 The Weighted Mean
- **Idea:** use when the values **do not count equally**. Each value has a **weight** (how many units, how many items, how many hours).
- **Formula:** **x̄w = Σ(w·x) / Σw**

**📌 Worked example (exam item):** A store sold **1,000 items at ₱10, 500 at ₱20, 500 at ₱25, and 100 at ₱30**. Find the weighted mean price.

| Price (x) | Quantity (w) | w·x |
|---|---|---|
| 10 | 1,000 | 10,000 |
| 20 | 500 | 10,000 |
| 25 | 500 | 12,500 |
| 30 | 100 | 3,000 |
| **Total** | **Σw = 2,100** | **Σwx = 35,500** |

- 35,500 / 2,100 = 16.904… ✅ **Weighted mean ≈ ₱16.90**

> ⚠️ Do NOT just average the 4 prices: (10 + 20 + 25 + 30)/4 = 21.25 is wrong because most items were sold at ₱10.

**Worked example (grades):** 3 units with grade 90, 2 units with 85, 1 unit with 80.
- Σwx = 3(90) + 2(85) + 1(80) = 270 + 170 + 80 = **520**; Σw = **6**
- 520 / 6 = 86.666… ✅ **≈ 86.67**

### 6.5 📌 The "Jabez" item: what extreme scores do to the mean
**The item:** Jabez's scores are 70, 72, 77, 78, 86, 84, 79 (mean = 78). If his **lowest** score is replaced with **20** and his **highest** with **100**, what is the new mean? Choices: **78.00 / 77.91 / 74.70 / 73.86**.

**Doing it strictly as worded:**
- Lowest = 70 → becomes 20. Highest = 86 → becomes 100.
- New sum = 546 − 70 + 20 − 86 + 100 = **510**
- 510 / 7 = **72.86**, which is **NOT one of the choices.**

**The closest choice (and likely answer key): 73.86**
- 73.86 × 7 = **517**. That happens if 70 → 20 and **79** (not 86) → 100: 546 − 70 + 20 − 79 + 100 = 517.
- So the key most likely replaced the **last** score (79) instead of the true highest (86), or the item has a typo.
- **Honest answer:** the strict math gives 72.86. On the exam, pick **73.86** (closest, and the only choice that comes from a "replace one low, one high" calculation). If you can, ask your teacher about it.

> 🔑 **The lesson the item is testing:** the mean dropped from **78** to the low 70s. One **extreme low score (20)** dragged the whole mean down, even though a higher score was also added. **The mean is greatly affected by extreme scores.** The median would barely move.

### 6.6 When to use which?
| Use the… | When… | Exam example |
|---|---|---|
| **Mode** | You want the **most common / most popular** item, or the data is **nominal** | **The most saleable shoe size** → **mode** |
| **Median** | The data has **outliers / extreme values** (skewed) | Household income in a barangay with one billionaire → **median** |
| **Mean** | The data is **fairly even, no outliers**, and you want to use every value | Average quiz score of a class |

> 🔑 Exam one-liners: **most saleable shoe size → MODE.** **Greatly affected by extreme scores → MEAN.** **Outliers present → use the MEDIAN.**

---

## 📝 UNIT 6 QUIZ

```quiz
Q: A shoe store wants to know which shoe size to stock the most. Which measure should it use?
* Mode
- Mean
- Median
- Weighted mean
> The most saleable size is the one that appears most often.

Q: Which measure of central tendency is greatly affected by extreme scores?
* Mean
- Median
- Mode
- None of them
> Every value is added into the mean, so one extreme value pulls it.

Q: What is the mean of 70, 72, 77, 78, 86, 84, 79?
* 78
- 77
- 79
- 78.5
> 546 / 7 = 78.

Q: What is the median of 135, 121, 119, 116, 130, 121, 131?
* 121
- 116
- 130
- 125
> Sorted: 116, 119, 121, 121, 130, 131, 135. The 4th value is 121.

Q: For the data 8, 8, 9, 10, 10, which statement is true?
* The mean equals the median
- The mean is greater than the median
- The mode is 9
- There is no mode
> Mean = 9, median = 9, modes = 8 and 10.

Q: What is the median of 4, 8, 10, 12?
* 9
- 8
- 10
- 8.5
> Even count: (8 + 10) / 2 = 9.

Q: For 5, 7, 7, 9, 12, what are the mean, median, and mode?
* Mean 8, median 7, mode 7
- Mean 7, median 7, mode 7
- Mean 8, median 8, mode 7
- Mean 8, median 7, mode 12

Q: A student has 3 units with a grade of 90, 2 units with 85, and 1 unit with 80. What is the weighted mean?
* 86.67
- 85.00
- 87.50
- 86.00
> 520 / 6 = 86.67. The plain average of 90, 85, 80 is 85, which ignores the units.

Q: A store sold 1,000 items at ₱10, 500 at ₱20, 500 at ₱25, and 100 at ₱30. What is the weighted mean price?
* ₱16.90
- ₱21.25
- ₱17.75
- ₱15.50
> 35,500 / 2,100 = 16.90.

Q: The data set 3, 6, 6, 8, 8, 11 is:
* Bimodal
- Unimodal
- Has no mode
- Multimodal with three modes

Q: Which measure is best for a data set with an extreme outlier?
* Median
- Mean
- Weighted mean
- Range

Q: What is the median of 12, 5, 9, 20, 3?
* 9
- 5
- 12
- 9.8
> Sorted: 3, 5, 9, 12, 20. The middle value is 9. 9.8 is the mean.
```

---

## UNIT 7 — GROUPED DATA (FREQUENCY DISTRIBUTION)

When there are many values, we group them into **classes** in a **frequency distribution table**.

### 7.1 Parts of a Frequency Table
Using the class **39–41** as an example:

| Term | Meaning | How to get it | For 39–41 |
|---|---|---|---|
| **Class limits** | The numbers you see written | lower limit and upper limit | LL = 39, UL = 41 |
| **Class boundaries** | The "real" limits with no gaps between classes | LL − 0.5 and UL + 0.5 | **38.5 – 41.5** |
| **Class size (i)** | The width of a class | difference between two consecutive lower limits (or UB − LB) | 42 − 39 = **3** |
| **Class mark (x)** | The midpoint of the class | (LL + UL)/2 | (39 + 41)/2 = **40** |
| **Frequency (f)** | How many values fall in the class | given | 8 |
| **Less-than cumulative frequency (<cf)** | Running total of f, **starting from the LOWEST class** | add f's from the bottom class up | 23 |
| **N (= Σf)** | Total number of values | add all f | 40 |
| **Σfx** | Sum of f × x | multiply each f by its x, then add | 1,624 |

> ⚠️ Class size is **NOT** UL − LL. For 39–41, 41 − 39 = 2 is **wrong**. The class covers 39, 40, 41 = **3** values.

### 7.2 Formulas for Grouped Data
| Measure | Formula | Where |
|---|---|---|
| **Mean** | **x̄ = Σfx / N** | x = class mark |
| **Modal class** | the class with the **highest frequency** | |
| **Mode** | **Mo = L + [d1 / (d1 + d2)] · i** | L = lower boundary of the modal class; d1 = f(modal) − f(class just **below** it in value); d2 = f(modal) − f(class just **above** it in value) |
| **Median** | **Md = L + [(N/2 − cf) / f] · i** | L = lower boundary of the median class; cf = <cf of the class **just before** (below) the median class; f = frequency of the median class |

> 🔑 **The median class** is the first class (counting from the lowest) whose **<cf reaches or passes N/2**.

> ⚠️ **cf is ALWAYS counted from the LOWEST class, even when the table is listed highest-first.** Many teachers list the table from the highest class at the top. If you add from the top, you will get the wrong median class.

### 7.3 📌 Full Worked Example (exam item)
The table is given **highest-first**. N = 40, i = 3.

| Class | f | x (class mark) | fx | Class boundaries | <cf (from the bottom) |
|---|---|---|---|---|---|
| 54–56 | 3 | 55 | 165 | 53.5–56.5 | 40 |
| 51–53 | 2 | 52 | 104 | 50.5–53.5 | 37 |
| 48–50 | 1 | 49 | 49 | 47.5–50.5 | 35 |
| 45–47 | 5 | 46 | 230 | 44.5–47.5 | 34 |
| 42–44 | 6 | 43 | 258 | 41.5–44.5 | 29 |
| **39–41** | **8** | **40** | **320** | **38.5–41.5** | **23** ← median class |
| 36–38 | 4 | 37 | 148 | 35.5–38.5 | 15 |
| 33–35 | 6 | 34 | 204 | 32.5–35.5 | 11 |
| 30–32 | 2 | 31 | 62 | 29.5–32.5 | 5 |
| 27–29 | 3 | 28 | 84 | 26.5–29.5 | 3 |
| **Total** | **N = 40** | | **Σfx = 1,624** | | |

**① Mean**
- x̄ = Σfx / N = 1,624 / 40 = ✅ **40.6**

**② Mode**
- **Step 1:** modal class = highest f = **39–41** (f = 8). Its class mark is **40**.
- **Step 2:** L = lower boundary = **38.5**
- **Step 3:** d1 = 8 − (f of the class below, 36–38) = 8 − 4 = **4**
- **Step 4:** d2 = 8 − (f of the class above, 42–44) = 8 − 6 = **2**
- **Step 5:** Mo = 38.5 + [4 / (4 + 2)] · 3 = 38.5 + (0.6667)(3) = 38.5 + 2 = ✅ **40.5**

**③ Median**
- **Step 1:** N/2 = 40/2 = **20**
- **Step 2:** build <cf **from the bottom**: 27–29 → **3**, 30–32 → **5**, 33–35 → **11**, 36–38 → **15**, 39–41 → **23**
- **Step 3:** first <cf that reaches 20 is **23** → median class = **39–41**
- **Step 4:** L = **38.5**, cf (of the class before, 36–38) = **15**, f = **8**, i = **3**
- **Step 5:** Md = 38.5 + [(20 − 15) / 8] · 3 = 38.5 + (0.625)(3) = 38.5 + 1.875 = ✅ **40.375 ≈ 40.38**

> ⚠️ If you count cf from the **top** (3, 5, 6, 11, 17, 25…), you'd land on 42–44 and get a wrong median. Always start from the lowest class.

### 7.4 Second Worked Example (practice)
| Class | f | x | fx | Boundaries | <cf |
|---|---|---|---|---|---|
| 10–14 | 2 | 12 | 24 | 9.5–14.5 | 2 |
| 15–19 | 5 | 17 | 85 | 14.5–19.5 | 7 |
| **20–24** | **8** | **22** | **176** | **19.5–24.5** | **15** |
| 25–29 | 4 | 27 | 108 | 24.5–29.5 | 19 |
| 30–34 | 1 | 32 | 32 | 29.5–34.5 | 20 |
| **Total** | **N = 20** | | **Σfx = 425** | | |

- **i = 5**
- **Mean** = 425 / 20 = **21.25**
- **Median:** N/2 = 10 → median class 20–24 (<cf 15 is the first ≥ 10). Md = 19.5 + [(10 − 7)/8] · 5 = 19.5 + 1.875 = **21.375 ≈ 21.38**
- **Mode:** modal class 20–24. d1 = 8 − 5 = 3, d2 = 8 − 4 = 4. Mo = 19.5 + [3/7] · 5 = 19.5 + 2.14 = **≈ 21.64**

---

## 📝 UNIT 7 QUIZ

```quiz
Q: What is the class mark of the class 39–41?
* 40
- 39.5
- 41.5
- 3
> (39 + 41) / 2 = 40.

Q: What are the class boundaries of the class 39–41?
* 38.5 – 41.5
- 39 – 41
- 39.5 – 40.5
- 38 – 42
> Subtract 0.5 from the lower limit and add 0.5 to the upper limit.

Q: What is the class size of a table with classes 27–29, 30–32, 33–35, ...?
* 3
- 2
- 2.5
- 30
> 30 − 27 = 3. Using 29 − 27 = 2 is the common mistake.

Q: What is the formula for the mean of grouped data?
* Σfx / N
- Σx / N
- Σf / n
- Σfx / i

Q: In a grouped table, the modal class is the class with the:
* Highest frequency
- Highest class mark
- Highest cumulative frequency
- Middle position

Q: A table is listed from the highest class at the top to the lowest at the bottom. Where do you start counting the less-than cumulative frequency?
* From the lowest class
- From the highest class
- From the middle class
- From the modal class

Q: In the exam table (N = 40, Σfx = 1,624), what is the mean?
* 40.6
- 40.5
- 40.38
- 41.6
> 1,624 / 40 = 40.6.

Q: In the exam table, the modal class 39–41 has f = 8. The class below it (36–38) has f = 4 and the class above it (42–44) has f = 6. What is the mode?
* 40.5
- 40.0
- 40.6
- 41.0
> 38.5 + (4 / 6)(3) = 40.5.

Q: In the exam table, N/2 = 20, the median class is 39–41, the cf before it is 15, and f = 8. What is the median?
* 40.38
- 40.50
- 40.60
- 39.88
> 38.5 + ((20 − 15) / 8)(3) = 40.375.

Q: For the table 10–14:2, 15–19:5, 20–24:8, 25–29:4, 30–34:1, what is the mean?
* 21.25
- 22.00
- 21.38
- 20.00
> Σfx = 425, N = 20, so 425 / 20 = 21.25.

Q: For the same table (10–14:2, 15–19:5, 20–24:8, 25–29:4, 30–34:1), what is the median?
* 21.38
- 21.25
- 22.00
- 21.64
> 19.5 + ((10 − 7) / 8)(5) = 21.375.

Q: For the same table, which is the modal class, and about what is the mode?
* 20–24, about 21.64
- 20–24, exactly 22
- 15–19, about 18.5
- 25–29, about 26.2
> 19.5 + (3 / 7)(5) ≈ 21.64.
```

---

## UNIT 8 — GRAPH THEORY

> ⚠️ In this unit, a **graph** is NOT a bar graph or line graph. It is a set of **dots (vertices)** connected by **lines (edges)**.

### 8.1 Definition of a Graph
A **graph** G is a **triple** made of:
1. **V(G)**, a **vertex set** (the dots),
2. **E(G)**, an **edge set** (the lines), and
3. a **relation** that links **each edge to a pair of vertices** (its **endpoints**).

### 8.2 Basic Terms
| Term | Meaning |
|---|---|
| **Vertex** (plural: vertices) | A point / dot / node |
| **Edge** | A line connecting two vertices |
| **Endpoints** | The two vertices an edge connects |
| **Adjacent** | Two vertices are adjacent if an **edge joins them** (they are "neighbors") |
| **Loop** | An edge whose **two endpoints are the same** vertex (it goes back to itself) |
| **Multiple edges** | Two or more edges with the **same pair of endpoints** |
| **Simple graph** | A graph with **no loops and no multiple edges** |
| **Degree of a vertex** | The number of edges touching it (a **loop counts 2**) |
| **Null graph** | A graph whose **vertex set and edge set are both empty** |
| **Finite graph** | Finite vertex set and finite edge set |
| **Infinite graph** | Has infinitely many vertices or edges |

```
   Loop at A          Multiple edges A–B        Simple graph
     _                     ___                  A —— B
    ( )                   /   \                 |    |
     A                   A     B                D —— C
                          \___/
```

### 8.3 Degree and the Handshake Theorem
> 🔑 **Handshake Theorem:** the **sum of the degrees of all vertices = 2 × (number of edges)**. Each edge has 2 ends, so it adds 2 to the total.

**Worked example:** the square A–B–C–D–A has 4 edges. Each vertex has degree 2, so the sum = 2 + 2 + 2 + 2 = **8 = 2 × 4** ✅
- Consequence: the sum of degrees is **always even**, so the number of odd-degree vertices is **always even**.

### 8.4 Paths, Cycles, and Connectedness
| Term | Meaning | Example (square A–B–C–D–A) |
|---|---|---|
| **Path** | A list of **distinct** vertices where **consecutive ones are adjacent** | A, B, C |
| **Cycle** | A path that **comes back to its start** (closed), with no repeated vertices except start = end | A, B, C, D, A |
| **Connected graph** | There is a **path between ANY two vertices** | The square is connected |
| **Disconnected graph** | At least one pair of vertices has **no path** between them | A–B and C–D with no edge between the pairs |

```
 Connected:           Disconnected:
 A —— B               A —— B      C —— D
 |    |               (no way to get from A to C)
 D —— C
```

### 8.5 Cliques and Independent Sets
| Term | Meaning | Memory trick |
|---|---|---|
| **Clique** | A set of vertices that are **pairwise adjacent** (every pair is joined by an edge) | A group of friends where **everyone knows everyone** |
| **Independent set** | A set of vertices that are **pairwise NON-adjacent** (no edge between any two of them) | A group of **total strangers** |

**Example:** in the square A–B–C–D–A, {A, B} is a clique (an edge joins them). {A, C} is an independent set (no edge A–C).
- **K_n (complete graph)** = n vertices, **every pair** joined. The whole K_n is a clique.

### 8.6 Graph Coloring and Chromatic Number
- **Coloring:** give each vertex a color so that **adjacent vertices have different colors**.
- **Chromatic number χ(G):** the **minimum number of colors** needed.

| Graph | Chromatic number | Why |
|---|---|---|
| **K_n** (complete graph) | **n** | Every vertex touches every other, so all need different colors |
| **Even cycle** (C4, C6, …) | **2** | Alternate red, blue, red, blue… it closes evenly |
| **Odd cycle** (C3, C5, …) | **3** | Alternating fails at the last vertex, so a 3rd color is needed |
| Graph with at least 1 edge, no odd cycles | 2 | |
| Graph with no edges | 1 | |

```
 Even cycle C4 (2 colors)     Odd cycle C3 / triangle (3 colors)
  R —— B                            R
  |    |                           / \
  B —— R                          B — G
```

### 8.7 Maps and the Four-Color Theorem
- A **map** is a **partition of the plane into connected regions** (like the provinces on a map of the Philippines).
- To color a map, regions that **share a border** must get different colors. Turn each region into a vertex and each shared border into an edge, then color the graph.
- 🔑 **Four-Color Theorem:** **every map can be colored with at most 4 colors** so that no two neighboring regions share a color.

> ⚠️ Regions that only touch at a **single point** (a corner) are NOT considered adjacent.

---

## 📝 UNIT 8 QUIZ

```quiz
Q: A graph is defined as a triple consisting of:
* A vertex set, an edge set, and a relation linking each edge to a pair of vertices
- A vertex set, a color set, and a region set
- An x-axis, a y-axis, and plotted points
- A set of numbers, an operation, and an identity

Q: An edge whose two endpoints are the same vertex is called a:
* Loop
- Multiple edge
- Cycle
- Path

Q: A simple graph is a graph with:
* No loops and no multiple edges
- No edges at all
- Exactly one cycle
- All vertices adjacent to each other

Q: A graph whose vertex set and edge set are both empty is called a:
* Null graph
- Simple graph
- Disconnected graph
- Finite graph

Q: A graph has 6 edges. What is the sum of the degrees of all its vertices?
* 12
- 6
- 3
- 36
> Handshake theorem: sum of degrees = 2 × edges.

Q: A list of distinct vertices in which consecutive vertices are adjacent is called a:
* Path
- Clique
- Loop
- Map

Q: A graph is connected if:
* There is a path between any two vertices
- Every vertex has a loop
- Every pair of vertices is adjacent
- It has no edges

Q: A set of vertices that are pairwise adjacent is called a:
* Clique
- Independent set
- Null graph
- Cycle

Q: A set of vertices where no two are adjacent is called a(n):
* Independent set
- Clique
- Path
- Complete graph

Q: What is the chromatic number of the complete graph K5?
* 5
- 4
- 3
- 2
> In K_n every vertex touches every other, so it needs n colors.

Q: What is the chromatic number of a cycle with 6 vertices (C6)?
* 2
- 3
- 6
- 4
> Even cycles alternate two colors.

Q: What is the chromatic number of a cycle with 5 vertices (C5)?
* 3
- 2
- 5
- 4
> Odd cycles need a third color.

Q: According to the Four-Color Theorem, what is the most number of colors needed to color any map?
* 4
- 3
- 5
- It depends on the number of regions
```

---

## UNIT 9 — LINEAR PROGRAMMING (CORNER-POINT METHOD)

**Linear programming (LP)** finds the **best** (maximum or minimum) value of something, like profit or cost, when you have **limits** (constraints).

### 9.1 Parts of an LP Problem
| Part | Meaning | Example |
|---|---|---|
| **Objective function** | What you want to **maximize or minimize** | Maximize P = 4x + 2y |
| **Constraints** | The **limits**, written as inequalities | x + y ≤ 5, x − y ≤ 1 |
| **Non-negativity constraints** | You can't make negative products | x ≥ 0, y ≥ 0 |
| **Feasible region** | The area on the graph where **ALL constraints are true at the same time** | The shaded polygon |
| **Corner points (vertices)** | The **corners** of the feasible region | (0,0), (1,0), (3,2), (0,5) |

> 🔑 **Corner-Point Theorem:** the maximum or minimum of the objective function always happens at a **corner point** of the feasible region. So you only need to test the corners.

### 9.2 The Steps
1. **Write** the objective function and constraints.
2. **Graph** each constraint as a line using its **intercepts** (set x = 0 to find y, set y = 0 to find x).
3. **Shade** the feasible region (for "≤" with x, y ≥ 0, it's usually the side **toward the origin**; test (0,0) if unsure).
4. **Find the corner points.** Intercepts give some; where two lines cross, solve the two equations by **elimination**.
5. **Evaluate** the objective function at every corner.
6. **Pick** the largest value (maximize) or the smallest value (minimize).

### 9.3 📌 Worked Example 1
**Maximize P = 4x + 2y** subject to x ≥ 0, y ≥ 0, **x + y ≤ 5**, **x − y ≤ 1**.

**Step 1: intercepts**
| Line | x = 0 | y = 0 |
|---|---|---|
| x + y = 5 | (0, 5) | (5, 0) |
| x − y = 1 | (0, −1) | (1, 0) |

**Step 2: shade.** Test (0,0): 0 + 0 ≤ 5 ✔, 0 − 0 ≤ 1 ✔ → the region contains the origin.

**Step 3: intersection by elimination**
```
  x + y = 5
+ x − y = 1
-----------
 2x     = 6   →  x = 3
 3 + y  = 5   →  y = 2      →  (3, 2)
```

**Step 4: corner points and evaluation**
| Corner | P = 4x + 2y | Value |
|---|---|---|
| (0, 0) | 4(0) + 2(0) | 0 |
| (1, 0) | 4(1) + 2(0) | 4 |
| **(3, 2)** | 4(3) + 2(2) | **16** ← max |
| (0, 5) | 4(0) + 2(5) | 10 |

✅ **Maximum P = 16 at (3, 2).**

> ⚠️ (5, 0) is NOT a corner: it breaks x − y ≤ 1 (5 − 0 = 5 > 1). Always check each point against **every** constraint.

### 9.4 📌 Worked Example 2
**Maximize P = 4x + 3y** subject to x ≥ 0, y ≥ 0, **2x + y ≤ 12**, **x + y ≤ 7**.

**Step 1: intercepts**
| Line | x = 0 | y = 0 |
|---|---|---|
| 2x + y = 12 | (0, 12) | (6, 0) |
| x + y = 7 | (0, 7) | (7, 0) |

The feasible region stays **under both lines**, so on the x-axis use the smaller intercept **(6, 0)**, and on the y-axis use the smaller intercept **(0, 7)**.

**Step 2: intersection by elimination**
```
  2x + y = 12
− ( x + y = 7 )
---------------
   x     = 5
   5 + y = 7   →  y = 2      →  (5, 2)
```

**Step 3: corner points and evaluation**
| Corner | P = 4x + 3y | Value |
|---|---|---|
| (0, 0) | 0 + 0 | 0 |
| (6, 0) | 24 + 0 | 24 |
| **(5, 2)** | 20 + 6 | **26** ← max |
| (0, 7) | 0 + 21 | 21 |

✅ **Maximum P = 26 at (5, 2).**

> ⚠️ (7, 0) and (0, 12) are intercepts but NOT corners. (7, 0) breaks 2x + y ≤ 12 (14 > 12), and (0, 12) breaks x + y ≤ 7.

### 9.5 Practice Examples (solved)
**A. Maximize P = 3x + 2y**, x, y ≥ 0, x + y ≤ 4, x + 3y ≤ 6.
- Intersection: subtract → 2y = 2 → y = 1, x = 3 → **(3, 1)**
- Corners: (0,0) → 0 · **(4,0) → 12** · (3,1) → 11 · (0,2) → 4
- ✅ **Max P = 12 at (4, 0)** (the max can be at an intercept corner, not always at the crossing point!)

**B. Maximize P = 5x + 4y**, x, y ≥ 0, 2x + y ≤ 8, x + 2y ≤ 10.
- Intersection: multiply the 1st by 2 → 4x + 2y = 16; subtract x + 2y = 10 → 3x = 6 → x = 2, y = 4 → **(2, 4)**
- Corners: (0,0) → 0 · (4,0) → 20 · **(2,4) → 26** · (0,5) → 20
- ✅ **Max P = 26 at (2, 4)**

**Minimizing:** do the exact same steps, then pick the **smallest** value. For Example 1, the minimum of P = 4x + 2y is **0 at (0, 0)**.

---

## 📝 UNIT 9 QUIZ

```quiz
Q: In linear programming, the function you want to maximize or minimize is called the:
* Objective function
- Constraint
- Feasible region
- Corner point

Q: The region on the graph where all constraints are satisfied at the same time is the:
* Feasible region
- Objective region
- Null region
- Infinite region

Q: According to the corner-point method, the maximum or minimum value is found at:
* A corner point of the feasible region
- The center of the feasible region
- Any point outside the feasible region
- The origin only

Q: What are the intercepts of the line 2x + y = 12?
* (6, 0) and (0, 12)
- (12, 0) and (0, 6)
- (2, 0) and (0, 1)
- (6, 0) and (0, 6)
> Set y = 0: x = 6. Set x = 0: y = 12.

Q: Where do the lines x + y = 5 and x − y = 1 intersect?
* (3, 2)
- (2, 3)
- (5, 1)
- (4, 1)
> Add them: 2x = 6, so x = 3 and y = 2.

Q: Maximize P = 4x + 2y subject to x, y ≥ 0, x + y ≤ 5, x − y ≤ 1. What is the maximum?
* 16 at (3, 2)
- 20 at (5, 0)
- 10 at (0, 5)
- 4 at (1, 0)
> (5, 0) is not feasible because 5 − 0 > 1.

Q: Maximize P = 4x + 3y subject to x, y ≥ 0, 2x + y ≤ 12, x + y ≤ 7. What is the maximum?
* 26 at (5, 2)
- 28 at (7, 0)
- 24 at (6, 0)
- 21 at (0, 7)
> (7, 0) breaks 2x + y ≤ 12.

Q: Maximize P = 3x + 2y subject to x, y ≥ 0, x + y ≤ 4, x + 3y ≤ 6. What is the maximum?
* 12 at (4, 0)
- 11 at (3, 1)
- 18 at (6, 0)
- 8 at (0, 4)
> Corners: (0,0)=0, (4,0)=12, (3,1)=11, (0,2)=4.

Q: Maximize P = 5x + 4y subject to x, y ≥ 0, 2x + y ≤ 8, x + 2y ≤ 10. What is the maximum?
* 26 at (2, 4)
- 20 at (4, 0)
- 20 at (0, 5)
- 40 at (0, 10)
> The lines cross at (2, 4): 5(2) + 4(4) = 26.

Q: Which point is NOT in the feasible region of x, y ≥ 0, x + y ≤ 5, x − y ≤ 1?
* (4, 1)
- (3, 2)
- (1, 0)
- (0, 5)
> 4 − 1 = 3, which is greater than 1.

Q: For P = 4x + 2y with corners (0,0), (1,0), (3,2), (0,5), what is the MINIMUM value?
* 0 at (0, 0)
- 4 at (1, 0)
- 10 at (0, 5)
- 16 at (3, 2)
```

---

## ⚠️ EXAM TRAPS / EASY-TO-CONFUSE
| Confusing pair | How to tell them apart |
|---|---|
| Parameter vs Statistic | **P**arameter = **P**opulation · **S**tatistic = **S**ample |
| Ordinal vs Nominal | Ordinal has **order** (rank). Nominal is **labels only** |
| Interval vs Ratio | Ratio has a **true zero** (0 = none). °C is interval, kg is ratio |
| Mean vs Median with outliers | Mean is **pulled** by extreme scores; median is **resistant** |
| Median of even n | **Average the two middle** values (after sorting!) |
| Bimodal vs no mode | Bimodal = **two** values tie for most frequent; no mode = **nothing repeats** |
| Weighted mean vs plain mean | Weighted divides by **Σw**, not by the number of categories |
| Class size | Difference of consecutive **lower limits** (3 for 27–29, 30–32), not UL − LL |
| Class boundary vs class limit | Boundary = limit **± 0.5** |
| <cf in a highest-first table | **Always count from the LOWEST class** |
| d1 and d2 in the mode formula | d1 = modal f − f of the class **below** (lower values); d2 = modal f − f of the class **above** |
| Clique vs independent set | Clique: **all** pairs adjacent. Independent: **no** pairs adjacent |
| Even vs odd cycle coloring | Even cycle **2**, odd cycle **3**, K_n **n** |
| Loop vs cycle | A loop is **one edge** from a vertex to itself; a cycle is a **closed path** |
| LP intercepts vs corners | An intercept is a corner only if it satisfies **every** constraint |

---

## 📝 MOCK EXAM (MIXED)

```quiz
Q: The owner of a shoe store wants to know the most saleable shoe size. Which measure should be used?
* Mode
- Mean
- Median
- Range

Q: Which measure of central tendency is greatly affected by extreme scores?
* Mean
- Median
- Mode
- Class mark

Q: Which level of measurement has values with a specific order?
* Ordinal
- Nominal
- Interval
- Ratio

Q: Find the mean of 70, 72, 77, 78, 86, 84, 79.
* 78
- 77.91
- 79
- 74.70

Q: For 8, 8, 9, 10, 10, which is true?
* Mean = median
- Mean > median
- Mean < median
- The mode is 9

Q: A store sold 1,000 items at ₱10, 500 at ₱20, 500 at ₱25, and 100 at ₱30. What is the weighted mean?
* 16.90
- 21.25
- 18.00
- 16.00

Q: In Jabez's scores 70, 72, 77, 78, 86, 84, 79, the lowest score is replaced with 20 and a high score with 100. Choices are 78.00, 77.91, 74.70, 73.86. Which is the best answer?
* 73.86
- 78.00
- 77.91
- 74.70
> Strictly replacing 70 and 86 gives 72.86, which is not a choice. 73.86 is closest and matches 517 / 7. The extreme low score drags the mean down.

Q: Find the median of the blood pressure readings 135, 121, 119, 116, 130, 121, 131.
* 121
- 116
- 124.7
- 130

Q: In the grouped exam table, N = 40 and Σfx = 1,624. What is the mean?
* 40.6
- 40.5
- 40.38
- 40

Q: In the grouped exam table, what is the class mark of the modal class 39–41?
* 40
- 39
- 41
- 38.5

Q: Using Mo = L + [d1 / (d1 + d2)] · i with L = 38.5, d1 = 4, d2 = 2, i = 3, what is the mode?
* 40.5
- 40.0
- 39.5
- 41.5

Q: Using Md = L + [(N/2 − cf) / f] · i with L = 38.5, N = 40, cf = 15, f = 8, i = 3, what is the median?
* 40.38
- 40.50
- 40.60
- 41.00

Q: A survey of 200 voters finds that 58% support a candidate. The 58% is a:
* Statistic
- Parameter
- Population
- Nominal value

Q: What is the median of 6, 2, 9, 4?
* 5
- 4
- 5.25
- 6.5
> Sorted: 2, 4, 6, 9. (4 + 6) / 2 = 5. 5.25 is the mean.

Q: In graph theory, two vertices joined by an edge are called:
* Adjacent
- Independent
- Isolated
- Parallel

Q: A graph has vertices with degrees 3, 3, 2, 2, 2. How many edges does it have?
* 6
- 12
- 5
- 10
> Sum of degrees = 12, and 12 / 2 = 6.

Q: What is the chromatic number of a triangle (K3)?
* 3
- 2
- 4
- 1

Q: A map is a partition of the plane into:
* Connected regions
- Vertices
- Straight lines
- Equal squares

Q: Maximize P = 4x + 3y subject to x, y ≥ 0, 2x + y ≤ 12, x + y ≤ 7.
* 26
- 28
- 24
- 21

Q: Maximize P = 4x + 2y subject to x, y ≥ 0, x + y ≤ 5, x − y ≤ 1.
* 16
- 20
- 10
- 18

Q: Maximize P = 2x + 5y subject to x, y ≥ 0, x + y ≤ 6, y ≤ 4.
* 24 at (2, 4)
- 20 at (0, 4)
- 12 at (6, 0)
- 30 at (0, 6)
> Corners: (0,0)=0, (6,0)=12, (2,4)=24, (0,4)=20. (0, 6) breaks y ≤ 4.
```
