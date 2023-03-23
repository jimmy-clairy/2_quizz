const responses = ["b", "a", "b", "a", "c"];
const emojis = ["👎", "😭", "👀", "✨", "✔️", "🎉"];
const color = ["red", "orange", "purple", "blue", "yellowgreen", "green"];

const form = document.querySelector('form')
const inputs = document.querySelectorAll('input[type="radio"]')
const questionBlock = document.querySelectorAll('.question-block')
const [titleResult, mark] = document.querySelectorAll('.results p')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    compareResponse()
})

function resultQuestion() {
    const results = []
    for (const input of inputs) {
        if (input.checked) {
            results.push(input.value)
        }
    }
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

function showResult(score) {
    titleResult.textContent = score === responses.length ? '🥳 Youpi 🥳' : 'Retentez votre chance'
    mark.textContent = `${emojis.at(score)} Vous avez ${score}/${responses.length} bonne reponse ${emojis.at(score)}`
    mark.style.color = color.at(score)
}