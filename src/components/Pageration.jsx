import { useMemo } from "react";
import style from "./Pageration.module.scss";

const MAX_VISIBLE_PAGES = 5;

/**
 * @param {Object} totalPages - 總頁數
 * @param {number} currentPage - 當前頁數
 * @param {function} onPageChange - 頁數變更事件
 */
export default function Pageration({ totalPages, currentPage, onPageChange }) {
  const pageNumbers = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const groupIndex = Math.floor((currentPage - 1) / MAX_VISIBLE_PAGES);
    const start = groupIndex * MAX_VISIBLE_PAGES + 1;
    const end = Math.min(start + MAX_VISIBLE_PAGES - 1, totalPages);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={style.pagination}>
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {pageNumbers.map((page) => (
        <button
          key={`page-${page}`}
          className={currentPage === page ? style.active : ""}
          onClick={() => onPageChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
}
