# ============================
# PI DEX — ROUTER ADVANCED
# Slippage + Deadline
# ============================

import time

def _now():
    return int(time.time())

def _swap_single(pool, input_token, amount_in):
    if input_token == "PI":
        return pool.swap_pi_for_token("router", amount_in)
    else:
        return pool.swap_token_for_pi("router", amount_in)

def get_amounts_out(amount_in, path, pools):
    assert len(path) >= 2, "Invalid path"
    assert len(pools) == len(path) - 1, "Pools mismatch"

    amounts = [amount_in]
    amount = amount_in

    for i in range(len(pools)):
        pool = pools[i]
        token_in = path[i]
        reserves = pool.get_reserves()

        if token_in == "PI":
            amount = pool._get_amount_out(amount, reserves["pi"], reserves["token"])
        else:
            amount = pool._get_amount_out(amount, reserves["token"], reserves["pi"])

        amounts.append(amount)

    return amounts

def swap_exact_tokens_for_tokens(
    amount_in,
    amount_out_min,
    path,
    pools,
    to,
    deadline
):
    """
    amount_out_min = slippage protection
    deadline = unix timestamp
    """
    assert _now() <= deadline, "Transaction expired"

    amounts = get_amounts_out(amount_in, path, pools)
    assert amounts[-1] >= amount_out_min, "Slippage too high"

    amount = amount_in
    for i in range(len(pools)):
        pool = pools[i]
        token_in = path[i]
        amount = _swap_single(pool, token_in, amount)

    # Dalam chain nyata: transfer hasil ke `to`
    return amount
