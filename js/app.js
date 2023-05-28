/**
 * Performs an HTTP GET request to fetch JSON data from the specified URL.
 * @param {string} url - The URL for the GET request.
 * @returns {Promise} - A promise containing the JSON data from the response.
 * @throws {Error} - Throws an error if the request fails.
 */
async function fetchData(url) {
    const res = await fetch(url)
    if (res.ok) {
        return res.json()
    }
    throw new Error("Impossible de contacter data.json")
}

/**
 * Returns an array of selected questions based on the specified value.
 * @param {string} value - The selected value (html, css, js).
 * @returns {Promise} - A promise containing the array of questions.
 */
async function selectedQuestions(value) {
    let questions = []

    if (value === "html") {
        questions = await fetchData("./db/dataHTML.json")
    } else if (value === "css") {
        questions = await fetchData("./db/dataCSS.json")
    } else if (value === "js") {
        questions = await fetchData("./db/dataJS.json")
    } else {
        const questionsHTML = await fetchData("./db/dataHTML.json")
        const questionsCSS = await fetchData("./db/dataCSS.json")
        const questionsJS = await fetchData("./db/dataJS.json")

        questions = questionsHTML.concat(questionsCSS, questionsJS)
    }
    return questions
}

/**
 * Displays questions in the location based on the specified count.
 * @param {number} numberOfQuestion - The number of questions to display.
 * @param {Object[]} questions - The array of questions.
 */
function showQuestionsRandom(numberOfQuestion, questions) {
    const quizForm = document.getElementById("quiz__form")

    // Check if the number of questions is more than two
    if (numberOfQuestion <= 1) {
        return
    }

    let numberOfTheQuestion = 1
    const arrayQuestionsRandom = []
    // Generates an array of random questions without duplicates
    while (arrayQuestionsRandom.length < numberOfQuestion) {
        const randomQuestion = getRandomInt(questions.length)

        if (!arrayQuestionsRandom.includes(randomQuestion)) {
            arrayQuestionsRandom.push(randomQuestion)
            quizForm.append(createQuestion(numberOfTheQuestion, questions[randomQuestion]))
            numberOfTheQuestion++
        }
    }

    const modal = document.querySelector(".modal.m2")
    modal.style.display = "none"

    resetColor()
}

/**
 * Displays all questions in the location.
 * @param {Object[]} questions - The array of questions. 
 */
function showAllQuestion(questions) {
    const quizForm = document.getElementById("quiz__form")
    let numberOfTheQuestion = 1
    for (const question of questions) {
        quizForm.append(createQuestion(numberOfTheQuestion, question))
        numberOfTheQuestion++
    }

    const modal = document.querySelector(".modal.m2")
    modal.style.display = "none"

    resetColor()
}

/**
 * Generates a random integer between 0 and max.
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} - The generated random integer.
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

/**
 * Resets the colors of the selected responses.
 */
function resetColor() {
    const radioInputs = document.querySelectorAll('input[type="radio"]')
    radioInputs.forEach(radioInput => radioInput.addEventListener('input', () => {
        radioInput.parentNode.parentNode.classList.remove("goodResponse", "wrongResponse")
    }))
}

/**
 * Creates an HTML question block from the specified data.
 * @param {number} numberOfTheQuestion - The question number.
 * @param {{question: string, goodResponse: string, response: Object.<string>}} dataQuestion 
 * @returns {HTMLDivElement} - The div element containing the question.
 */
function createQuestion(numberOfTheQuestion, dataQuestion) {
    const questionBlock = document.createElement("div")
    questionBlock.classList.add("question__block")
    questionBlock.dataset.response = dataQuestion.goodResponse

    const bubbleNumber = document.createElement("div")
    bubbleNumber.classList.add("question__bubble")
    bubbleNumber.innerText = numberOfTheQuestion
    if (dataQuestion.type === "html") {
        bubbleNumber.classList.add("html")
    } else if (dataQuestion.type === "css") {
        bubbleNumber.classList.add("css")
    } else if (dataQuestion.type === "js") {
        bubbleNumber.classList.add("js")
    }

    const questionTitle = document.createElement("h2")
    questionTitle.classList.add("question__heading")
    questionTitle.innerText = dataQuestion.question

    questionBlock.append(
        bubbleNumber, questionTitle)

    /** Creates input response */
    let numberResponse = 1
    for (const [key, value] of Object.entries(dataQuestion.response)) {
        const responseBlock = document.createElement("div")

        const inputResponse = document.createElement("input")
        inputResponse.type = "radio"
        inputResponse.id = `q${numberOfTheQuestion}-${numberResponse}`
        inputResponse.name = `q${numberOfTheQuestion}`
        inputResponse.value = key
        if (numberResponse === 1) {
            inputResponse.setAttribute("checked", "")
        }

        const labelResponse = document.createElement("label")
        labelResponse.setAttribute("for", `q${numberOfTheQuestion}-${numberResponse}`)
        labelResponse.innerText = value

        questionBlock.append(responseBlock)
        responseBlock.append(inputResponse, labelResponse)

        numberResponse++
    }
    return questionBlock
}

