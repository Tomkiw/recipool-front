import { ChangeEvent } from 'react';

import css from './SelectFilter.module.css';

interface SelectFiltersProps {
  options: { _id: string; name: string }[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function SelectFilter({
  options,
  placeholder,
  value,
  onChange,
}: SelectFiltersProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };
  return (
    <>
      <div className={css.filter__field}>
        <select
          className={css.filter__select}
          value={value}
          onChange={handleChange}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default SelectFilter;
