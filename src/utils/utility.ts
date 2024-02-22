import type { SubmitItemsType } from '../types/type';
export const itemColor = [
  { color: 'brown', colorCode: '#603B2C' },
  { color: 'orange', colorCode: '#854C1D' },
  { color: 'yellow', colorCode: '#89632A' },
  { color: 'green', colorCode: '#2B593F' },
  { color: 'blue', colorCode: '#28456C' },
  { color: 'purple', colorCode: '#492F64' },
  { color: 'pink', colorCode: '#69314C' },
  { color: 'red', colorCode: '#6E3630' },
];

export function randomColorGen() {
  let numbers = itemColor.length - 1;
  let randomizer = Math.floor(Math.random() * numbers);
  // console.log({ randomizer });
  return itemColor[randomizer];
}

export const submitItems = ({
  setItems,
  setFilteredItems,
  setValue,
  inputRef,
  value,
  items,
  color,
}: SubmitItemsType) => {
  setItems((prev) => {
    // let color = randomColorGen();
    // console.log({ color });
    const data = { _id: crypto.randomUUID(), value: value.trim(), color };
    if (items?.some((item) => item.value === data.value)) return prev;
    setFilteredItems((pre) => [...(pre || []), data]);
    return [...(prev || []), data];
  });
  setValue('');
  inputRef.current?.focus();
};
