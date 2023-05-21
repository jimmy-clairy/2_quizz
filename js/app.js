async function fetchData() {
    const res = await fetch("../db/data.json")
    if (res.ok) {
        return await res.json()
    }
    throw new Error("Impossible de contactez le serveur")
}

const dataQuestions = await fetchData()
console.log(dataQuestions);

const numberOfQuestion = Number(prompt("Nombre question max 10"))
/** Create Number Random */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
console.log(dataQuestions.length);
console.log(getRandomInt(dataQuestions.length));
const goodResponses = []

const quizForm = document.getElementById("quiz-form")

let numberQuestion = 1
for (let i = 0; i < numberOfQuestion; i++) {
    const randomQuestion = getRandomInt(dataQuestions.length)


    const questionBlock = document.createElement("div")
    questionBlock.setAttribute("class", "question-block")
    const questionTitle = document.createElement("h2")
    questionTitle.innerText = dataQuestions[randomQuestion].question

    quizForm.append(questionBlock)
    questionBlock.append(questionTitle)

    /** Create input */
    let numberResponse = 1
    for (const [key, value] of Object.entries(dataQuestions[randomQuestion].response)) {
        const responseBlock = document.createElement("div")

        const inputResponse = document.createElement("input")
        inputResponse.setAttribute("type", "radio")
        inputResponse.setAttribute("id", `q${numberQuestion}-${numberResponse}`)
        inputResponse.setAttribute("name", `q${numberQuestion}`)
        inputResponse.setAttribute("value", key)
        if (numberResponse === 1) {
            inputResponse.setAttribute("checked", "")
        }

        const labelResponse = document.createElement("label")
        labelResponse.setAttribute("for", `q${numberQuestion}-${numberResponse}`)
        labelResponse.innerText = value

        questionBlock.append(responseBlock)
        responseBlock.append(inputResponse, labelResponse)

        numberResponse++
    }
    goodResponses.push(dataQuestions[randomQuestion].goodResponse)

    numberQuestion++
}

const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(resultQuestion());
    console.log(goodResponses);
    compareResponse()
})

function resultQuestion() {
    const results = []
    const allChecked = document.querySelectorAll('input[type="radio"]:checked')
    allChecked.forEach((c) => results.push(c.value))
    return results
}

// const emojis = ["👎", "😭", "👀", "✨", "✔️", "🎉"];
// const color = ["red", "orange", "purple", "blue", "yellowgreen", "green"];

function compareResponse() {
    const results = resultQuestion()
    const questionBlocks = document.querySelectorAll(".question-block")
    let i = 0;
    let score = 0;

    for (const result of results) {

        if (result === goodResponses[i]) {
            questionBlocks[i].classList.remove("wrongResponse")
            questionBlocks[i].classList.add("goodResponse")
            score++
        } else {
            questionBlocks[i].classList.remove("goodResponse")
            questionBlocks[i].classList.add("wrongResponse")
        }
        i++
    }
    showResult(score)
}

const [titleResult, mark] = document.querySelectorAll('.results p')

function showResult(score) {
    titleResult.textContent = score === goodResponses.length ? '🥳 Youpi 🥳' : 'Retentez votre chance'
    mark.textContent = `Vous avez ${score}/${goodResponses.length} bonne reponse`
}

// RESET COLOR BACKGROUND
const radioInputs = document.querySelectorAll('input[type="radio"]')

radioInputs.forEach(radioInput => radioInput.addEventListener('input', () => {
    radioInput.parentNode.parentNode.classList.remove("goodResponse", "wrongResponse")
}))