import * as yup from 'yup'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const state = proxy({
    url: '',
    feeds: [],
    message: '',
    error: '',
})

const schema = yup.string().trim().url().required()

const validate = (data) => {
    return schema.validate(data)
    .then(validData => {
        state.feeds.push(validData)
        state.message = 'RSS успешно загружен'
        state.error = ''
        return validData
    })
    .catch(error => {
        state.error = 'Ссылка должна быть валидным URL'
        throw error
    })
}


const updateUI = (value, input, messageField) => {
    messageField.textcontent = ''
    
    return validate(value)
        .then(() => {
            input.style.border = ''
            messageField.textContent = state.message
            messageField.style.color = 'green'
        })
        .catch(error => {
            input.style.border = '1.5px solid red'
            messageField.textContent = state.error
            messageField.style.color = 'red'
        })
}

export default updateUI
