# ============================
# PI DEX — ROUTER
# Handle multi-pair trades
# ============================

# NOTE:
# Router memanggil fungsi dari pool
# pool.swap_token_for_pi(), pool.swap_pi_for_token()

def _swap_single(pool, input_token, amount_in):
    """
    pool = reference ke pool contract
    input_token = "PI" atau token lain
    """
    if input_token == "PI":
        return pool.swap_pi_for_token("router", amount_in)
    else:
        return pool.swap_token_for_pi("router", amount_in)

def swap_exact_tokens_for_tokens(path, amount_in, pools):
    """
    path  = ["PI", "USDT", "ABC"]
    pools = [pool_PI_USDT, pool_USDT_ABC]
    """
    assert len(path) >= 2, "Invalid path"
    assert len(pools) == len(path) - 1, "Pools mismatch"

    amount = amount_in
    for i in range(len(pools)):
        pool = pools[i]
        token_in = path[i]
        amount = _swap_single(pool, token_in, amount)

    return amount  # final output

def get_amounts_out(amount_in, path, pools):
    """
    Simulasi tanpa mengubah state pool
    """
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
