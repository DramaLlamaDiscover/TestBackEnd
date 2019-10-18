var express = require('express');
var router = express.Router();
sw = require('stopword');
var WordPOS = require('wordpos'), wordpos = new WordPOS();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*this was a test on routes for apples. send a number to the request and will send
the num of apples in text*/
/*router.post('/apples', function(req, res) {
  console.log("Attempting to access apples");
  console.log("The amount of apples you want is " + req.body.apples);
  var applesText = "";
  for(var i = 0; i < req.body.apples; i++)
  {
    applesText = applesText + "apple ";
  }
  res.send(applesText);
});*/

var serviceNowquestions = [
  ["I would like to request user access to", userAccessRequest],
  ["I would like to request miro access for", miroAccessRequest],
  ["What are popular services on ServiceNow?", popularServices],
  ["I would like to ask a buisness technology group a question", btGroupQuestion],//this is a three part question. will ask for the group
];                                                                                   //they would like to contact and what they need help with
var serviceNowKeyWords = {
  //cookie_Falvor: ["Chocolate Chip", "Mint"],
  //team_nums: ["Team 1", "Team 2", "Team 3", "Team 4"],
  user_services: ["meta administrator full access", "admin bnc portal", "ca unified infastructure managment", "admin dvoice"],
  employees_discover: ["ryan llamas", "zach hueneke", "philip nangachiveettil", "payton suchomel", "alex rojas", "rachael richardson", "doug duncan"],
  discover_teams: ["bot interpreters", "appsolute", "interpreter bots"]
};

//questions = createNewFunction(questions, "www.infoforquestionhere.com.json.0", keyWordSet[0], "What kind of cookies and milk will team 4 be serving?")

//var canidates = textCosineSimilarity(user_input, questions)
//console.log(questions[0][1])
//console.log("Text should be below")
//console.log(questions[canidates[0][1]][1](user_input))

function userAccessRequest(user_input) {
  var index = 0;
  var userFound = false;
  var serviceFound = false;
  var user = "";
  var service = "";

  console.log("This is printing")

  while((index < serviceNowKeyWords.employees_discover.length && index < serviceNowKeyWords.user_services.length) && (userFound === false || serviceFound === false))
  {
    console.log("Checking index " + index + "Right now")
    if(user_input.search(serviceNowKeyWords.employees_discover[index]))
    {
      console.log("User name found!")
      userFound = true
      user = serviceNowKeyWords.employees_discover[index]
    }
    if(user_input.search(serviceNowKeyWords.user_services[index]))
    {
      console.log("Service found!")
      serviceFound = true
      service = serviceNowKeyWords.user_services[index]
    }
    index++;
  }


  if(userFound === true)
  {
    if(serviceFound === true)
    {
      console.log("Found user and service name")
      return "Request sent! User " + user + " has requested access to " + service
    }
    else
    {
      console.log("Service name not found")
      return "Service not found, please review service name"
    }
  }
  else
  {
    console.log("User name not found")
    return "User not found, please review user name"
  }
}

function miroAccessRequest(user_input) {
  var index = 0;
  var userFound = false;
  var user = "";

  console.log("This is printing")

  while(index < serviceNowKeyWords.employees_discover.length && (userFound === false))
  {
    console.log("Checking index " + index + "Right now")
    if(user_input.search(serviceNowKeyWords.employees_discover[index]))
    {
      console.log("User name found!")
      userFound = true
      user = serviceNowKeyWords.employees_discover[index]
    }
    index++;
  }


  if(userFound === true)
  {
    console.log("User name was found!")
    return "Miro request sent for user " + user
  }
  else
  {
    console.log("User name not found")
    return "User not found, please review user name"
  }
}

function popularServices(user_input) {
  return "Some of our popular services are Requesting user access, 	Middleware PCC/Static Deployment, Non-Prod - Websphere - Application Deployment, "
  + "Exceptions and Schedule Adjustments, Distributed Code Change, Miro Access Request, Asking BT a Question"
}

function btGroupQuestion(user_input) {
  var index = 0;
  var teamFound = false;
  var teamName = "";

  router.post('/needInfo', function(req, res) {
    /*console.log("Attempting to print info");
    console.log("User response: " + req.body.userinput);
    var user_input = req.body.userinput;
    console.log("Canidates are below")
    var canidates = textCosineSimilarity(user_input, serviceNowquestions)
    console.log(canidates);
    res.send(serviceNowquestions[canidates[0][1]][1](user_input));*/
    res.send("What team would you like to ask a question")
  });


  while(index < serviceNowKeyWords.discover_teams.length && (teamFound === false))
  {
    console.log("Checking index " + index + " Right now")
    if(user_input.search(serviceNowKeyWords.discover_teams[index]))
    {
      console.log("User name found!")
      teamFound = true
      teamName = serviceNowKeyWords.discover_teams[index]
    }
    index++;
  }
}


/*function createNewFunction(questions, url, keyWords, userCreatedQuestion) {
  var newFunc = function (user_input) {
    console.log("The url you want to find is " + url)
    console.log("The key words you want to look for is " + keyWords)
    console.log("The question this function is made for it " + userCreatedQuestion)
    return "Complete"
  };
  questions.push([userCreatedQuestion, newFunc])
  return questions
}*/

function termFreqMap(str) {
        var words = str.split(' ');
        for(var i=0; i<words.length; i++)
        {
            words[i] = words[i].toLowerCase();
            words[i] = words[i].replace(/[^a-zA-Z0-9]/g, '');
        }
        words = sw.removeStopwords(words);
        //console.log(words);
        /*for(var i=0; i<words.length; i++)
        {
            console.log("Doing word info on " + words[i])
            wordpos.lookupNoun(words[i], console.log); //here be code for synonoms
        }*/
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

    function textCosineSimilarity(user_input, baseQuestionArray) {
      //console.log("Made it here1")
      var canidateQuestions = []//will store the confidence and the index
      //console.log("Made it here2")
      for(var i = 0; i < baseQuestionArray.length; i++)
      {
        //console.log("Made it here3")
        var termFreqA = termFreqMap(user_input);
        //console.log(termFreqA);
        var termFreqB = termFreqMap(baseQuestionArray[i][0]);
        //console.log(termFreqB);

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

        //console.log("Printing results for the Term Frequency A and B");
        //console.log(termFreqA);
        //console.log(termFreqB);

        var dict = {};
        addKeysToDict(termFreqA, dict);
        addKeysToDict(termFreqB, dict);

        var termFreqVecA = termFreqMapToVector(termFreqA, dict);
        //console.log("Printing dictonary after Term Frequncy Map on A");
        //console.log(termFreqVecA);
        var termFreqVecB = termFreqMapToVector(termFreqB, dict);
        //console.log("Printing dictonary after Term Frequncy Map on B");
        //console.log(termFreqVecB);

        //console.log("Similarity test below")

        //console.log(cosineSimilarity(termFreqVecA, termFreqVecB))

        var confidence = cosineSimilarity(termFreqVecA, termFreqVecB)

        canidateQuestions.push([confidence, i])

      }
      canidateQuestions.sort(function(a,b) {return b[0]-a[0]});
      //console.log(canidateQuestions)
      //console.log("exiting")
      return canidateQuestions
      }

router.post('/talk', function(req, res) {
  console.log("Attempting to print info");
  console.log("User response: " + req.body.userinput);
  var user_input = req.body.userinput;
  console.log("Canidates are below")
  var canidates = textCosineSimilarity(user_input, serviceNowquestions)
  console.log(canidates);
  res.send(serviceNowquestions[canidates[0][1]][1](user_input));
});

module.exports = router;