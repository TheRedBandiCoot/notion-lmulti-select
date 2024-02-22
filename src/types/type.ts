export type Data = { _id: string; value: string; color?: { color: string; colorCode: string } };

export type SubmitItemsType = {
  color: { color: string; colorCode: string };
  items: Array<{ _id: string; value: string }> | null;
  value: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  setValue: (val: string) => void;
  setItems: React.Dispatch<
    React.SetStateAction<
      | {
          _id: string;
          value: string;
        }[]
      | null
    >
  >;
  setFilteredItems: React.Dispatch<
    React.SetStateAction<
      | {
          _id: string;
          value: string;
        }[]
      | null
    >
  >;
};
