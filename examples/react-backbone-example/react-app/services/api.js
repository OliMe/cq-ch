import apisauce from 'apisauce'
const BASE_URL = 'https://cors-anywhere.herokuapp.com/'

const create = () => {
  const api = apisauce.create({
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json; charset=UTF-8',
    },
    timeout: 20000,
  })
  const getSettlementList = (payload, headers) => {
    return api.get(`${BASE_URL}https://www.sima-land.ru/api/v3/settlement/`, payload, headers)
  }
  const getIp = () => api.get(`${BASE_URL}https://api.ipify.org/?format=json`)

  return {
    getSettlementList,
    getIp,
    _axiosInstance: api.axiosInstance,
    _apiInstance: api,
  }
}

export default { create }
