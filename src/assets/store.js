import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            token: localStorage.getItem('token') || '',
            activeSlide: 0,
            registeredCamera: null
        }
    },
    mutations: {
        changeToken(state, value) {
            state.token = value
            localStorage.setItem('token', value);
        },
        changeActiveSlide(state, value) {
            state.activeSlide = value
        },
        changeRegisteredCamera(state, value) {
            state.registeredCamera = value
        }
    }
})

export default store;