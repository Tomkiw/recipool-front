import { ChangeEvent, useId } from 'react';

import css from './SelectFilter.module.css';

interface SelectFiltersProps {
  // Рендериться лише name (value і label) — приймаємо будь-яку опцію з name,
  // тож підходять і категорії { _id, name }, і інгредієнти { id, name }.
  options: { name: string }[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  // У вузькій панелі фільтрів підпис лишаємо тільки для скрінрідерів.
  isLabelHidden?: boolean;
}

function SelectFilter({
  options,
  placeholder,
  value,
  onChange,
  label,
  isLabelHidden = false,
}: SelectFiltersProps) {
  const selectId = useId();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };
  return (
    <>
      <div className={css.filter__field}>
        <label
          htmlFor={selectId}
          className={isLabelHidden ? 'visually-hidden' : css.filter__label}
        >
          {label}
        </label>
        <div className={css.filter__control}>
          <select
            id={selectId}
            className={`${css.filter__select} ${value ? css.filter__selectActive : ''}`}
            value={value}
            onChange={handleChange}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <svg
            className={css.filter__chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default SelectFilter;
