# ============================
# PI DEX — FACTORY
# Create & Registry Pools
# ============================

state = {
    "pools": {},          # (tokenA, tokenB) => pool_address / pool_id
    "all_pools": [],     # list of pool ids
}

def _sort_tokens(tokenA, tokenB):
    assert tokenA != tokenB, "Identical tokens"
    return (tokenA, tokenB) if tokenA < tokenB else (tokenB, tokenA)

def get_pool(tokenA, tokenB):
    t0, t1 = _sort_tokens(tokenA, tokenB)
    return state["pools"].get((t0, t1), None)

def create_pool(tokenA, tokenB, pool_id):
    """
    pool_id = identifier / address dari pool (misalnya 'amm_pool_pi_usdt')
    """
    t0, t1 = _sort_tokens(tokenA, tokenB)
    assert (t0, t1) not in state["pools"], "Pool already exists"

    state["pools"][(t0, t1)] = pool_id
    state["all_pools"].append(pool_id)
    return pool_id

def all_pools():
    return state["all_pools"]
