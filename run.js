/**
    Format of the dictionary:
    - There are 26 sections for each letter of the alphabet
    - A section begins with a capital letter followed by a space followed by four new lines
    - each non-empty line represents a word and its definition
    - word lines are followed by two new lines
    - some words appear multiple times. when this happens, there will be a "word1" and a "word2" appearing one after the other in the dictionary
    - a word is separated from its definition by two spaces
    - some words are multiple words like "dead set" or "a-bomb". We ignore words like this.
    - words ending in "-" are prefixes and can probably be ignored in this study
    - the format of the definitions varies a lot
*/

var fs = require('fs');
var Set = require("collections/fast-set");

// read all lines and make them lowercase for remainder of processing
var lines = fs.readFileSync('en.txt').toString().toLowerCase().split("\n");

// a section is a letter followed by a space on a line by itself.
var re_section = /^[a-z] $/
    // a word is a string of letters, possibly suffixed by a number, followed by two spaces, followed by text until the end of the line. The first matching group is the actual word match.
var re_word = /^([a-z]+)(\d+)?  (\S.*)$/

// map of words to Set of words in the definition, where words in the definition are filtered to contain only words in the key set. For example if "adj." appears in a definition, it will be filtered out.
var dict = {};

// first get all the words
lines.forEach(function(line) {
    var word_match = line.match(re_word);
    if (!word_match) return;
    var word = word_match[1];
    dict[word] = new Set(); // Initialize the definitions as empty sets
});

// Researched from http://www.darke.k12.oh.us/curriculum/la/suffixes.pdf
var common_suffixes = [
    "s", "es", "ed", "ing", "ly", "er", "or",
    "ion", "tion", "ation", "ition", "ible", "able",
    "al", "ial", "y", "ness", "ity", "ty", "ment",
    "ment", "ic", "ous", "eous", "ious", "en",
    "ive", "ative", "itive", "full", "less", "est"
];

// Returns the word if it is a key in our dictionary.
// Otherwise tries to identify the root of the word
// by considering common prefixes and suffixes.
function getWordRootOrNull(word) {
    // check exact match
    if (!!dict[word]) {
        return word;
    }

    // check if chopping off suffix results in a matched root
    var root_or_null = null;
    common_suffixes.forEach(function(suffix) {
        var root = word.slice(0, word.length - suffix.length);
        if (!!dict[root]) {
            root_or_null = root;
        }
    });
    if (root_or_null) {
        return root_or_null;
    }

    // failed; return null
    return null;
}

// add definitions to the dictionary
lines.forEach(function(line) {
    if (line.length === 0) {
        // noop
        return;
    } else if (line.match(re_section)) {
        console.log("Processing section " + line);
        return;
    } else {
        var word_match = line.match(re_word);
        if (!word_match) return;

        var word = word_match[1];
        var definition = word_match[3];
        var definition_words = definition.match(/[a-z]+/g);

        definition_words.forEach(function(w) {
            var root_or_null = getWordRootOrNull(w);

            // if a root was found and it's not equal to the word, add it
            // this will prevent cycles from a word defining itself
            if (root_or_null && root_or_null !== word) {
                dict[word].add(root_or_null);
            }
        })
    }
});

// analyze some stuff
var num_words = 0;
var num_definition_words = 0;
var words_with_empty_definitions = new Set();
Object.keys(dict).forEach(function(word) {
    var set = dict[word];
    if (set.length === 0) {
        words_with_empty_definitions.add(word);
    }

    num_words += 1;
    num_definition_words += set.length;
})
console.log("Number of words: " + num_words);
console.log("Average number of words in definition: " + num_definition_words / num_words);
console.log("Words with empty definitions: " + words_with_empty_definitions.toArray());
