class TendermintConsensus:
    def __init__(self, validators):
        self.validators = validators
        self.height = 0

    def propose(self, block):
        votes = []
        for v in self.validators:
            votes.append(v.vote(block))
        if votes.count(True) > len(votes) * 2 / 3:
            self.height += 1
            return True
        return False


class Validator:
    def __init__(self, name):
        self.name = name

    def vote(self, block):
        return True  # deterministic yes (for core engine)
