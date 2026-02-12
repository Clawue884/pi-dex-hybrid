# formal/amm_spec.py
from z3 import *

# Example invariant: x*y=k (Uniswap style)
x, y, k = Reals('x y k')
s = Solver()
s.add(x > 0, y > 0)
s.add(x * y == k)

# After swap dx -> dy must preserve invariant
dx, dy = Reals('dx dy')
s.add((x+dx)*(y-dy) == k)

print(s.check())
print(s.model())
