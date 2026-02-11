# ============================
# PI DEX — AMM + LP SMART LOGIC (with Protocol Fee)
# ============================

state = {
    "reserve_pi": 0,
    "reserve_token": 0,
    "lp_total_supply": 0,
    "lp_balances": {},      # user => LP shares
    "fee_rate": 0.003,      # 0.3% total fee
    "protocol_fee": 0.0005,# 0.05% to protocol
    "fee_to": None         # address to collect protocol fee
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

def set_fee_to(addr):
    state["fee_to"] = addr

# -------- Add Liquidity --------

def add_liquidity(user, pi_amount, token_amount):
    assert pi_amount > 0 and token_amount > 0, "Invalid amounts"

    if state["lp_total_supply"] == 0:
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

# -------- Swap Logic (with protocol fee) --------

def _get_amount_out(amount_in, reserve_in, reserve_out):
    assert amount_in > 0 and reserve_in > 0 and reserve_out > 0, "Invalid reserves"

    total_fee = state["fee_rate"]
    proto_fee = state["protocol_fee"]

    amount_in_after_fee = amount_in * (1 - total_fee)
    numerator = amount_in_after_fee * reserve_out
    denominator = reserve_in + amount_in_after_fee
    return int(numerator // denominator)

def _take_protocol_fee(amount_in):
    if state["fee_to"] is None:
        return 0
    fee = int(amount_in * state["protocol_fee"])
    # Dalam implementasi chain nyata: transfer ke fee_to
    return fee

def swap_pi_for_token(user, pi_in):
    assert pi_in > 0, "Invalid input"

    proto_fee = _take_protocol_fee(pi_in)
    pi_effective = pi_in - proto_fee

    token_out = _get_amount_out(pi_effective, state["reserve_pi"], state["reserve_token"])
    assert token_out > 0, "Insufficient output"

    state["reserve_pi"] += pi_effective
    state["reserve_token"] -= token_out

    return token_out

def swap_token_for_pi(user, token_in):
    assert token_in > 0, "Invalid input"

    proto_fee = _take_protocol_fee(token_in)
    token_effective = token_in - proto_fee

    pi_out = _get_amount_out(token_effective, state["reserve_token"], state["reserve_pi"])
    assert pi_out > 0, "Insufficient output"

    state["reserve_token"] += token_effective
    state["reserve_pi"] -= pi_out

    return pi_out

# -------- Read --------

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
