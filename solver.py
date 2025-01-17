class Tree:
    """
        Tree data structure for representing arithmetic expressions.
            self.value  : int or str in ['+', '-', '*', '/']
            self.left   : Tree
            self.right  : Tree
            self.component : a bitmask
        
        Methods:
            self.express(replace_placeholder: dict) : Return the expression as string
            self.evaluate(replace_placeholder: dict) : Evaluate the expression of the
        These methods replace_placeholder argument can be used to substitute other values into the leaf nodes if found.
        For example, if we want to evaluate a tree with all value 1 in the leaf node replaced with 7, we can call the method like this:
            tree.evaluate({1: 7}) 
        
        The tree assumes commutativity.
        Subtraction and division are handled as if the left operand is always greater than or equal to the right operand.
    """
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
        
        # Bitmask. Showing which numbers are used in this tree
        if self.left is not None and self.right is not None:
            self.component = left.component | right.component
        else:
            self.component = 0
    
    def express(self, replace_placeholder={}):
        if self.left is None and self.right is None:
            # Leaf node
            if self.value in replace_placeholder.keys():
                return str(replace_placeholder[self.value])
            else:
                return str(self.value)
        else:
            if self.value in ['-', '/'] and self.left.evaluate(replace_placeholder) < self.right.evaluate(replace_placeholder):
                return f"({self.right.express(replace_placeholder)}{self.value}{self.left.express(replace_placeholder)})"
            else:
                return f"({self.left.express(replace_placeholder)}{self.value}{self.right.express(replace_placeholder)})"

    def evaluate(self, replace_placeholder={}):
        if self.left is None and self.right is None:
            # Leaf node
            if self.value in replace_placeholder.keys():
                return replace_placeholder[self.value]
            return self.value

        left = self.left.evaluate(replace_placeholder)
        right = self.right.evaluate(replace_placeholder)
        if left==-1 or right==-1:
            # Invalid tree
            return -1

        if self.value=='+':
            return left + right
        if self.value=='-':
            return abs(left-right)
        if self.value=='*':
            return left * right
        if self.value=='/':
            if left<right:
                left, right = right, left
            if right==0 or (left%right!=0):
                return -1
            return left // right

        return -9999   


def all_possible_trees(numbers):
    trees = {i: [] for i in range(1, len(numbers) + 1)}
    
    # Initialize trees with a single leaf node
    for i in range(len(numbers)):
        leaf = Tree(numbers[i])
        leaf.component = 1 << i
        trees[1].append(leaf)
    
    operators = ['+', '-', '*', '/']
    
    # Iteratively build trees with more leaf nodes
    count = 0   # Unused. For debugging purpose
    for i in range(2, len(numbers) + 1):
        for j in range(1, i):
            for left_tree in trees[j]:
                for right_tree in trees[i - j]:
                    if left_tree.component & right_tree.component != 0:
                        continue
                    for op in operators:
                        count+=1
                        new_tree = Tree(op, left_tree, right_tree)
                        trees[i].append(new_tree)
                        yield new_tree

def get_numbers_span(numbers, min=-1, max=-1, replace_placeholder={}, template_trees=None):
    span = {}
    
    if template_trees is None:
        trees = list(all_possible_trees(numbers))
    else:
        trees = template_trees

    for tree in trees:
        result = tree.evaluate(replace_placeholder)
        if result <= 0:
            continue
        if min!=-1 and max!=-1 and not (min<=result<=max):
            continue

        if result not in span.keys():
            span[result] = tree     # Prevent overriding by more complex trees that have the same result

    sortedSpan = dict(sorted(span.items()))
    return sortedSpan

def solve(numbers, target):
    for tree in all_possible_trees(numbers):
        if tree.evaluate() == target:
            return tree
    return Tree(-1)
