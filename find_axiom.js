var fs = require('fs');
var Set = require("collections/fast-set");

// read all lines from the dependencies file
console.log("Reading dependencies");
var lines = fs.readFileSync('dependencies.txt').toString().split("\n");
// lines are alternating words and dependencies (comma-separated)
var dict = {};
for (var i = 0; i < lines.length / 2; i += 1) {
    var word = lines[i];
    var dependencies = lines[i + 1].split(",");
    dict[word] = new Set(dependencies);
}

/**
  It's time to find an axiom!
  What we currently have is a directed graph.
  If it were to magically turn out that our graph is a DAG (no cycles), then we would basically be done.

  Let's just pretend we already have a DAG for now.
  Then our graph would be a collection of forests, where each forest contains no cycles.
  Each of these forests is guaranteed to have a non-empty set of nodes that have no incoming edges.
  This set of nodes constitutes an axiom for the forest, so the union of of these forest axioms forms an axiom for the entire graph!

  That all sounds great, but let's be realistic. I haven't even bothered to process it yet, but I'm certain we don't have a DAG.
  That means the above algorithm is going to run into issues.
  However, we can derive the "condensation" of our original graph, which is a DAG.
  To do this, we first find all strongly connected components of our graph.
  Any strong connected component that contains more than a single node represents a cycle.
  In our case, that means knowing any single word in the cycle would allow us to derive each of the other words.
  Therefore, we can contract each of these cycles to any random node in the cycle.
  Note: Doing this means that we are committing to including that node in our axiom!
  After performing this contraction on each cycle will leave us with a DAG!
  
  Then we just perform the same algorithm described before, and we are done!
*/