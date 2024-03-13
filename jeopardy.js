// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const spinner = $('<div>', { class: 'spinner', style: 'display: none;' });
const fetchButton = $( "<button id='fetch-button' disabled>Fetch Data</button>" );
/*getCategoryIds fetches 100 categories from the Jeopardy API and selects a specified number (numCategories) random categories from this set, and returns their IDs*/

async function getCategoryIds(numCategories) {
  const response = await axios.get("https://rithm-jeopardy.herokuapp.com/api/categories?count=100");
  const allCategories = response.data.map((category) => category.id);
  const selectedCategories = _.sampleSize(allCategories, numCategories);
  return selectedCategories;
  }
  

/* Fetches category data from the Jeopardy API for a given ID and returns an object with the category title and an array of clues (each with a question, answer, and default showing state). */
async function getCategory(catId) {
  const response = await axios.get(
    `https:rithm-jeopardy.herokuapp.com/api/category/?id=${catId}`
  );
  let category = {
    title: response.data.title,
    clue: response.data.clues.map((clue) => ({
      question: clue.question,
      answer: clue.answer,
      showing: "?",
    })),
  };
  return category;
}

/**
 * Asynchronously fetches and displays a table of Jeopardy questions.
 * 
 * This function fetches a specified number of categories from the Jeopardy API,
 * selects a specified number of random questions from each category, and then
 * displays this information in a table. The table's header contains the category
 * titles, and the body contains the questions. Initially, each cell in the body
 * displays a "?".
 */


async function fillTable() {
    const numCategories = 6;
    const numQuestionsPerCat = 5;
    const catIds = await getCategoryIds(numCategories);
    for (let catId of catIds) {
        const category = await getCategory(catId);
        categories.push(category);
      }
      const $thead = $("thead");
      $thead.empty();
      let $tr = $("<tr>");
      for (let [catIdx, category] of categories.entries()) {
        $tr.append($("<th>").text(category.title));
      }
      $thead.append($tr);
      const $tbody = $("tbody");
  $tbody.empty();
  for (let clueIdx = 0; clueIdx < numQuestionsPerCat; clueIdx++) {
    $tr = $("<tr>");
    for (let [catIdx, category] of categories.entries()) {
      $tr.append($("<td>").attr("id", `${catIdx}-${clueIdx}`).text("?"));
    }
    $tbody.append($tr);
  }
}
   

/**
 * Handles the event of a user clicking on a cell in a Jeopardy game.
 *
 * This function retrieves the clue associated with the clicked cell, determines
 * whether to display the question, answer, or ignore the click based on the 
 * current state of the cell, and updates the cell's text accordingly.
 */

function handleClick(evt) {
    const id = evt.target.id;
    const [catIdx, clueIdx] = id.split("-");
    const clue = categories[catIdx].clue[clueIdx];
    let msg;
    msg = !clue.showing ? clue.question :
    (clue.showing === "question" ? clue.answer: null);
    if(msg === null){
        return;
    }
    clue.showing = clue.showing ? "answer" : "question";
    $(`#${id}`).text(msg);
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $("thead").empty();
    $("tbody").empty();
    spinner.show();
    $("body").append(fetchButton); 
    fetchButton.prop("disabled", false);
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
