import axios from 'src/http/axios'

const WaService = {
  async getSession(auth) {
    return axios.get(`/session/start?session=${auth}`)
  },
  async deleteSession(auth) {
    return axios.delete(`/session/logout?session=${auth}`)
  },
  async sendMessage(data) {
    // console.log("Sending message with data:", data);

    return axios.post(`/api/whatsapp/messages/text`, data)
  },
}

export default WaService
