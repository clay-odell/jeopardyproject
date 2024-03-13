let categories = [];
const $jeopardy = $("<h1>Jeopardy</h1>");
$("body").append($jeopardy);
/*getCategoryIds fetches 100 categories from the Jeopardy API and selects a specified number (numCategories) random categories from this set, and returns their IDs*/

async function getCategoryIds(numCategories) {
    try {
      const response = await axios.get(
        "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
      );
      const allCategories = response.data.map((category) => category.id);
      const selectedCategories = _.shuffle(_.sampleSize(allCategories, numCategories));
      return selectedCategories;
    } catch (error) {
      console.error("Category Ids couldn't be retrieved", error);
    }
  }

/* Fetches category data from the Jeopardy API for a given ID and returns an object with the category title and an array of clues (each with a question, answer, and default showing state). Clues are shuffled as well*/
async function getCategory(catId) {
    try {
      const response = await axios.get(
        `https://rithm-jeopardy.herokuapp.com/api/category/?id=${catId}`
      );
      const shuffledClues = _.shuffle(response.data.clues);
  
      let category = {
        title: response.data.title.toUpperCase(),
        clue: shuffledClues.slice(0, 5).map((clue) => ({
          question: clue.question.toUpperCase(),
          answer: clue.answer.toUpperCase(),
          showing: "?",
        })),
      };
      return category;
    } catch (error) {
      console.error("Category fetching failed...", error);
      
    }
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
    categories = [];
  let categoryIds = await getCategoryIds(numCategories);
  for (let id of categoryIds) {
    let category = await getCategory(id);
    categories.push(category);
  }
  let $table = $("<table>");
  let $thead = $("<thead>").attr("id", "jeopardy");
  let $headerRow = $("<tr>");
  for (let category of categories) {
    let $th = $("<th>").text(category.title);
    $headerRow.append($th);
  }
  $thead.append($headerRow);
  $table.append($thead);
  let $tbody = $("<tbody>");
  for (let i = 0; i < 5; i++) {
    let $tr = $("<tr>");
    for (let j = 0; j < categories.length; j++) {
      let $td = $("<td>").text(categories[j].clue[i].showing);
      $td.attr('id', `${j}-${i}`); // Add this line
      $tr.append($td);
    }
    $tbody.append($tr);
  }
  $table.append($tbody);
  $("body").append($table);
  hideLoadingView();
}
$('tbody').on('click', 'td', handleClick); 
/**
 * Handles the event of a user clicking on a cell in a Jeopardy game.
 *
 * This function retrieves the clue associated with the clicked cell, determines
 * whether to display the question, answer, or ignore the click based on the
 * current state of the cell, and updates the cell's text accordingly.
 */

function handleClick(evt) {
    let $cell = $(evt.target);
    let [catIdx, clueIdx] = $cell.attr('id').split('-').map(Number);
    let clue = categories[catIdx].clue[clueIdx];
    if ($cell.text() === '?') {
      $cell.text(clue.question);
    } else if ($cell.text() === clue.question) {
      $cell.text(clue.answer);
    } else {
      return;
    }
  }
  $('td').on('click', handleClick);
  

/** Wipe the current Jeopardy board, show the loading spinner */

function showLoadingView() {
    const $thead = $("thead");
    const $tbody = $("tbody");
    $thead.empty();
    $tbody.empty();
    const $spinner = $('<div>').addClass('spinner');
    $('body').append($spinner);
  }
  

/** Remove the loading spinner and update the button*/
function hideLoadingView() {
  const $spinner = $('.spinner');
  $spinner.remove();
}

async function setupAndStart() {
    showLoadingView();
    await fillTable();
    hideLoadingView();
    $('td').on('click', handleClick);
  }
  
  $(function() {
    const $button = $('<button>').attr('id', 'start').text('Start/Restart');
    $('body').append($button);
    $('#start').on('click', setupAndStart);
  });
  


