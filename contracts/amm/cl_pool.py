# ======================================
# PI DEX — Concentrated Liquidity Pool
# V3-style (simplified)
# ======================================

state = {
    "sqrt_price": 1.0,          # sqrt(P) current
    "liquidity": 0,            # active liquidity
    "ticks": {},               # tick => liquidity_net
    "positions": {},           # (owner, tickLower, tickUpper) => liquidity
    "fee_rate": 0.003
}

# -------- Utils --------

def _price_from_tick(tick):
    # simplified: P = 1.0001 ^ tick
    return 1.0001 ** tick

def _sqrt_price_from_tick(tick):
    return _price_from_tick(tick) ** 0.5

def _position_key(owner, tickL, tickU):
    return f"{owner}:{tickL}:{tickU}"

# -------- Position Management --------

def mint_position(owner, tickLower, tickUpper, liquidity):
    assert tickLower < tickUpper, "Invalid ticks"
    assert liquidity > 0, "Invalid liquidity"

    key = _position_key(owner, tickLower, tickUpper)
    state["positions"][key] = state["positions"].get(key, 0) + liquidity

    state["ticks"][tickLower] = state["ticks"].get(tickLower, 0) + liquidity
    state["ticks"][tickUpper] = state["ticks"].get(tickUpper, 0) - liquidity

    # If price in range → add to active liquidity
    if tickLower <= current_tick() < tickUpper:
        state["liquidity"] += liquidity

    return key

def burn_position(owner, tickLower, tickUpper, liquidity):
    key = _position_key(owner, tickLower, tickUpper)
    assert state["positions"].get(key, 0) >= liquidity, "Not enough position"

    state["positions"][key] -= liquidity
    state["ticks"][tickLower] -= liquidity
    state["ticks"][tickUpper] += liquidity

    if tickLower <= current_tick() < tickUpper:
        state["liquidity"] -= liquidity

# -------- Price & Tick --------

def current_tick():
    # reverse of sqrt_price ≈ sqrt(1.0001^tick)
    import math
    return int(math.log(state["sqrt_price"]**2, 1.0001))

# -------- Swap Logic --------

def _cross_tick(tick):
    delta = state["ticks"].get(tick, 0)
    state["liquidity"] += delta

def swap_exact_in(amount_in, zero_for_one=True):
    """
    zero_for_one: PI -> Token (price down)
    else: Token -> PI (price up)
    """
    assert amount_in > 0, "Invalid input"
    assert state["liquidity"] > 0, "No liquidity"

    fee = amount_in * state["fee_rate"]
    amt = amount_in - fee

    # simplified price move
    if zero_for_one:
        state["sqrt_price"] -= amt / state["liquidity"]
    else:
        state["sqrt_price"] += amt / state["liquidity"]

    # handle tick crossing
    tick = current_tick()
    if tick in state["ticks"]:
        _cross_tick(tick)

    amount_out = amt * state["sqrt_price"]
    return int(amount_out)

# -------- Read --------

def get_state():
    return {
        "sqrt_price": state["sqrt_price"],
        "liquidity": state["liquidity"],
        "tick": current_tick()
    }
