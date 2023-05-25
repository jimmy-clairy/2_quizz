async function fetchData(url) {
    const res = await fetch(url)
    if (res.ok) {
        return res.json()
    }
    throw new Error("Impossible de contacter data.json")
}

/**
 * Returns an array with the question selected
 * @param {string} value 
 * @returns {Promise} Promise object represents questions
 */
async function selectedQuestions(value) {
    let questions = [];

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

/** Create Number Random */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Show the questions
 * @param {number} numberOfQuestion 
 * @param {Object} questions 
 */
function showQuestions(numberOfQuestion, questions) {
    const quizForm = document.getElementById("quiz__form")

    /** Check if number of questions is more to two */
    if (numberOfQuestion > 1) {
        const modal = document.querySelector(".modal.m2")
        modal.style.display = "none"

        const arrayQuestionRandom = []
        for (let i = 0; i < numberOfQuestion; i++) {
            let randomQuestion = getRandomInt(questions.length)

            /** Finds if there is the same random question then replaces for an other */
            const foundSameQuestion = arrayQuestionRandom.find(e => e === randomQuestion)
            if (foundSameQuestion) {
                console.log('Found ' + foundSameQuestion);
                randomQuestion = getRandomInt(questions.length)
            }
            arrayQuestionRandom.push(randomQuestion)

            quizForm.append(createQuestion(i, questions[randomQuestion]))
        }
        console.log(arrayQuestionRandom);

        /** Reset color background */
        const radioInputs = document.querySelectorAll('input[type="radio"]')
        radioInputs.forEach(radioInput => radioInput.addEventListener('input', () => {
            radioInput.parentNode.parentNode.classList.remove("goodResponse", "wrongResponse")
        }))
    }
}

/**
 * Create one question
 * @param {number} numberOfTheQuestion 
 * @param {{question: string, goodResponse: string, response: Object.<string>}} dataQuestion 
 * @returns {HTMLDivElement}
 */
function createQuestion(numberOfTheQuestion, dataQuestion) {
    const questionBlock = document.createElement("div")
    questionBlock.setAttribute("class", "question__block")
    questionBlock.setAttribute("data-response", dataQuestion.goodResponse)

    const questionTitle = document.createElement("h2")
    questionTitle.setAttribute("class", "question__heading")
    questionTitle.innerText = dataQuestion.question

    questionBlock.append(questionTitle)

    /** Create input response */
    let numberResponse = 1
    for (const [key, value] of Object.entries(dataQuestion.response)) {
        const responseBlock = document.createElement("div")

        const inputResponse = document.createElement("input")
        inputResponse.setAttribute("type", "radio")
        inputResponse.setAttribute("id", `q${numberOfTheQuestion}-${numberResponse}`)
        inputResponse.setAttribute("name", `q${numberOfTheQuestion}`)
        inputResponse.setAttribute("value", key)
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

/** Compare response */
function compareResponse() {
    const questionBlocks = document.querySelectorAll("#quiz__form .question__block")
    const results = resultQuestion()
    const responses = goodResponses()

    let score = 0;
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
 * Show the result
 * @param {number} score 
 * @param {string[]} responses 
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

/** Modal if win */
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
    modal.style.display = 'flex';
}

const form1 = document.querySelector('#form1');
form1.addEventListener('submit', async (e) => {
    e.preventDefault();

    /** @constant {string} */
    const selectedValue = document.querySelector('input[name="m1"]:checked').value;
    let questions = await selectedQuestions(selectedValue)
    form1.parentElement.style.display = "none"

    const form2 = document.querySelector('#form2');
    form2.parentElement.style.display = "flex"

    form2.addEventListener("submit", (e) => {
        e.preventDefault()
        const numberOfQuestion = Number(document.getElementById("numberOfQuestion").value)
        showQuestions(numberOfQuestion, questions)
    })
});

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