import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    post: null,
    uname: "",
  }
}

const mutations = {
  addpost(state, post) {
    state.user.post = post;
  },
  addusername(state, uname) {
    state.user.uname = uname;
  },
  logout(state) {
    state.user = {
      post: null,
      uname: "",
    }
  }
}

const actions = {}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
