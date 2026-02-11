# contracts/lp_nft_v3.py

import uuid

class LPPositionNFT:
    def __init__(self):
        self.positions = {}

    def mint(self, owner, lower_tick, upper_tick, liquidity):
        token_id = str(uuid.uuid4())
        self.positions[token_id] = {
            "owner": owner,
            "lower": lower_tick,
            "upper": upper_tick,
            "liquidity": liquidity
        }
        return token_id

    def transfer(self, token_id, new_owner):
        if token_id not in self.positions:
            raise Exception("NFT not found")
        self.positions[token_id]["owner"] = new_owner

    def get_position(self, token_id):
        return self.positions[token_id]
