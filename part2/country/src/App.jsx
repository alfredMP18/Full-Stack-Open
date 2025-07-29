import { useState, useEffect } from 'react'
import axios from 'axios'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    find countries <input value={filter} onChange={handleFilterChange} />
  </div>
)

const CountryList = ({ countries, handleShow }) => {
  return (
    <>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShow(country.name.common)}>show</button>
        </div>
      ))}
    </>
  )
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng;
    weatherService
      .getWeather(lat, lon)
      .then(data => setWeather(data))
      .catch(error => console.error('Weather error:', error));
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} />

      <h2>Weather in {country.capital}</h2>
      {weather ? (
        <>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};


const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null) 
  }

  const handleShow = (name) => {
    const country = countries.find(c => c.name.common === name)
    setSelectedCountry(country)
  }

  const countriesToShow = countries.filter(country =>
    filter && country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  let content = null

  if (selectedCountry) {
    content = <CountryDetail country={selectedCountry} />
  } else if (countriesToShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length === 1) {
    content = <CountryDetail country={countriesToShow[0]} />
  } else if (countriesToShow.length > 1) {
    content = <CountryList countries={countriesToShow} handleShow={handleShow} />
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      {content}
    </div>
  )
}

export default App
