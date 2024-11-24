# Attributes


Attributes are the building blocks of a problem. They allow you to define and evaluate the 
various characteristics of a problem, ensuring that a given problem is solved correctly while 
also enabling you to grade for partial credit.

They are added as characteristics of a problem on the editor tab, by selecting an item on the 
drop-down list that appears when you click on any given spreadsheet cell. Note that a problem 
must be active for this drop-down to appear.

---
## Value
Checks that a target cell's value is equal to the provided value. This attribute evaluates the 
'final' value of a cell, meaning that it will evaluate any formula that may be present.


#### Options
- Points
- Target Value
- Target Cell

#### Examples
- Target Cell's Value is 5. Target Value is 5.
  - This case would pass.
- Target Cell's value is 8. Target Value is 5.
    - This case would fail.
- Target Cell's value is `=A1`. `A1` is 5. Target Value is 5.
    - This case would pass.

#### Use Case
This attribute is useful for checking that a cell's value is equal to a specific value. For
example, if you want to check that the answer to a problem is 5, you would use this attribute
with a target value of 5.

This is useful when determining if a problem is explicitly correct, regardless of any work present.

---

## Value Range
Checks that a target cell's value is within an inclusive range of provided values. Similar to 
value, this attribute evaluates the 'final' value of a cell, meaning that it will evaluate any
formula that may be present and use the resulting value to check against the provided range.


#### Options
- Points
- Lower Bounds
- Upper Bounds
- Target Cell

#### Examples
- Target Cell's Value is 5. Lower Bounds is 5. Upper Bounds is 10.
  - This case would pass.
- Target Cell's value is 2. Lower Bounds is 5. Upper Bounds is 10.
  - This case would fail.
- Target Cell's value is `=A1`. `A1` is 5. Lower Bounds is 5. Upper Bounds is 10.
    - This case would pass.

#### Use Case
This attribute is useful for checking that a cell's value is within a range of values. This 
should be used when you want to check that, for example, an answer is 'correct' to a certain 
decimal (i.e. 0.001).

Similar to Value, this is useful when determinign if a problem is explicitly correct, regardless
of any work present.

---

## Formula Contains
Checks that a target cell's formula explicitly contains the provided value.

## Formula list
Recurses through all cells referenced from a target cell's formula and checks that a list of 
formulas are present