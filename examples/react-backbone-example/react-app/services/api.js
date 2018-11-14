import apisauce from 'apisauce'
const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://www.sima-land.ru/api/'

const create = () => {
  const api = apisauce.create({
    baseURL: BASE_URL,
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json; charset=UTF-8',
    },
    timeout: 20000,
  })
  const getSettlementById = id => api.get(`v3/settlement/${id}/`)
  const getSettlementList = payload => api.get(`v3/settlement/`, payload)
  const getSettlement = payload => api.get(`v3/settlement/?name=${encodeURI(payload)}`)

  return {
    getSettlementById,
    getSettlement,
    getSettlementList,
    _axiosInstance: api.axiosInstance,
    _apiInstance: api,
  }
}

export default { create }