/**
 * Return an array with questions result
 * @returns {string[]}
 */
function resultQuestion() {
    const results = []
    const allChecked = document.querySelectorAll('#quiz__form input[type="radio"]:checked')
    allChecked.forEach((c) => results.push(c.value))
    return results
}

/**
 * Return an array with the responses
 * @returns {string[]}
 */
function goodResponses() {
    const responses = []
    const questionBlocks = document.querySelectorAll("#quiz__form .question__block")
    questionBlocks.forEach((q) => responses.push(q.dataset.response))
    return responses
}

/**
 * Compares the selected responses with the correct responses and displays the result.
 */
function compareResponse() {
    const questionBlocks = document.querySelectorAll("#quiz__form .question__block")
    const results = resultQuestion()
    const responses = goodResponses()
    let score = 0
    for (let i = 0; i < results.length; i++) {

        if (results[i] === responses[i]) {
            questionBlocks[i].classList.remove("wrongResponse")
            questionBlocks[i].classList.add("goodResponse")
            score++
        } else {
            questionBlocks[i].classList.remove("goodResponse")
            questionBlocks[i].classList.add("wrongResponse")
        }
    }
    showResult(score, responses)
}

/**
 * Displays the quiz result with an appropriate message and background color.
 * @param {number} score - The obtained score.
 * @param {string[]} responses - The correct responses.
 */
function showResult(score, responses) {
    const result = document.querySelector('.result')
    const [titleResult, mark] = document.querySelectorAll('.result p')

    const emojis = ["👎", "😭", "👀", "✨", "🎉"];
    let emoji = ""
    const resultInPercentages = (score / responses.length) * 100
    if (resultInPercentages < 25) {
        result.style.background = 'lightcoral'
        emoji = emojis[0]
    } else if (resultInPercentages < 50) {
        result.style.background = 'lightsalmon'
        emoji = emojis[1]
    } else if (resultInPercentages < 75) {
        result.style.background = 'lightskyblue'
        emoji = emojis[2]
    } else if (resultInPercentages < 100) {
        result.style.background = 'lightyellow'
        emoji = emojis[3]
    } else {
        result.style.background = 'lightgreen'
        emoji = emojis[4]
        modalWin()
    }

    titleResult.textContent = score === responses.length ? '🥳 Youpi 🥳' : 'Retentez votre chance'
    mark.textContent = `${emoji}Vous avez ${score}/${responses.length} bonne reponse${emoji}`
}

/**
 * Displays a modal window in case of victory with the option to play again.
 */
function modalWin() {
    const modal = document.querySelector('.modal.win')
    const btnX = modal.querySelector('.modal__X')
    btnX.addEventListener('click', () => {
        modal.style.display = 'none'
    })
    const btnReload = modal.querySelector('button')
    btnReload.addEventListener('click', () => {
        location.reload()
    })
    modal.style.display = 'flex'
}

const form1 = document.querySelector('#form1');
form1.addEventListener('submit', async (e) => {
    e.preventDefault()

    /** @constant {string} */
    const selectedValue = document.querySelector('input[name="m1"]:checked').value;
    let questions = await selectedQuestions(selectedValue)
    form1.parentElement.style.display = "none"

    const form2 = document.querySelector('#form2')

    const spanAllQuestion = form2.querySelectorAll('.spanAllQuestions')
    spanAllQuestion.forEach(s => s.innerText = questions.length)
    const numberOfQuestion = document.getElementById("numberOfQuestion")
    numberOfQuestion.max = questions.length

    form2.parentElement.style.display = "flex"

    form2.addEventListener("submit", (e) => {
        e.preventDefault()
        const numberOfQuestion = Number(document.getElementById("numberOfQuestion").value)
        const allQuestions = document.querySelector('input[name="allQuestions"]').checked;
        if (allQuestions) {
            showAllQuestion(questions)
        } else {
            showQuestionsRandom(numberOfQuestion, questions)
        }
    })
})

const form3 = document.getElementById('quiz__form')
let tentative = 0
form3.addEventListener('submit', (e) => {
    e.preventDefault()

    tentative++
    compareResponse()
    const h3 = document.querySelector('.modal.win h3')
    let winString = ""
    if (tentative === 1) {
        winString = `<span style="color: goldenrod;">🎊 Vous étes un champion 🎊<br>vous avez reussi avec 1 seule tentative</span>`
    } else {
        winString = `<span>😉 Avec ${tentative} tentatives 😉<br> vous pouvez mieux faire</span>`
    }
    h3.innerHTML = `😁 Bravo vous avez gagné 😁<br><br>${winString}<br><br>Voulez-vous recommencer un nouveau quiz ?`
})

// Event listeners and error handling
window.addEventListener('error', function (event) {
    console.log('Une erreur est survenue :', event.error)
});