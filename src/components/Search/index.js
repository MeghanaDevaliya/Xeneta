

import { useEffect, useState } from 'react';
import '../../styles/search.css';
import axios from 'axios';
import ShowGraph from '../CreateGraph/index'
import SwapLogo from '../../images/swaplogo.png'

const SearchPage = () => {

  const [portData, setPortData] = useState([]);
  const [sourceValue, setSourceValue] = useState([]);
  const [destinationValue, setDestinationValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [activityChanged, setActivityChanged] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [storeMarketData, setStoreMarketData] = useState();
  const [createGraph, setCreateGraph] = useState(false)

// calling api on load to get the ports//
  const authAxios = axios.create({
    headers: {
      'x-api-key': 'UupJCj89E94rVALvskqHz1EN179vGDuo50eJNKq4'
    }
  });

  const callApi = async () => {
    try {
      const result = await authAxios.get('https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com/prod/ocean/ports');
      setPortData(result.data)
    }
    catch (e) {
      setServiceError(e)
    }
  };

  useEffect(() => {
    callApi()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSourceInput = (sourceValue) => {
    setActivityChanged(false)
    let matches = []
    if (sourceValue.length > 0) {
      matches = portData.filter(port => {
        const regex = new RegExp(`${sourceValue}`, "gi");
        return (port.name.match(regex) || port.code.match(regex))

      })
    }
    setSuggestions(matches)
    setSourceValue(sourceValue)
  }
  const handleDestinationInput = (destinationValue) => {
    setActivityChanged(false)
    let matches = []
    if (destinationValue.length > 0) {
      matches = portData.filter(port => {
        const regex = new RegExp(`${destinationValue}`, "gi")
        return (port.name.match(regex) || port.code.match(regex))
      })
    }
    setDestSuggestions(matches)
    setDestinationValue(destinationValue)

  }

  const onSuggestHandler = (name, code) => {
    setSourceValue([name, code]);
    setSuggestions([]);

  }

  const onDestSuggestHandler = (name, code) => {
    setDestinationValue([name, code]);
    setDestSuggestions([]);

  }

  // api call for submitting the ports code //
  const SubmitPorts = async () => {
    const result =
      await authAxios.get(`https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com/prod/ocean/rates?origin=${sourceValue[1]}&destination=${destinationValue[1]}`)
    setStoreMarketData(result.data)
    setActivityChanged(true)
    setCreateGraph(true)

  }
  const swapValues = () => {
    const atemp = sourceValue
    const btemp = destinationValue
    setSourceValue(btemp)
    setDestinationValue(atemp)
    setActivityChanged(false)
  }


  return (
    <>
      {serviceError && (
        <div style={{color:'red'}}> <p>something went wrong</p></div>
      )}
      <div className="Outercontainer">
        <div className="container">
          <div className="inputBox">
            <div className='inputSourceCon'>
              <input
                value={sourceValue}
                onChange={(e) => handleSourceInput(e.target.value)}
                placeholder='Source'
              />
            </div>
            <div>
              <img style={{ paddingLeft: '60px', display: 'flex', width: '40px' }} src={SwapLogo} onClick={swapValues} alt='swap'></img>
            </div>
            <div className='inputDestinationCon'>
              <input
                value={destinationValue}
                onChange={(e) => handleDestinationInput(e.target.value)}
                placeholder='Destination'
              />
            </div>

            <div className="buttonContainer">
              <button style={{ width: '120px' }} disabled={activityChanged} onClick={SubmitPorts}>Search</button>
            </div>

          </div>

          {suggestions && suggestions.map((suggestion, i) =>
            <div key={i} className="autoCompleteSearch"
              onClick={() => onSuggestHandler(suggestion.name, suggestion.code)} >
              {suggestion.name} </div>
          )}

          {destSuggestions && destSuggestions.map((destsuggestion, j) =>
            <div key={j} className="autoCompleteSearchDest"
              onClick={() => onDestSuggestHandler(destsuggestion.name, destsuggestion.code)} >
              {destsuggestion.name} </div>
          )}

        </div>
      </div>

      {/* loading the graph component */}
      {createGraph && (
        <ShowGraph
          setStoreMarketData={storeMarketData}
        />

      )}
    </>
  );
}

export default SearchPage;
