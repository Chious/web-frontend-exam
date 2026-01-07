import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import {
  fetchJobs,
  fetchEducationLevels,
  fetchSalaryLevels,
} from "@/utils/fetcher";
import {
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import Pageration from "@/components/Pageration";
import JobCard from "@/components/JobCard";
import mainBg from "@/assets/Background-01.png?w=1024&h=auto&format=webp";
import leftEye from "@/assets/LeftEye-01.png?w=40&h=auto&format=webp";
import rightEye from "@/assets/RightEye-01.png?w=40&h=auto&format=webp";
import logo from "@/assets/Logo-01.png?w=1024&h=auto&format=webp";
import character from "@/assets/Character-01.png?w=1024&h=auto&format=webp";
import style from "./Home.module.scss";

const Modal = lazy(() => import("@/components/Modal"));

const PER_PAGE = 6;

// TODO: 1. 優化 Job fetch 邏輯 and responsive for different device
// TODO: 2. Background Animate
// TODO: 3. Image Optmize

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Search form state
  const [companyName, setCompanyName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [salaryLevel, setSalaryLevel] = useState("");

  // Applied search filters (only update on submit)
  const [appliedFilters, setAppliedFilters] = useState({
    companyName: "",
    educationLevel: "",
    salaryLevel: "",
  });

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
      setAppliedFilters({
        companyName,
        educationLevel,
        salaryLevel,
      });
      setCurrentPage(1);
    },
    [companyName, educationLevel, salaryLevel],
  );

  // Check if any filter input has value
  const hasFilterInput = useMemo(
    () =>
      companyName.trim() !== "" || educationLevel !== "" || salaryLevel !== "",
    [companyName, educationLevel, salaryLevel],
  );

  const { data: jobs } = useQuery({
    queryKey: ["jobs", currentPage, appliedFilters],
    queryFn: () =>
      fetchJobs({
        page: currentPage,
        prePage: PER_PAGE,
        companyName: appliedFilters.companyName || undefined,
        educationLevel: appliedFilters.educationLevel || undefined,
        salaryLevel: appliedFilters.salaryLevel || undefined,
      }),
  });

  const totalPages = useMemo(
    () => (jobs?.total ? Math.ceil(jobs.total / PER_PAGE) : 1),
    [jobs?.total],
  );

  const { data: educationLevels } = useQuery({
    queryKey: ["educationLevels"],
    queryFn: () => fetchEducationLevels(),
  });

  const { data: salaryLevels } = useQuery({
    queryKey: ["salaryLevels"],
    queryFn: () => fetchSalaryLevels(),
  });

  return (
    <div className={style.main}>
      <div className={style.mainBgContainer}>
        <div className={style.characterContainer}>
          <img src={character} alt="character" className={style.character} />
          <img
            src={leftEye}
            alt="left-eye"
            width={40}
            height={40}
            className={`${style.leftEye}`}
          />
          <img
            src={rightEye}
            alt="right-eye"
            width={40}
            height={40}
            className={`${style.rightEye}`}
          />
        </div>

        <img src={logo} alt="logo" />
        <img src={mainBg} alt="main-bg" />
      </div>
      <section className={style.searchDashboard}>
        <h2 className={style.sectionTitle}>適合前端工程師的好工作</h2>
        <form className={style.searchBar} onSubmit={handleSearch}>
          <TextField
            label="公司名稱"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <FormControl>
            <InputLabel id="education-level-select-label">教育程度</InputLabel>
            <Select
              labelId="education-level-select-label"
              id="education-level-select"
              label="教育程度"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
            >
              <MenuItem value="">不限</MenuItem>
              {educationLevels &&
                educationLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="salary-level-select-label">薪水範圍</InputLabel>
            <Select
              labelId="salary-level-select-label"
              id="salary-level-select"
              label="薪水範圍"
              value={salaryLevel}
              onChange={(e) => setSalaryLevel(e.target.value)}
            >
              <MenuItem value="">不限</MenuItem>
              {salaryLevels &&
                salaryLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={style.searchBtn}
            disabled={!hasFilterInput}
          >
            搜尋條件
          </Button>
        </form>

        <div className={style.jobList}>
          {jobs &&
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

        <Pageration
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
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
