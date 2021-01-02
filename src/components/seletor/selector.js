import React from 'react';
import './selector.css';

const THROTTLE_TIMEOUT = 1000;

const Selector = ({ idField = 'id', textField = 'text', value, onChange, search }) => {

  const [ showOptions, setShowOptions ] = React.useState(false);
  const [ data, setData ] = React.useState({ mapper: {}, ids: [] });
  const [ query, setQuery ] = React.useState('');
  const [ isFetching, setIsFetching ] = React.useState(false);
  const throttleId = React.useRef();

  React.useEffect(() => {
    onSearch();

    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (!showOptions) {
      setQuery('');
    }
  }, [showOptions]);

  const onSearch = (keyword) => {
    setIsFetching(true);
    search(keyword).then(result => {
      setData({
        mapper: result.reduce((acc, current) => ({ ...acc, [current[idField]]: current }), {}),
        ids: result.map(item => item[idField])
      });
    }).finally(() => {
      setIsFetching(false);
    });
  }

  const onQueryChange = (e) => {
    // Clear timeout if any
    if (throttleId.current) {
      clearTimeout(throttleId.current);
    }

    // Setup new timeout
    throttleId.current = setTimeout(() => {
      onSearch(e.target.value);
    }, THROTTLE_TIMEOUT);

    // Change query
    setQuery(e.target.value);
  }

  const onSelect = (id) => {
    if (isFetching) return;
    onChange(id);
    setShowOptions(false);
  }

  return (
    <div className="selector-container">
      {
        isFetching &&
          <span className="selector-loader" />
      }
      <div className="selector-result" onClick={ () => setShowOptions(!showOptions) }>
        { value?.[textField] || 'Select an option' }
      </div>
      {
        showOptions &&
        <div className="selector-options">
          <input
            value={ query }
            onChange={ onQueryChange }
            type="text"
            autoFocus
            disabled={ isFetching }
          />
          <ul>
            {
              data.ids.map(id => (
                <li
                  key={ data.mapper[id][idField] }
                  onClick={ () => onSelect(data.mapper[id]) }
                  className={ id === value?.[idField] ? "highlighted" : "" }
                >
                  { data.mapper[id][textField] }
                </li>
              ))
            }
          </ul>
        </div>
      }
    </div>
  );
};

export default Selector;