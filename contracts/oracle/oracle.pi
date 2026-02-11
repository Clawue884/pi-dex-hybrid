# ============================
# PI DEX — ORACLE (TWAP)
# ============================

import time

state = {
    "price_cumulative": {},   # pool_id => cumulative price
    "last_timestamp": {},     # pool_id => last update time
    "twap": {}                # pool_id => latest TWAP
}

def update(pool_id, pool):
    """
    pool = reference ke pool contract
    """
    now = int(time.time())
    reserves = pool.get_reserves()

    assert reserves["token"] > 0 and reserves["pi"] > 0, "Invalid reserves"

    price = reserves["pi"] / reserves["token"]

    last_time = state["last_timestamp"].get(pool_id, now)
    elapsed = now - last_time
    if elapsed <= 0:
        return state["twap"].get(pool_id, price)

    cumulative = state["price_cumulative"].get(pool_id, 0)
    cumulative += price * elapsed

    state["price_cumulative"][pool_id] = cumulative
    state["last_timestamp"][pool_id] = now

    # TWAP = cumulative / total_time
    total_time = now - (state["last_timestamp"].get(pool_id, now - elapsed))
    if total_time > 0:
        state["twap"][pool_id] = cumulative / total_time
    else:
        state["twap"][pool_id] = price

    return state["twap"][pool_id]

def consult(pool_id):
    return state["twap"].get(pool_id, 0)
