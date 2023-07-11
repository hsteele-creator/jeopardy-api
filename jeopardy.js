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
const numCategories = 6;
const questionsPerCat = 5;
const $body = $("body")
const $table = $("<table>");
const $loading = $("<img src=https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif>");
const $loadingDiv = $(".loading");
const $main = $(".main");
const $filter = $(".filter");
const random = Math.floor(Math.random() * 100);
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */


async function getCategoryIds() {
    const response = await axios.get("http://jservice.io/api/categories?count=100");

    const responseData = response.data;

    

    const filteredData = responseData.filter(({clues_count}) => 
    clues_count > 50)

    console.log(filteredData);

    const IDsArray = filteredData.map(result => {
        return result.id;
    })

    const splicedArray = IDsArray.slice(11, 17);
    return splicedArray;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const response = await axios.get(`http://jservice.io/api/category?id=${catId}`)

    const responseData = response.data;

    const categoryData = {
        title: responseData.title,
        clues: [{
            question: responseData.clues[0].question,
            answer: responseData.clues[0].answer,
            showing: "null"
        },
        {
            question: responseData.clues[1].question,
            answer: responseData.clues[1].answer,
            showing: "null"
        },
        {
            question: responseData.clues[2].question,
            answer: responseData.clues[2].answer,
            showing: "null"
        },
        {
            question: responseData.clues[3].question,
            answer: responseData.clues[3].answer,
            showing: "null"
        },
        {
            question: responseData.clues[4].question,
            answer: responseData.clues[4].answer,
            showing: "null"
        }]
    }

    return categoryData;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */


async function fillTable() {

    $table.empty();
    // $main.empty();

    //     const $topRow = $("<tr>");

    for (let id of await getCategoryIds()) {
        categories.push(await getCategory(id));
    }

    const $tHead = $("<thead>");
    const $tBody = $("<tbody>");

    for (let i = 0; i < numCategories; i++) {
        const $tableHeaders = $("<th>");
        $tableHeaders.text(categories[i].title);
        $tHead.append($tableHeaders);
        $table.append($tHead)
        $body.append($table);
        const $tableCell = $("<th>");
        $tBody.append($tableCell);
        $table.append($tBody);
        $main.empty();
        $main.append($table);

        for (let j = 0; j < questionsPerCat; j++) {
            const $cell = $("<td>");
            $cell.text("?");
            categories[i].clues[j].showing = "null";
            $cell.on("click", function () {
               

                $cell.text(categories[i].clues[j].showing === "null" ? categories[i].clues[j].question : categories[i].clues[j].answer) ;

                categories[i].clues[j].showing = "null" ? "answer" : "null";
            })


            $tableCell.append($cell);


        }
    }
    // return $table;
}



/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

// async function handleClick(evt) {

// for(let id of await getCategoryIds()) {
//     categories.push(await getCategory(id));
// }
//     evt.on("click", ("td"), function (e) {
//         console.log("harry steele");
//         for (let i = 0; i < numCategories; i++) {
//             e.target.textContent = categories[i].clues[i].question;
//             console.log(categories[i].clues[i].question)
//         }
//     })
// }
// handleClick($body)

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    //     $table.addClass("hidden");
    //     $body.append($loading);
    //
    $("td").text("");
    $body.prepend($loading);
    $table.addClass("hidden");
}

// showLoadingView();


/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $table.removeClass("hidden");
    $body.remove($loading);
}

hideLoadingView();

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    $main.empty();
    $main.append($loading);
    fillTable();
    if ($($table.hasClass("hidden"))) {
        hideLoadingView()
    } else {
        showLoadingView();
    }
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO


const $restartButton = $("<button>Restart Game </button>");
$filter.append($restartButton);

$restartButton.on("click", setupAndStart);

$().ready(setupAndStart);