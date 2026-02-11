# ===================================================
# PI DEX — CL POOL V3 (Uniswap V3 Style, Simplified)
# NFT Positions + Fee Growth + Ticks
# ===================================================

import math

state = {
    "sqrt_price": 1.0,             # sqrt(P)
    "liquidity": 0,
    "fee_rate": 0.003,
    "ticks": {},                  # tick => {liquidity_net, fee_growth_outside}
    "positions": {},              # tokenId => position
    "next_token_id": 1,
    "fee_growth_global": 0.0
}

# ----------------- Utils -----------------

def _price_from_tick(tick):
    return 1.0001 ** tick

def _sqrt_price_from_tick(tick):
    return math.sqrt(_price_from_tick(tick))

def current_tick():
    return int(math.log(state["sqrt_price"]**2, 1.0001))

# ----------------- Position (NFT) -----------------

def mint_position(owner, tickLower, tickUpper, liquidity):
    assert tickLower < tickUpper, "Invalid ticks"
    assert liquidity > 0, "Invalid liquidity"

    token_id = state["next_token_id"]
    state["next_token_id"] += 1

    pos = {
        "owner": owner,
        "tickLower": tickLower,
        "tickUpper": tickUpper,
        "liquidity": liquidity,
        "fee_growth_inside_last": state["fee_growth_global"],
        "tokens_owed": 0
    }

    state["positions"][token_id] = pos

    _update_tick(tickLower, liquidity)
    _update_tick(tickUpper, -liquidity)

    if tickLower <= current_tick() < tickUpper:
        state["liquidity"] += liquidity

    return token_id

def _update_tick(tick, liquidity_delta):
    t = state["ticks"].get(tick, {"liquidity_net": 0, "fee_growth_outside": 0.0})
    t["liquidity_net"] += liquidity_delta
    state["ticks"][tick] = t

def burn_position(token_id, liquidity):
    pos = state["positions"][token_id]
    assert pos["liquidity"] >= liquidity

    _update_tick(pos["tickLower"], -liquidity)
    _update_tick(pos["tickUpper"], liquidity)

    if pos["tickLower"] <= current_tick() < pos["tickUpper"]:
        state["liquidity"] -= liquidity

    pos["liquidity"] -= liquidity

# ----------------- Fee Logic -----------------

def _update_fee_growth(fee_amount):
    if state["liquidity"] > 0:
        state["fee_growth_global"] += fee_amount / state["liquidity"]

def collect_fees(token_id):
    pos = state["positions"][token_id]
    fee_inside = state["fee_growth_global"] - pos["fee_growth_inside_last"]
    owed = fee_inside * pos["liquidity"]
    pos["tokens_owed"] += owed
    pos["fee_growth_inside_last"] = state["fee_growth_global"]
    return owed

# ----------------- Swap -----------------

def _cross_tick(tick):
    t = state["ticks"].get(tick)
    if not t:
        return
    state["liquidity"] += t["liquidity_net"]
    t["fee_growth_outside"] = state["fee_growth_global"]

def swap_exact_in(amount_in, zero_for_one=True):
    assert amount_in > 0
    assert state["liquidity"] > 0

    fee = amount_in * state["fee_rate"]
    amt = amount_in - fee

    _update_fee_growth(fee)

    if zero_for_one:
        state["sqrt_price"] -= amt / state["liquidity"]
    else:
        state["sqrt_price"] += amt / state["liquidity"]

    tick = current_tick()
    if tick in state["ticks"]:
        _cross_tick(tick)

    amount_out = amt * state["sqrt_price"]
    return int(amount_out)

# ----------------- Read -----------------

def get_pool_state():
    return {
        "sqrt_price": state["sqrt_price"],
        "tick": current_tick(),
        "liquidity": state["liquidity"],
        "fee_growth_global": state["fee_growth_global"]
    }
