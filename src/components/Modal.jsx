import { useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { fetchJobById } from "@/utils/fetcher";
import Swiper from "./Swiper";
import style from "./Modal.module.scss";

const REVALIDATE_TIME = 60 * 60 * 24; // 24 hours

/**
 * @param {Object} jobId - 工作ID
 * @param {boolean} isOpen - 是否開啟
 * @param {function} onClose - 關閉視窗
 */
export default function Modal({ jobId, isOpen, onClose }) {
  const overlayRef = useRef(null);

  const { data: jobDetail, isLoading } = useQuery({
    queryKey: ["jobDetail", jobId],
    queryFn: () => fetchJobById(jobId),
    enabled: isOpen && !!jobId,
    staleTime: REVALIDATE_TIME,
  });

  const sanitizedDescription = useMemo(() => {
    if (!jobDetail?.description) return "";
    return DOMPurify.sanitize(jobDetail.description);
  }, [jobDetail?.description]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={overlayRef}
      className={style.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={style.modal}>
        <div className={style.header}>
          <h2 id="modal-title">詳細資訊</h2>
        </div>

        <div className={style.content}>
          {isLoading ? (
            <div className={style.loading}>
              <div className={style.spinner} />
              <p>載入中...</p>
            </div>
          ) : (
            jobDetail && (
              <>
                <div className={style.jobHeader}>
                  <h3>{jobDetail.companyName}</h3>
                  <h4>{jobDetail.jobTitle}</h4>
                </div>

                {jobDetail.companyPhoto?.length > 0 && (
                  <div className={style.swiperSection}>
                    <h5 className={style.sectionTitle}>公司相片</h5>
                    <Swiper
                      images={jobDetail.companyPhoto}
                      alt={`${jobDetail.companyName} 相片`}
                      autoplay
                      autoplayInterval={3000}
                    />
                  </div>
                )}

                <div>
                  <h5 className={style.sectionTitle}>工作內容</h5>
                  <div
                    className={style.description}
                    // Sanitized with DOMPurify - safe to render
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>
              </>
            )
          )}
        </div>

        <footer className={style.footer}>
          <div className={style.spacer} />
          <button
            type="button"
            className={style.footerBtn}
            onClick={onClose}
            aria-label="關閉"
          >
            關閉
          </button>
        </footer>
      </div>
    </div>
  );
}
