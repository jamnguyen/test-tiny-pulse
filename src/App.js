import React from 'react';
import { Selector } from './components/seletor';

const API_SEARCH = 'https://hn.algolia.com/api/v1/search';

function App() {

  const [ story, setStory ] = React.useState();

  const search = async (keyword = '') => {
    try {
      const response = await fetch(API_SEARCH + '?' + new URLSearchParams({ query: keyword }));
      const result = await response.json();
      return result.hits.map(item => ({
        ...item,
        id: item.objectID,
        text: item.title || item.story_text
      }));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Selector
        value={ story }
        onChange={ setStory }
        search={ search }
      />
    </div>
  );
}

export default App;
