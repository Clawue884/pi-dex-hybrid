from core.merkle import build_merkle_root

class GlobalState:
    def __init__(self):
        self.events = []

    def append(self, event):
        self.events.append(event)

    def state_root(self):
        return build_merkle_root(self.events)
