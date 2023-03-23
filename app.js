const responses = ["b", "a", "b", "a", "c", "b", "c", "b", "b", "a"];
const emojis = ["👎", "😭", "👀", "✨", "✔️", "🎉"];
const color = ["red", "orange", "purple", "blue", "yellowgreen", "green"];

const form = document.querySelector('form')
const questionBlock = document.querySelectorAll('.question-block')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    compareResponse()
})

function resultQuestion() {
    const results = []
    const allChecked = document.querySelectorAll('input[type="radio"]:checked')
    allChecked.forEach((c) => results.push(c.value))
    return results
}

function compareResponse() {
    const results = resultQuestion()
    let i = 0;
    let score = 0;

    for (const result of results) {

        if (result === responses[i]) {
            questionBlock[i].classList.remove("wrongResponse")
            questionBlock[i].classList.add("goodResponse")
            score++
        } else {
            questionBlock[i].classList.remove("goodResponse")
            questionBlock[i].classList.add("wrongResponse")
        }
        i++
    }
    showResult(score)
}

const [titleResult, mark] = document.querySelectorAll('.results p')

function showResult(score) {
    let scoreMore5 = (Math.round(score / 2))

    titleResult.textContent = score === responses.length ? '🥳 Youpi 🥳' : 'Retentez votre chance'
    mark.textContent = `${emojis[scoreMore5]} Vous avez ${score}/${responses.length} bonne reponse ${emojis[scoreMore5]}`
    mark.style.color = color.at(scoreMore5)
}

// RESET COLOR BACKGROUND
const radioInputs = document.querySelectorAll('input[type="radio"]')

radioInputs.forEach(radioInput => radioInput.addEventListener('input', () => {
    radioInput.parentNode.parentNode.classList.remove("goodResponse", "wrongResponse")
}))