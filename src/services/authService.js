// import axios from '@/http/axios'
import supabase from 'src/config/supabase.js'
const AuthService = {
  async login(user) {
    // let { data, error } = await supabase.auth.signInWithPassword({
    //   email: user.email,
    //   password: user.password,
    // })
    console.log(user)
  },
  async logout(data) {
    // return axios.post(`/logout`, data)
    console.log('logout', data)
  },
}
export default AuthService
