// ---------- Starting data ----------
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const VALID_CATEGORIES = ["personal", "work", "study"];

// ---------- Functions ----------

// Returns an array of notes whose text contains `word` (case-insensitive).
function searchNotes(word) {
  const target = word.toLowerCase();
  return notes.filter(function (note) {
    return note.text.toLowerCase().includes(target);
  });
}

// Returns the note with the most characters, or null if there are no notes.
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// Returns an object counting notes per category.
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category] === undefined) {
      counts[note.category] = 0;
    }
    counts[note.category]++;
  }
  return counts;
}

// Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const label = total === 1 ? "note" : "notes";

  if (total === 0) {
    return `0 ${label}.`;
  }

  const parts = [];
  for (const category of VALID_CATEGORIES) {
    if (counts[category]) {
      parts.push(`${counts[category]} ${category}`);
    }
  }
  return `${total} ${label}: ${parts.join(", ")}.`;
}

// Lower-cases, trims and collapses repeated spaces so texts can be compared.
function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

// Returns true if a note with the same text already exists.
function isDuplicate(text) {
  const target = normalize(text);
  return notes.some(function (note) {
    return normalize(note.text) === target;
  });
}

// Adds a note if valid. Returns true when added, false otherwise (and logs why).
function addNote(text, category) {
  const cleanText = String(text).trim();

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log("Not added: text must be 1-200 characters.");
    return false;
  }
  if (!VALID_CATEGORIES.includes(category)) {
    console.log("Not added: category must be personal, work or study.");
    return false;
  }
  if (isDuplicate(cleanText)) {
    console.log("Not added: duplicate note.");
    return false;
  }

  const nextId = notes.length === 0 ? 1 : Math.max(...notes.map((n) => n.id)) + 1;
  notes.push({ id: nextId, text: cleanText, category: category });
  return true;
}

// ---------- Tests ----------
// Run top to bottom: the addNote tests change `notes`, so they come last.

// searchNotes
console.log(searchNotes("the").map((n) => n.text));
// [ 'Finish the Day 3 assignment', 'Email the project report to Grace' ]
console.log(searchNotes("JAVASCRIPT").map((n) => n.text));
// [ 'Revise JavaScript arrays' ]   (ignores upper/lower case)
console.log(searchNotes("zebra"));
// []   (edge case: no results)

// longestNote
console.log(longestNote());
// { id: 3, text: 'Email the project report to Grace', category: 'work' }
const savedNotes = notes;
notes = [];
console.log(longestNote());
// null   (edge case: empty array)
notes = savedNotes;

// countByCategory
console.log(countByCategory());
// { personal: 2, study: 2, work: 1 }   (keys appear in the order first seen)
notes = [];
console.log(countByCategory());
// {}   (edge case: no notes)
notes = savedNotes;

// getSummary
console.log(getSummary());
// 5 notes: 2 personal, 1 work, 2 study.
notes = [savedNotes[0]];
console.log(getSummary());
// 1 note: 1 personal.   (edge case: singular "note")
notes = [];
console.log(getSummary());
// 0 notes.   (edge case: no notes)
notes = savedNotes;

// isDuplicate
console.log(isDuplicate("  CALL    MUM  "));
// true   (ignores case and extra spaces)
console.log(isDuplicate("Call dad"));
// false

// addNote (invalid cases first)
console.log(addNote("", "work"));
// Not added: text must be 1-200 characters.
// false
console.log(addNote("x".repeat(201), "work"));
// Not added: text must be 1-200 characters.
// false   (edge case: 201 characters)
console.log(addNote("Plan the sprint", "gym"));
// Not added: category must be personal, work or study.
// false
console.log(addNote("call mum", "personal"));
// Not added: duplicate note.
// false

// addNote (valid cases)
console.log(addNote("Water the plants", "personal"));
// true
console.log(addNote("a", "work"));
// true   (edge case: exactly 1 character)
console.log(addNote("x".repeat(200), "study"));
// true   (edge case: exactly 200 characters)
console.log(getSummary());
// 8 notes: 3 personal, 2 work, 3 study.
