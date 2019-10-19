sw = require('stopword');
var WordPOS = require('wordpos'), wordpos = new WordPOS();

export default class Similarity
{

function termFreqMap(str) {
        var words = str.split(' ');
        for(var i=0; i<words.length; i++)
        {
            words[i] = words[i].toLowerCase();
            words[i] = words[i].replace(/[^a-zA-Z0-9]/g, '');
        }
        console.log(words);
        words = sw.removeStopwords(words);
        for(var i=0; i<words.length; i++)
        {
            console.log("Doing word info on " + words[i])
            wordpos.lookupNoun(words[i], console.log); //here be code for synonoms
        }
        var termFreq = {};
        words.forEach(function(w) {
            termFreq[w] = (termFreq[w] || 0) + 1;
        });
        return termFreq;
    }

    function addKeysToDict(map, dict) {
        for (var key in map) {
            dict[key] = true;
        }
    }

    function termFreqMapToVector(map, dict) {
        var termFreqVector = [];
        for (var term in dict) {
            termFreqVector.push(map[term] || 0);
        }
        return termFreqVector;
    }

    function vecDotProduct(vecA, vecB) {
        var product = 0;
        for (var i = 0; i < vecA.length; i++) {
            product += vecA[i] * vecB[i];
        }
        return product;
    }

    function vecMagnitude(vec) {
        var sum = 0;
        for (var i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    }

    function cosineSimilarity(vecA, vecB) {
        return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
    }

    function textCosineSimilarity(strA, strB) {
        var termFreqA = termFreqMap(strA);
        var termFreqB = termFreqMap(strB);


        // ---------------------------------------------------------------------
        /*
        Here i want to branch to a serperate function that sends the termFreq dict
        to match and compare the words that are found similar. The tools required will
        be two crucial API's, one what will idenify that a word is a noun, verb, etc and
        a api the will look for synonoms for a word. The reason we are doing this is to reduce the
        matrix if we find words similar to one another. for example, "manager" and "management" should
        fall under the same matrix index instead of being seperate. The reason we want to see if a word is a
        verb or noun is becasue the word could change in context. For example, runs could mean "running a mile"
        when i really mean "runs a lab". This will reduce the amount of searching.
        */
        // ---------------------------------------------------------------------

        console.log("Printing results for the Term Frequency A and B");
        console.log(termFreqA);
        console.log(termFreqB);

        var dict = {};
        addKeysToDict(termFreqA, dict);
        addKeysToDict(termFreqB, dict);

        var termFreqVecA = termFreqMapToVector(termFreqA, dict);
        console.log("Printing dictonary after Term Frequncy Map on A");
        console.log(termFreqVecA);
        var termFreqVecB = termFreqMapToVector(termFreqB, dict);
        console.log("Printing dictonary after Term Frequncy Map on B");
        console.log(termFreqVecB);

        console.log("Similarity test below")
        return cosineSimilarity(termFreqVecA, termFreqVecB);
      }
}
