import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { itemColor, randomColorGen, submitItems } from './utils/utility';
import type { Data } from './types/type';

function App() {
  let [value, setValue] = useState('');
  let [value2, setValue2] = useState('');
  let [items, setItems] = useState<Array<Data> | null>(null);
  let [filteredItems, setFilteredItems] = useState<Array<Data> | null>(null);
  let [isOn, setIsOn] = useState(false);
  let [isSearchOn, setIsSearchOn] = useState(false);
  let [isUpdateModal, setIsUpdateModal] = useState(false);
  let [id, setID] = useState<string | null>('');
  let [highlightedIndex, setHighlightedIndex] = useState(0);
  let [outline, setOutline] = useState(false);
  let [highlightedUpdateIndex, setHighlightedUpdateIndex] = useState(0);
  const [color, setItemColor] = useState<{ color: string; colorCode: string } | undefined>();
  // const [dataID, setDataID] = useState(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalInputRef = useRef<HTMLInputElement | null>(null);
  const ulRef = useRef<HTMLUListElement | null>(null);

  const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (value == '' && e.key === 'Backspace') {
      let filteredItem = filteredItems?.slice(0, filteredItems.length - 1)!;
      setFilteredItems(filteredItem);
    }
  };

  const handleClick = (id: string) => {
    if (filteredItems) {
      let newFilteredItems = filteredItems?.filter((filteredItem) => filteredItem._id !== id)!;
      setFilteredItems(newFilteredItems);
      inputRef.current?.focus();
    }
  };

  const handleList = (data: Data) => {
    inputRef.current?.focus();

    if (filteredItems && filteredItems.some((item) => item._id === data._id)) return;

    setFilteredItems((prev) => [...(prev || []), data]);
  };

  const handleCreateClick = () => {
    if (!color) return;
    submitItems({ setItems, setFilteredItems, setValue, inputRef, value, items, color });
    setItemColor(randomColorGen);
  };

  const handleOnChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsSearchOn(true);
    setHighlightedIndex(0);
  };

  const itemsFiltered = useMemo(() => {
    return items?.filter((item) => item.value.includes(value));
  }, [items, value]);

  function selectOption(data: Data) {
    if (highlightedIndex >= itemsFiltered?.length!) {
      if (value.trim() === '') return;
      if (!color) return;
      submitItems({ setItems, setFilteredItems, setValue, inputRef, value, items, color: color });
      setItemColor(randomColorGen);
      return;
    }
    inputRef.current?.focus();

    if (filteredItems && filteredItems.some((item) => item._id === data._id)) return;

    setFilteredItems((prev) => [...(prev || []), data]);
  }

  function handleInputOnClick() {
    setItemColor(randomColorGen);
  }

  const deleteItem = (id: string) => {
    let deleteItems = items?.filter((item) => item._id !== id)!;
    setItems(deleteItems);
    let deleteAndFilteredItems = filteredItems?.filter((item) => item._id !== id)!;
    setFilteredItems(deleteAndFilteredItems);
    // setID(null);
  };

  const handleChangeItem = (id: string, colors: { color: string; colorCode: string }) => {
    const updatedItem = items?.map((i) => {
      if (i._id === id) {
        return { ...i, color: colors };
      }
      return i;
    });
    const updatedFilteredItem = filteredItems?.map((i) => {
      if (i._id === id) {
        return { ...i, color: colors };
      }
      return i;
    });

    setItems(updatedItem!);
    setFilteredItems(updatedFilteredItem!);
  };

  const handleItemUpdateBtn = (e: MouseEvent, value: string) => {
    e.stopPropagation();
    const ID = e.currentTarget.getAttribute('data-id');
    setID(ID);
    setIsUpdateModal(true);
    setValue2(value);
    // console.log(ID);
    const key = e.currentTarget.nextElementSibling?.children[0].getAttribute('data-id');
    setTimeout(() => {
      document.querySelectorAll('.update-modal--input').forEach((input) => {
        if (input.getAttribute('data-id') !== key) return;
        // @ts-ignore
        input.focus();
      });
    }, 300);
  };

  const handleModalInputUpdateSubmit = (e: KeyboardEvent, tag: Data) => {
    if (e.key === 'Enter') {
      if (value2.trim() == '') return setOutline(true);
      if (items?.some((item) => item.value === value2.trim() && item._id !== tag._id))
        return setOutline(true);

      const updateItem = items?.map((item) => {
        if (item._id === tag._id) {
          return { ...item, value: value2.trim() };
        }
        return item;
      });
      const updateFilteredItem = filteredItems?.map((item) => {
        if (item._id === tag._id) {
          return { ...item, value: value2.trim() };
        }
        return item;
      });
      setItems(updateItem!);
      setFilteredItems(updateFilteredItem!);
      setIsUpdateModal(false);
      inputRef.current?.focus();
    }
  };

  const handleModalLayoutBtn = () => {
    if (isUpdateModal) {
      //@ Case 1: Value empty
      if (value2.trim() === '') return setOutline(true);
      // @ Case 2: Value Same BUT ID Not match (So by mean if value not match and some other item value is same as this one value so there two same value that why)
      if (items?.some((item) => item.value === value2.trim() && item._id !== id)) return setOutline(true);
      //@ Case 3: Value same
      if (items?.some((item) => item.value === value2.trim())) {
        setIsUpdateModal(false);
        inputRef.current?.focus();
        return;
      }
      //@ Case 4: Value Not same but ID same so items value update with new value
      if (items?.some((item) => item.value !== value2.trim() && item._id === id)) {
        const updateItem = items?.map((item) => {
          if (item._id === id) {
            return { ...item, value: value2.trim()! };
          }
          return item;
        });

        const updateFilteredItem = filteredItems?.map((item) => {
          if (item._id === id) {
            return { ...item, value: value2.trim()! };
          }
          return item;
        });
        setItems(updateItem!);
        setFilteredItems(updateFilteredItem!);
      }
    }
    setIsUpdateModal(false);
    inputRef.current?.focus();
  };

  //@ Get Item On Local Storage
  useEffect(() => {
    document.addEventListener('click', (e) => {
      // @ts-ignore
      if (e?.target?.className === 'container') {
        setIsSearchOn(false);
        setValue('');
      }
    });
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems([]);
    }
    const storeFilteredItems = localStorage.getItem('filtered-items');
    if (storeFilteredItems) {
      setFilteredItems(JSON.parse(storeFilteredItems));
    } else {
      setFilteredItems([]);
    }
  }, []);

  //@ Set Item On Local Storage
  useEffect(() => {
    if (items !== null) {
      localStorage.setItem('items', JSON.stringify(items));
    }
    if (filteredItems !== null) {
      localStorage.setItem('filtered-items', JSON.stringify(filteredItems));
    }
  }, [items, filteredItems]);

  useEffect(() => {
    if (items?.some((item) => item.value === value)) setIsOn(true);
    else setIsOn(false);
  }, [value]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != inputRef.current) return;
      switch (e.key) {
        case 'Enter':
          selectOption(itemsFiltered?.[highlightedIndex]!);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          if (ulRef.current) {
            const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
            // console.log(newValue);
            if (newValue == ulRef.current?.children.length) setHighlightedIndex(0);
            if (newValue == -1) setHighlightedIndex(ulRef.current?.children.length - 1);

            if (newValue >= 0 && newValue < ulRef.current.children.length) {
              setHighlightedIndex(newValue);
            }
            break;
          }
      }
    };
    // @ts-ignore
    inputRef.current?.addEventListener('keydown', handler);
    return () => {
      // @ts-ignore
      inputRef.current?.removeEventListener('keydown', handler);
    };
  }, [isSearchOn, highlightedIndex, itemsFiltered, filteredItems, color]);

  return (
    <div className="container">
      {isUpdateModal && <div className="update-modal--layout" onClick={handleModalLayoutBtn}></div>}

      <div className="input" onClick={() => setIsSearchOn(true)}>
        {filteredItems?.map(({ _id, value, color }, i) => (
          <div key={i} className="item" style={{ backgroundColor: color?.colorCode }}>
            <span>{value}</span>
            <span
              className="remove"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(_id);
              }}
            >
              ❌
            </span>
          </div>
        ))}
        <input
          type="text"
          value={value}
          ref={inputRef}
          onKeyDown={handleSubmit}
          onChange={handleOnChangeInput}
          onClick={handleInputOnClick}
          placeholder={filteredItems && filteredItems.length > 0 ? '' : 'Add Something'}
        />
      </div>
      <div className="searchResult" style={isSearchOn ? {} : { display: 'none' }}>
        <ul ref={ulRef}>
          {itemsFiltered &&
            itemsFiltered.map((item, index) => {
              return (
                <li
                  key={item._id}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className="list"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleList(item);
                  }}
                  style={
                    index === highlightedIndex
                      ? { backgroundColor: 'rgb(73,73,73)' }
                      : { backgroundColor: 'rgb(57,57,57)' }
                  }
                >
                  <div className="item" style={{ backgroundColor: item?.color?.colorCode }}>
                    <span>{item.value}</span>
                  </div>
                  <div className="update-delete">
                    <button
                      className="remove update-item"
                      data-id={item._id}
                      onClick={(e) => handleItemUpdateBtn(e, item.value)}
                    >
                      ...
                    </button>
                    {/*//@ Update Modal */}
                    <div
                      className={`update-modal ${isUpdateModal && 'show'} `}
                      style={id === item._id ? {} : { visibility: 'hidden' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/*//@ Update Modal - Input */}
                      <input
                        type="text"
                        ref={modalInputRef}
                        data-id={item._id}
                        style={outline ? { outline: '2px solid red' } : {}}
                        onKeyDown={(e) => handleModalInputUpdateSubmit(e, item)}
                        className="update-modal--input"
                        placeholder="Update name"
                        value={value2}
                        onChange={(e) => {
                          setValue2(e.target.value);
                          setOutline(false);
                        }}
                        // value={item.value}
                      />
                      {/*//@ Update Modal - Divider */}
                      <div className="update-modal--divider"></div>
                      {/*//@ Update Modal - Colors */}
                      <ul className="update-modal--colors">
                        {itemColor.map((colors, index) => {
                          const { color, colorCode: backgroundColor } = colors;
                          let updateColorName = color.charAt(0).toUpperCase() + color.slice(1);

                          return (
                            <li
                              key={backgroundColor}
                              onClick={() => handleChangeItem(item._id, colors)}
                              onMouseEnter={() => setHighlightedUpdateIndex(index)}
                              style={
                                index === highlightedUpdateIndex
                                  ? { backgroundColor: '#393939' }
                                  : { backgroundColor: '#252525' }
                              }
                            >
                              <div>
                                <div className="color" style={{ backgroundColor }} />
                                <p>{updateColorName}</p>
                              </div>
                              {item.color?.color === color && <i>✔️</i>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <button
                      className="remove delete-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item._id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              );
            })}
          {value.trim() && !isOn && (
            <li
              className="list create"
              style={
                itemsFiltered?.length === highlightedIndex
                  ? { backgroundColor: 'rgb(73,73,73)' }
                  : { backgroundColor: 'rgb(57,57,57)' }
              }
              onMouseEnter={() => setHighlightedIndex(ulRef.current?.children.length! - 1)}
              onClick={handleCreateClick}
            >
              <span>create</span>
              <div className="item" style={{ backgroundColor: color?.colorCode }}>
                <span>{value}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
