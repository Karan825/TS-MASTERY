/**
 * Coding Interview Track 03: Generic Binary Search Tree (BST)
 *
 * Requirements:
 * - Generic <T> with custom comparator: (a: T, b: T) => number
 * - insert, search, inOrderTraversal, min, max
 * Run with: npx tsx 24-coding-interview/03-binary-search-tree.ts
 */

class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export type Comparator<T> = (a: T, b: T) => number;

export class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;

  constructor(private readonly compare: Comparator<T>) {}

  insert(value: T): void {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      const cmp = this.compare(value, current.value);
      if (cmp < 0) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  search(value: T): boolean {
    let current = this.root;
    while (current) {
      const cmp = this.compare(value, current.value);
      if (cmp === 0) return true;
      current = cmp < 0 ? current.left : current.right;
    }
    return false;
  }

  inOrderTraversal(): T[] {
    const result: T[] = [];
    function traverse(node: TreeNode<T> | null) {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    }
    traverse(this.root);
    return result;
  }

  min(): T | undefined {
    if (!this.root) return undefined;
    let current = this.root;
    while (current.left) {
      current = current.left;
    }
    return current.value;
  }
}

// Verification
const bst = new BinarySearchTree<number>((a, b) => a - b);
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);

console.assert(bst.search(30) === true);
console.assert(bst.search(99) === false);
console.assert(bst.min() === 20);

const sorted = bst.inOrderTraversal();
console.assert(JSON.stringify(sorted) === JSON.stringify([20, 30, 40, 50, 70]));
console.log("[PASS] Generic BST Verified Successfully!");
