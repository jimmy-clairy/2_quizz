const res = await fetch("./db/data.json")
if (res.ok !== true) {
    throw new Error("Impossible de contacter data.json")
}
const dataQuestions = await res.json()

const modalForm = document.querySelector("form.modal__container")
modalForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const numberOfQuestion = Number(document.getElementById("numberOfQuestion").value)
    const quizForm = document.getElementById("quiz__form")

    if (numberOfQuestion > 1) {
        const modal = document.querySelector(".modal")
        modal.style.display = "none"

        for (let i = 0; i < numberOfQuestion; i++) {
            quizForm.append(createQuestion(i, dataQuestions))
        }

        // RESET COLOR BACKGROUND
        const radioInputs = document.querySelectorAll('input[type="radio"]')
        radioInputs.forEach(radioInput => radioInput.addEventListener('input', () => {
            radioInput.parentNode.parentNode.classList.remove("goodResponse", "wrongResponse")
        }))
    }
})

/**
 * Create one question
 * @param {number} numberOfTheQuestion 
 * @param {object} dataQuestions 
 * @returns {HTMLDivElement}
 */
function createQuestion(numberOfTheQuestion, dataQuestions) {
    const randomQuestion = getRandomInt(dataQuestions.length)

    const questionBlock = document.createElement("div")
    questionBlock.setAttribute("class", "question__block")
    questionBlock.setAttribute("data-response", dataQuestions[randomQuestion].goodResponse)

    const questionTitle = document.createElement("h2")
    questionTitle.setAttribute("class", "question__heading")
    questionTitle.innerText = dataQuestions[randomQuestion].question

    questionBlock.append(questionTitle)

    /** Create input response */
    let numberResponse = 1
    for (const [key, value] of Object.entries(dataQuestions[randomQuestion].response)) {
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

/** Create Number Random */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const form = document.getElementById('quiz__form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    compareResponse()
})

/**
 * Return an array with questions result
 * @returns {string[]}
 */
function resultQuestion() {
    const results = []
    const allChecked = document.querySelectorAll('input[type="radio"]:checked')
    allChecked.forEach((c) => results.push(c.value))
    return results
}
/**
 * Return an array with the responses
 * @returns {string[]}
 */
function goodResponses() {
    const responses = []
    const questionBlocks = document.querySelectorAll(".question__block")
    questionBlocks.forEach((q) => responses.push(q.dataset.response))
    return responses
}

function compareResponse() {
    const questionBlocks = document.querySelectorAll(".question__block")
    const results = resultQuestion()
    const responses = goodResponses()

    let i = 0;
    let score = 0;

    for (const result of results) {

        if (result === responses[i]) {
            questionBlocks[i].classList.remove("wrongResponse")
            questionBlocks[i].classList.add("goodResponse")
            score++
        } else {
            questionBlocks[i].classList.remove("goodResponse")
            questionBlocks[i].classList.add("wrongResponse")
        }
        i++
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
        modalReload()
    }

    titleResult.textContent = score === responses.length ? '🥳 Youpi 🥳' : 'Retentez votre chance'
    mark.textContent = `${emoji}Vous avez ${score}/${responses.length} bonne reponse${emoji}`
}

function modalReload() {
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