import React, { useState, useEffect } from 'react';
import Countries from './components/Countries/Countries';
import Header from './components/Header/Header';

export default function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredPopulation, setFilteredPopulation] = useState(0);

  useEffect(() => {
    const fetchAllCountries = async () => {
      const res = await fetch('https://restcountries.eu/rest/v2/all');
      const json = await res.json();
      const allCountries = json.map(
        ({ name, numericCode, flag, population }) => {
          return {
            id: numericCode,
            name,
            filterName: name.toLowerCase(),
            flag,
            population,
          };
        }
      );
      const filteredPopulation = calculateTotalPopulationFrom(allCountries);
      setAllCountries(allCountries);
      setFilteredCountries(Object.assign([], allCountries));
      setFilteredPopulation(filteredPopulation);
    };
    fetchAllCountries();
  }, []);

  const handleChangeFilter = (newText) => {
    const filterLowerCase = newText.toLowerCase();
    const filteredCountries = allCountries.filter((country) =>
      country.filterName.includes(filterLowerCase)
    );
    const filteredPopulation = calculateTotalPopulationFrom(filteredCountries);
    setFilter(newText);
    setFilteredCountries(filteredCountries);
    setFilteredPopulation(filteredPopulation);
  };

  const calculateTotalPopulationFrom = (countries) => {
    const filteredPopulation = countries.reduce((acc, curr) => {
      return acc + curr.population;
    }, 0);
    return filteredPopulation;
  };

  return (
    <div className="container">
      <h1 style={styles.centeredTitle}>React Countries</h1>
      <Header
        filter={filter}
        countryCount={filteredCountries.length}
        onChangeFilter={handleChangeFilter}
        totalPopulation={filteredPopulation}
      />
      <Countries countries={filteredCountries} />
    </div>
  );
}

const styles = {
  centeredTitle: { textAlign: 'center' },
};
