import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_WEATHER_KEY
console.log("🔑 API KEY usada:", import.meta.env.VITE_WEATHER_KEY);

const getWeather = (lat, lon) => {

  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  return axios.get(url).then(response => response.data)

}

export default { getWeather }
