import React, { useState } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const continents = [
  { name: 'Asia' },
  { name: 'Europe' },
  { name: 'Africa' },
  { name: 'North-America' },
  { name: 'South-America' },
  { name: 'Oceania' },
  { name: 'Antarctica' }
];

const CovidReport = () => {
  const [continent, setContinent] = useState('');
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showLoader,setShowLoader]=useState(false)

  //actioin clicking on + button, displaying table with population, covid-cases and country name
  const handleContinentClick = async (selectedContinent) => {
    if (continent === selectedContinent) {
      setContinent('');
      setCountries([]);
    } else {
      setContinent(selectedContinent);
      await fetchCountries(selectedContinent);
    }
  };
  
  const fetchCountries = async (selectedContinent) => {
      setShowLoader(true)
    try {
      const response = await axios.get('https://covid-193.p.rapidapi.com/statistics', {
        headers: {
          'x-rapidapi-host': 'covid-193.p.rapidapi.com',
          'x-rapidapi-key': '8dfb8b66cbmsh2df5ea3e36bb658p15c881jsn8ac5ea8938f2' 
        }
      });
      const continentData = response.data.response.filter(
        (item) => item.continent === selectedContinent
      );
      setShowLoader(false)
      setCountries(continentData);
    } catch (error) {
      console.error(error);
      setCountries([]);
    }
    
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://covid-193.p.rapidapi.com/statistics?country=${searchQuery}`, {
        headers: {
          'x-rapidapi-host': 'covid-193.p.rapidapi.com',
          'x-rapidapi-key': '8dfb8b66cbmsh2df5ea3e36bb658p15c881jsn8ac5ea8938f2' 
        }
      });

      if (response.data.response.length > 0) {
        setSearchResult(response.data.response[0]);
        setContinent('');
        setCountries([]);
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error(error);
      setSearchResult(null);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
    setContinent('');
    setCountries([]);
  };

  return (
    <div className="container-sm" style={{ marginTop: "70px" }}>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h2>COVID-19 Reports</h2>
          <Form>
            <Form.Group
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
              controlId="searchForm"
            >
              <Form.Control
                type="text"
                placeholder="Search by country"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ margin: "10px" }}
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                style={{ margin: "10px" }}
              >
                Search
              </Button>
              <Button
                variant="secondary"
                onClick={handleClearSearch}
                style={{ margin: "10px" }}
              >
                Clear
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>

      {searchResult ? (
        <div className="container" style={{ marginTop: "50px" }}>
          <h3>Search Result For {searchQuery}</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Country</th>
                <th>Continent</th>
                <th>Total Cases</th>
                <th>Total Deaths</th>
                <th>Total Tests</th>
                <th>Population</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchResult.country}</td>
                <td>{searchResult.continent}</td>
                <td>{searchResult.cases.total}</td>
                <td>{searchResult.deaths.total}</td>
                <td>{searchResult.tests.total}</td>
                <td>{searchResult.population}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="container">
          <h3>Continents:</h3>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Continent</th>
              </tr>
            </thead>
            <tbody>
              {continents.map((continentItem, index) => (
                <tr key={index}>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {continentItem.name}
                    <button
                      onClick={() => handleContinentClick(continentItem.name)}
                    >
                      {continent === continentItem.name ? "-" : "+"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

         {showLoader? <div class="text-center">
            <div class="spinner-border" role="status">
              <span class="sr-only"></span>
            </div>
          </div>:null}

          {continent && countries && countries.length > 0 && (
            <>
              <h3>Countries in {continent}:</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Covid Cases</th>
                    <th>Population</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country, index) => (
                    <tr key={index}>
                      <td>{country.country}</td>
                      <td>{country.cases.total}</td>
                      <td>{country.population}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CovidReport;
