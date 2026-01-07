import { useRef, useState, useEffect, useCallback } from "react";
import style from "./Swiper.module.scss";

/**
 * @param {Object} images - 圖片陣列
 * @param {string} alt - 圖片alt文字
 * @param {boolean} autoplay - 是否自動播放
 * @param {number} autoplayInterval - 自動播放間隔
 */
export default function Swiper({
  images = [],
  alt = "Image",
  autoplay = true,
  autoplayInterval = 3000,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const autoplayRef = useRef(null);

  const slideWidth = 212; // slide width (200px) + gap (12px)

  const scrollToSlide = useCallback(
    (index) => {
      if (trackRef.current) {
        const newIndex = Math.max(0, Math.min(index, images.length - 1));
        trackRef.current.scrollTo({
          left: slideWidth * newIndex,
          behavior: "smooth",
        });
        setCurrentSlide(newIndex);
      }
    },
    [images.length],
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = prev >= images.length - 1 ? 0 : prev + 1;
      if (trackRef.current) {
        trackRef.current.scrollTo({
          left: slideWidth * next,
          behavior: "smooth",
        });
      }
      return next;
    });
  }, [images.length]);

  // Autoplay
  useEffect(() => {
    if (autoplay && images.length > 1) {
      autoplayRef.current = setInterval(nextSlide, autoplayInterval);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayInterval, images.length, nextSlide]);

  const pauseAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const resumeAutoplay = useCallback(() => {
    if (autoplay && images.length > 1 && !autoplayRef.current) {
      autoplayRef.current = setInterval(nextSlide, autoplayInterval);
    }
  }, [autoplay, autoplayInterval, images.length, nextSlide]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    trackRef.current.style.scrollBehavior = "auto";
    pauseAutoplay();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = "grab";
    trackRef.current.style.scrollBehavior = "smooth";

    // Snap to nearest slide
    const currentScroll = trackRef.current.scrollLeft;
    const nearestSlide = Math.round(currentScroll / slideWidth);
    scrollToSlide(nearestSlide);
    resumeAutoplay();
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollBehavior = "auto";
    pauseAutoplay();
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    trackRef.current.style.scrollBehavior = "smooth";

    // Snap to nearest slide
    const currentScroll = trackRef.current.scrollLeft;
    const nearestSlide = Math.round(currentScroll / slideWidth);
    scrollToSlide(nearestSlide);
    resumeAutoplay();
  };

  // Update current slide on scroll
  const handleScroll = () => {
    if (!isDragging.current && trackRef.current) {
      const currentScroll = trackRef.current.scrollLeft;
      const newSlide = Math.round(currentScroll / slideWidth);
      if (
        newSlide !== currentSlide &&
        newSlide >= 0 &&
        newSlide < images.length
      ) {
        setCurrentSlide(newSlide);
      }
    }
  };

  if (!images.length) return null;

  return (
    <div
      className={style.swiper}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <div className={style.swiperContainer}>
        <div
          ref={trackRef}
          className={style.swiperTrack}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onScroll={handleScroll}
          role="slider"
          tabIndex={0}
          aria-label="圖片輪播"
          aria-valuemin={0}
          aria-valuemax={images.length - 1}
          aria-valuenow={currentSlide}
        >
          {images.map((image, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`slide-${index}`}
              className={style.swiperSlide}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className={style.swiperNav}>
          {images.map((_, index) => (
            <button
              type="button"
              // eslint-disable-next-line react/no-array-index-key
              key={`dot-${index}`}
              className={`${style.swiperDot} ${
                currentSlide === index ? style.active : ""
              }`}
              onClick={() => {
                scrollToSlide(index);
                pauseAutoplay();
                // Resume autoplay after a short delay
                setTimeout(resumeAutoplay, 5000);
              }}
              aria-label={`前往相片 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
