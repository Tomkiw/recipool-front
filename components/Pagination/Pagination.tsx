import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
}

interface ChevronIconProps {
  direction: "left" | "right";
}

// Менший діапазон, щоб ряд кнопок вміщався на 375px без переносу.
const PAGE_RANGE_DISPLAYED = 3;
const MARGIN_PAGES_DISPLAYED = 1;

function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg
      className={css.arrowIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={PAGE_RANGE_DISPLAYED}
      marginPagesDisplayed={MARGIN_PAGES_DISPLAYED}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      pageClassName={css.item}
      pageLinkClassName={css.link}
      activeClassName={css.active}
      previousClassName={css.item}
      nextClassName={css.item}
      previousLinkClassName={`${css.link} ${css.arrow}`}
      nextLinkClassName={`${css.link} ${css.arrow}`}
      breakClassName={css.item}
      breakLinkClassName={`${css.link} ${css.break}`}
      disabledClassName={css.disabled}
      previousAriaLabel="Previous page"
      nextAriaLabel="Next page"
      previousLabel={<ChevronIcon direction="left" />}
      nextLabel={<ChevronIcon direction="right" />}
    />
  );
}
