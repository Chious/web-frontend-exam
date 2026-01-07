import style from "@/components/JobCard.module.scss";
import jobIcon from "@/assets/icons/job-icon.svg";
import educationIcon from "@/assets/icons/education-icon.svg";
import salaryIcon from "@/assets/icons/salary-icon.svg";

/**
 * @param {string} companyName - 公司名稱
 * @param {string} jobTitle - 職稱
 * @param {string} educationLabel - 學歷
 * @param {string} salaryLabel - 薪資
 * @param {string} preview - 簡介
 * @param {function} onViewDetail - 查看更多事件
 */
export default function JobCard({
  companyName,
  jobTitle,
  educationLabel,
  salaryLabel,
  preview,
  onViewDetail,
}) {
  return (
    <div className={style.jobCard}>
      <div className={style.jobCardContent}>
        <h3>{companyName}</h3>
        <h4>
          <img src={jobIcon} alt="" className={style.icon} />
          {jobTitle}
        </h4>
        <p>
          <img src={educationIcon} alt="" className={style.icon} />
          {educationLabel}
        </p>
        <p>
          <img src={salaryIcon} alt="" className={style.icon} />
          {salaryLabel}
        </p>
        <p className={style.preview}>{preview}</p>
        <button
          type="button"
          className={style.viewMoreBtn}
          onClick={onViewDetail}
        >
          查看更多
        </button>
      </div>
    </div>
  );
}
