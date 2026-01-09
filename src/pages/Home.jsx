import { useQuery } from "@tanstack/react-query";
import {
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useEffect,
} from "react";
import {
  fetchJobs,
  fetchEducationLevels,
  fetchSalaryLevels,
} from "@/utils/fetcher";
import Pageration from "@/components/Pageration";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import EyeTracker from "@/components/EyeTracker";
import { useAuth } from "@/providers/auth-provider";
import mainBg from "@/assets/Background-01.png?w=1024&h=auto&format=webp";
import logo from "@/assets/Logo-01.svg?w=1024&h=auto&format=webp";
import style from "./Home.module.scss";

const Modal = lazy(() => import("@/components/Modal"));

const MOBILE_BREAKPOINT = 600;
const PER_PAGE_MOBILE = 4;
const PER_PAGE_DESKTOP = 6;

// TODO: 3. Image Optmize

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  // 控制搜尋列表：手機每頁 4 筆資料 / 平板 & 桌機：6 筆資料
  const perPage = useMemo(
    () => (isMobile ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP),
    [isMobile],
  );

  const [filterValues, setFilterValues] = useState({
    companyName: "",
    educationLevel: "",
    salaryLevel: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    companyName: "",
    educationLevel: "",
    salaryLevel: "",
  });

  // Unified setter for filter values
  const setValue = useCallback((key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 監聽視窗大小變化，更新 isMobile 狀態
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setCurrentPage(1); // 重置到第一頁當裝置類型改變時
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const handleViewDetail = useCallback((jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const newFilters = {
        companyName: filterValues.companyName.trim(),
        educationLevel: filterValues.educationLevel,
        salaryLevel: filterValues.salaryLevel,
      };
      setAppliedFilters(newFilters);
      setCurrentPage(1);
    },
    [filterValues],
  );

  const {
    data: jobs,
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
    error: jobsError,
  } = useQuery({
    queryKey: [
      "jobs",
      currentPage,
      appliedFilters.companyName,
      appliedFilters.educationLevel,
      appliedFilters.salaryLevel,
      perPage,
    ],
    queryFn: () =>
      fetchJobs({
        page: currentPage,
        prePage: perPage,
        companyName: appliedFilters.companyName || undefined,
        educationLevel: appliedFilters.educationLevel || undefined,
        salaryLevel: appliedFilters.salaryLevel || undefined,
      }),
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  const totalPages = useMemo(() => {
    // Use current total if available, otherwise use previous total
    const total = jobs?.total;
    if (total) {
      return Math.ceil(total / perPage);
    }
    // Return 1 as fallback only if we never had data
    return 1;
  }, [jobs?.total, perPage]);

  const { data: educationLevels } = useQuery({
    queryKey: ["educationLevels"],
    queryFn: () => fetchEducationLevels(),
    enabled: isAuthenticated,
  });

  const { data: salaryLevels } = useQuery({
    queryKey: ["salaryLevels"],
    queryFn: () => fetchSalaryLevels(),
    enabled: isAuthenticated,
  });

  return (
    <div className={style.main}>
      <img src={mainBg} alt="main-bg" className={style.mainBg} />
      <div className={style.mainBgContainer}>
        <EyeTracker />
        <img src={logo} alt="logo" className={style.logo} />
      </div>
      <section className={style.searchDashboard}>
        <h2 className={style.sectionTitle}>適合前端工程師的好工作</h2>
        {!isMobile && (
          <SearchBar
            values={filterValues}
            appliedFilters={appliedFilters}
            setValue={setValue}
            onSearch={handleSearch}
            educationLevels={educationLevels}
            salaryLevels={salaryLevels}
          />
        )}

        <div className={style.jobList}>
          {isLoadingJobs && !jobs && (
            <div className={style.emptyState}>
              <p>載入中...</p>
            </div>
          )}
          {isErrorJobs && (
            <div className={style.emptyState}>
              <p className={style.errorText}>
                載入失敗：{jobsError?.message || "發生錯誤，請稍後再試"}
              </p>
            </div>
          )}
          {!isLoadingJobs &&
            !isErrorJobs &&
            jobs &&
            jobs.data &&
            jobs.data.length === 0 && (
              <div className={style.emptyState}>
                <p>找不到符合條件的工作</p>
              </div>
            )}
          {!isErrorJobs &&
            jobs &&
            jobs.data &&
            jobs.data.length > 0 &&
            jobs.data.map((job) => (
              <JobCard
                key={job.id}
                companyName={job.companyName}
                jobTitle={job.jobTitle}
                educationLabel={job.educationLabel}
                salaryLabel={job.salaryLabel}
                preview={job.preview}
                onViewDetail={() => handleViewDetail(job.id)}
              />
            ))}
        </div>

        {!isErrorJobs && jobs && jobs.data && jobs.data.length > 0 && (
          <Pageration
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
      <Suspense fallback={null}>
        <Modal
          jobId={selectedJobId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </Suspense>
    </div>
  );
}
