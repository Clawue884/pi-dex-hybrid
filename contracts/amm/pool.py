# ============================
# PI DEX — AMM + LP SMART LOGIC
# ============================

state = {
    "reserve_pi": 0,
    "reserve_token": 0,
    "lp_total_supply": 0,
    "lp_balances": {},     # user => LP shares
    "fee_rate": 0.003     # 0.3% fee
}

# -------- Utils --------

def _sqrt(x):
    return int(x ** 0.5)

def lp_balance_of(user):
    return state["lp_balances"].get(user, 0)

def _mint_lp(user, amount):
    state["lp_total_supply"] += amount
    state["lp_balances"][user] = state["lp_balances"].get(user, 0) + amount

def _burn_lp(user, amount):
    assert lp_balance_of(user) >= amount, "Not enough LP"
    state["lp_balances"][user] -= amount
    state["lp_total_supply"] -= amount

# -------- Add Liquidity --------

def add_liquidity(user, pi_amount, token_amount):
    assert pi_amount > 0 and token_amount > 0, "Invalid amounts"

    if state["lp_total_supply"] == 0:
        # First LP provider sets the ratio
        lp_minted = _sqrt(pi_amount * token_amount)
    else:
        lp_minted = min(
            pi_amount * state["lp_total_supply"] // state["reserve_pi"],
            token_amount * state["lp_total_supply"] // state["reserve_token"]
        )

    assert lp_minted > 0, "LP too small"

    state["reserve_pi"] += pi_amount
    state["reserve_token"] += token_amount
    _mint_lp(user, lp_minted)

    return lp_minted

# -------- Remove Liquidity --------

def remove_liquidity(user, lp_amount):
    assert lp_amount > 0, "Invalid LP amount"
    assert lp_balance_of(user) >= lp_amount, "Not enough LP"

    pi_out = lp_amount * state["reserve_pi"] // state["lp_total_supply"]
    token_out = lp_amount * state["reserve_token"] // state["lp_total_supply"]

    _burn_lp(user, lp_amount)

    state["reserve_pi"] -= pi_out
    state["reserve_token"] -= token_out

    return pi_out, token_out

# -------- Swap Logic --------

def _get_amount_out(amount_in, reserve_in, reserve_out):
    assert amount_in > 0 and reserve_in > 0 and reserve_out > 0, "Invalid reserves"

    amount_in_with_fee = amount_in * (1 - state["fee_rate"])
    numerator = amount_in_with_fee * reserve_out
    denominator = reserve_in + amount_in_with_fee
    return int(numerator // denominator)

def swap_pi_for_token(user, pi_in):
    assert pi_in > 0, "Invalid input"

    token_out = _get_amount_out(pi_in, state["reserve_pi"], state["reserve_token"])
    assert token_out > 0, "Insufficient output"

    state["reserve_pi"] += pi_in
    state["reserve_token"] -= token_out

    return token_out

def swap_token_for_pi(user, token_in):
    assert token_in > 0, "Invalid input"

    pi_out = _get_amount_out(token_in, state["reserve_token"], state["reserve_pi"])
    assert pi_out > 0, "Insufficient output"

    state["reserve_token"] += token_in
    state["reserve_pi"] -= pi_out

    return pi_out

# -------- Read Functions --------

def get_reserves():
    return {
        "pi": state["reserve_pi"],
        "token": state["reserve_token"],
        "lp_total": state["lp_total_supply"]
    }

def get_price():
    if state["reserve_token"] == 0:
        return 0
    return state["reserve_pi"] / state["reserve_token"]
