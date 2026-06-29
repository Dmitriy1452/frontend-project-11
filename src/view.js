import * as yup from 'yup'
import { proxy, subscribe } from 'valtio/vanilla'

const state = proxy({
    url: '',
    feeds: [],
    message: '',
    error: '',
    isLoading: true,
})

const schema = yup
    .string()
    .trim()
    .url('Ссылка должна быть валидным URL')
    .required('URL обязателен')
    .test('unique-value', 'RSS уже существует', (value) => {
        if (!value) return true

        const trimmedValue = value.trim()

        const isDuplicate = state.feeds.includes(trimmedValue)

        return !isDuplicate
    })

const validate = (data) => {
    state.isLoading = true

    return schema.validate(data)
    .then(validData => {
        state.feeds.push(validData)
        state.message = 'RSS успешно загружен'
        state.error = ''
        state.isLoading = false
        return validData
    })
    .catch(error => {
        state.error = error.message || 'Ссылка должна быть валидным URL'
        state.isLoading = false
        state.message = ''
        throw error
    })
}


const updateUI = (value, input, messageField) => {
    messageField.textContent = ''

    const unsubscribe = subscribe(state, () => {
        if (state.message) {
            messageField.textContent = state.message
            messageField.style.color = 'green'
            input.style.border = ''
        } else if (state.error) {
            messageField.textContent = state.error
            messageField.style.color = 'red'
            input.style.border = '1.5px solid red'
        } else {
            messageField.textContent = ''
            input.style.border = ''
        }
    })

    validate(value)
        .finally(() => {
            state.message = ''
            state.error = ''
            state.isLoading = false
            unsubscribe()
        })
        .catch(() => {})

    return unsubscribe
}

export default updateUI