/**
 * Coding Interview Track 04: Trie (Prefix Tree)
 *
 * Requirements:
 * - insert, search, startsWith
 * - Autocomplete suggestions
 * Run with: npx tsx 24-coding-interview/04-trie.ts
 */

class TrieNode {
  children = new Map<string, TrieNode>();
  isEndOfWord: boolean = false;
}

export class Trie {
  private readonly root = new TrieNode();

  insert(word: string): void {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
  }

  search(word: string): boolean {
    const node = this.traverseToNode(word);
    return node !== null && node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    return this.traverseToNode(prefix) !== null;
  }

  autocomplete(prefix: string): string[] {
    const startNode = this.traverseToNode(prefix);
    if (!startNode) return [];

    const matches: string[] = [];
    function collect(node: TrieNode, currentWord: string) {
      if (node.isEndOfWord) {
        matches.push(currentWord);
      }
      for (const [char, child] of node.children.entries()) {
        collect(child, currentWord + char);
      }
    }

    collect(startNode, prefix);
    return matches;
  }

  private traverseToNode(str: string): TrieNode | null {
    let current = this.root;
    for (const char of str) {
      const next = current.children.get(char);
      if (!next) return null;
      current = next;
    }
    return current;
  }
}

// Verification
const trie = new Trie();
trie.insert("apple");
trie.insert("app");
trie.insert("application");
trie.insert("banana");

console.assert(trie.search("apple") === true);
console.assert(trie.search("appl") === false);
console.assert(trie.startsWith("app") === true);
console.assert(trie.startsWith("ban") === true);
console.assert(trie.startsWith("cat") === false);

const suggestions = trie.autocomplete("app");
console.assert(suggestions.length === 3);
console.log("[PASS] Trie with Autocomplete Verified Successfully!");
