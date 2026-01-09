import {
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { compareFilters } from "@/utils/compare";
import style from "./SearchBar.module.scss";

/**
 * SearchBar component for job search filters
 * @param {Object} props
 * @param {Object} props.values - Filter values object { companyName, educationLevel, salaryLevel }
 * @param {Object} props.appliedFilters - Previously applied filters for comparison
 * @param {Function} props.setValue - Unified setter function (key, value) => void
 * @param {Function} props.onSearch - Handler for form submit
 * @param {Array} props.educationLevels - List of education levels
 * @param {Array} props.salaryLevels - List of salary levels
 */
export default function SearchBar({
  values,
  appliedFilters,
  setValue,
  onSearch,
  educationLevels,
  salaryLevels,
}) {
  const isDisabled = compareFilters(values, appliedFilters);
  return (
    <form className={style.searchBar} onSubmit={onSearch}>
      <TextField
        label="公司名稱"
        value={values.companyName}
        onChange={(e) => setValue("companyName", e.target.value)}
        size="small"
      />

      <FormControl size="small">
        <InputLabel id="education-level-select-label" shrink>
          教育程度
        </InputLabel>
        <Select
          labelId="education-level-select-label"
          id="education-level-select"
          label="教育程度"
          value={values.educationLevel}
          onChange={(e) => setValue("educationLevel", e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>不限</em>
          </MenuItem>
          {educationLevels &&
            educationLevels.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel id="salary-level-select-label" shrink>
          薪水範圍
        </InputLabel>
        <Select
          labelId="salary-level-select-label"
          id="salary-level-select"
          label="薪水範圍"
          value={values.salaryLevel}
          onChange={(e) => setValue("salaryLevel", e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>不限</em>
          </MenuItem>
          {salaryLevels &&
            salaryLevels.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <button type="submit" className={style.searchBtn} disabled={isDisabled}>
        搜尋條件
      </button>
    </form>
  );
}
