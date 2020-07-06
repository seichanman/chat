//state = 実際の状態が保存される場所
export const state = () => ({
    message: null
})

//
export const getters = {
message: (state) => state.message
}

export const mutations = {
setMessage(state, { message }) {
    state.message = message
},

deleteMessage(state) {
    state.message = null
},
}