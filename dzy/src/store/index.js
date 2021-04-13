import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    post: null,
    uname: "",
    dept: null
  }
}

const mutations = {
  addpost(state, post) {
    state.user.post = post;
  },
  adddept(state, dept) {
    state.user.dept = dept;
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
