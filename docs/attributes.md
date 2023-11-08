# Attributes


Attributes are the building blocks of a problem. They allow you to define and evaluate the 
various characteristics of a problem, ensuring that a given problem is solved correctly while 
also enabling you to grade for partial credit.

They are added as characteristics of a problem on the editor tab, by selecting an item on the 
drop-down list that appears when you click on any given spreadsheet cell. Note that a problem 
must be active for this drop-down to appear.


## Value
Checks that a target cell's value is equal to the provided value.

#### Options
- Points
- Target Value
- Target Cell

#### Examples
- Target Cell's Value is 5. Target Value is 5.
  - This case would pass.

- Target Cell's value is 8. Target Value is 5.
    - This case would fail.

## Value Range
Checks that a target cell's value is within an inclusive range of provided values.

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

## Formula Contains
Checks that a target cell's formula explicitly contains the provided value.



## Function list
## Function Graph
## Formula Regex
