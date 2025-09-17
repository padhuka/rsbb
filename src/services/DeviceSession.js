import supabase from 'src/config/supabase'
// import { useAuthStore } from 'src/stores/storeAuth'

const DeviceSession = {
  async getDeviceSessions() {
    // const storeAuth = useAuthStore()
    const userid = 'fe223dfc-7573-43c0-8f7d-849d41956117'
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('status', 'connected')
      .eq('user_id', userid)

    if (error) {
      // storeAuth.showSnackbar(error.message)
      return []
    }

    // console.log("data", data);
    return data || []
  },

  async getWaSessions(deviceId) {
    // const storeAuth = useAuthStore()
    let { data } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('status', 'connected')
      .eq('session_device_id', deviceId)
      .order('created_at', { ascending: false }) // <-- order by latest
    // if (error) storeAuth.showSnackbar(error.message)
    if (data) {
      return data[0] || []
    }
  },
}

export default DeviceSession
