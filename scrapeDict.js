var unirest = require('unirest');

var dictionary = {};

var wordList = ['cat', 'dog', 'mouse'];

for (i in wordList) {
  scrapeWord(wordList[i]);
}

console.log(dictionary); // save the dictionary after all scrapes completed



function scrapeWord(word) {
  unirest.get("https://montanaflynn-dictionary.p.mashape.com/define?word="+word)
  .header("X-Mashape-Key", process.env.MASHAPE_KEY)
  .end(function (result) {
    if (result.body.definitions.length == 0) {
      return;
    }
    var defWords = result.body.definitions[0].text.split(/\s+/);
    dictionary[word] = defWords;
  });  
}
