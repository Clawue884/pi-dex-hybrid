import hashlib

def hash_data(data):
    return hashlib.sha256(data.encode()).hexdigest()

def build_merkle_root(leaves):
    if not leaves:
        return None

    layer = [hash_data(str(leaf)) for leaf in leaves]

    while len(layer) > 1:
        next_layer = []
        for i in range(0, len(layer), 2):
            left = layer[i]
            right = layer[i+1] if i+1 < len(layer) else left
            next_layer.append(hash_data(left + right))
        layer = next_layer

    return layer[0]
