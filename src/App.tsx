import { KeyboardEvent, useRef, useState } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<Array<{ _id: string; value: string }>>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (value == '' && e.key === 'Backspace') {
      let filteredItems = items.slice(0, items.length - 1);
      setItems(filteredItems);
    }

    if (value == '') return;
    if (e.key === 'Enter') {
      setItems((prev) => [...prev, { _id: crypto.randomUUID(), value }]);
      setValue('');
    }
  };

  const handleClick = (id: string) => {
    let filteredItems = items.filter((item) => item._id != id);
    setItems(filteredItems);
    inputRef.current?.focus();
  };

  return (
    <div className="container">
      <div className="input">
        {items.map(({ _id, value }, i) => (
          <div key={i} className="item">
            <span>{value}</span>
            <span className="remove" onClick={() => handleClick(_id)}>
              ❌
            </span>
          </div>
        ))}
        <input
          type="text"
          value={value}
          ref={inputRef}
          onKeyDown={handleSubmit}
          onChange={(e) => setValue(e.target.value)}
          placeholder={items.length > 0 ? '' : 'Add Something'}
        />
      </div>

      <div className="search"></div>
    </div>
  );
}

export default App;
