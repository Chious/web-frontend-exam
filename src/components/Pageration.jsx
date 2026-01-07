import { Button } from "@mui/material";
import style from "./Pageration.module.scss";

const MAX_VISIBLE_PAGES = 5;

/**
 * @param {Object} totalPages - 總頁數
 * @param {number} currentPage - 當前頁數
 * @param {function} onPageChange - 頁數變更事件
 */
export default function Pageration({ totalPages, currentPage, onPageChange }) {
  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const groupIndex = Math.floor((currentPage - 1) / MAX_VISIBLE_PAGES);
    const start = groupIndex * MAX_VISIBLE_PAGES + 1;
    const end = Math.min(start + MAX_VISIBLE_PAGES - 1, totalPages);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

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
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        &lt;
      </Button>
      {pageNumbers.map((page) => (
        <Button
          key={`page-${page}`}
          variant={currentPage === page ? "contained" : "outlined"}
          color="primary"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        &gt;
      </Button>
    </div>
  );
}
