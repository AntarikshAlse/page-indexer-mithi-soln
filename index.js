const fs = require("fs");

class Book {
  constructor(pages) {
    this.pages = pages;
    this.excludeWords = [];
    this.index = {};
  }

  // Method to read exclude words from a file.
  readExcludeWords(excludeWordsFile) {
    const excludeWords = fs.readFileSync(excludeWordsFile, "utf-8");
    this.excludeWords = excludeWords.split("\n");
  }

  // Method to read pages from files.
  readPages() {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i];
      const text = fs.readFileSync(page, "utf-8");
      this.indexWords(text, i + 1);
    }
  }

  // Method to index words in pages.
  indexWords(text, pageNum) {
    const words = text.split(/[\W•-]/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (this.excludeWords.includes(word)) {
        continue;
      }
      if (!(word in this.index)) {
        this.index[word] = new Set();
      }
      this.index[word].add(pageNum);
    }
    console.log(this.index);
  }

  // Method to write the index to a file.
  writeIndex(indexFile) {
    const sortedWords = Object.keys(this.index).sort();
    const lines = sortedWords.map((word) => {
      const pages = Array.from(this.index[word]).join(",");
      return `${word} : ${pages}`;
    });
    const output = lines.join("\n");
    fs.writeFileSync(indexFile, output);
  }
}

// Usage example:
const book = new Book(["Page1.txt", "Page2.txt", "Page3.txt"]);
book.readExcludeWords("exclude-words.txt");
book.readPages();
book.writeIndex("index.txt");
