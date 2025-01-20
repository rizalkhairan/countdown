class Tree {
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;

        if (this.left != null && this.right != null) {
            this.components = this.left.components | this.right.components;
        } else {
            this.components = 0;
        }
    }
}

function express(node) {
    if (node.left === null && node.right === null) {
        // Leaf node
        return node.value;
    } else {
        if (['-', '/'].includes(node.value) && evaluate(node.left) < evaluate(node.right)) {
            return `(${express(node.right)}${node.value}${express(node.left)})`;
        } else {
            return `(${express(node.left)}${node.value}${express(node.right)})`;
        }
    }
}

function evaluate(node) {
    if (node.left === null && node.right === null) {
        // Leaf node
        return node.value;
    }

    let left = evaluate(node.left);
    let right = evaluate(node.right);
    if (left === -1 || right === -1) {
        // Invalid tree
        return -1;
    }

    if (node.value === '+') {
        return left + right;
    }
    if (node.value === '-') {
        return Math.abs(left - right);
    }
    if (node.value === '*') {
        return left * right;
    }
    if (node.value === '/') {
        if (left < right) {
            [left, right] = [right, left];
        }
        if (right === 0 || (left % right !== 0)) {
            return -1;
        }
        return Math.floor(left / right);
    }

    return -9999;
}

function* generate_all_trees(numbers) {
    let trees = {};
    for (let i = 1; i <= numbers.length; i++) {
        trees[i] = [];
    }

    // Initialize trees with a single leaf node
    for (let i = 0; i < numbers.length; i++) {
        let leaf = new Tree(numbers[i]);
        leaf.components = 1 << i;
        trees[1].push(leaf);
    }

    let operators = ['+', '-', '*', '/'];

    // Iteratively build trees with more leaf nodes
    for (let i = 2; i <= numbers.length; i++) {
        for (let j = 1; j < i; j++) {
            for (let left_tree of trees[j]) {
                for (let right_tree of trees[i - j]) {
                    if ((left_tree.components & right_tree.components) !== 0) {
                        continue;
                    }
                    for (let op of operators) {
                        let new_tree = new Tree(op, left_tree, right_tree);
                        new_tree.components = left_tree.components | right_tree.components;
                        trees[i].push(new_tree);
                        yield new_tree;
                    }
                }
            }
        }
    }
}

function solve(numbers, target) {
    /*  Brute force solution, terminate when exact solution is found
        If all the expression trees are exhausted, return the closest solution
        At such worst case, the algorithms uses ~300MB memory and ~5 seconds (bad!) */

    let best_solution = null;
    let best_diff = Infinity;
    for (let tree of generate_all_trees(numbers)) {
        let diff = Math.abs(evaluate(tree) - target);
        if (diff < best_diff) {
            best_solution = tree;
            best_diff = diff;
            if (best_diff == 0) {
                break;
            }
        }
    }

    return best_solution;
}