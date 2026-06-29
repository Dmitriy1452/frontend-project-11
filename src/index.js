import updateUI from './view.js'

const form = document.querySelector('.form-group')
const input = document.getElementById('RSS-link')
const messageField = document.querySelector('.input-message')

input.focus()

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const content = formData.get('link')

    updateUI(content, input, messageField)

    form.reset()
    input.focus()
})