const API_BASE = "/api/v1";

/**
 * Base fetcher function
 * @param {string} url - API endpoint
 * @returns {Promise<any>} - Response data
 */
export const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

/**
 * Fetch job list with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.prePage] - Items per page
 * @param {string} [params.companyName] - Filter by company name
 * @param {number} [params.educationLevel] - Filter by education level ID
 * @param {number} [params.salaryLevel] - Filter by salary level ID
 * @returns {Promise<{data: Array, total: number}>}
 */
export const fetchJobs = async ({
  page,
  prePage,
  companyName,
  educationLevel,
  salaryLevel,
} = {}) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (prePage) params.append("pre_page", prePage);
  if (companyName) params.append("company_name", companyName);
  if (educationLevel) params.append("education_level", educationLevel);
  if (salaryLevel) params.append("salary_level", salaryLevel);

  const queryString = params.toString();
  const url = `${API_BASE}/jobs${queryString ? `?${queryString}` : ""}`;

  return fetcher(url);
};

/**
 * Fetch single job detail by ID
 * @param {string|number} id - Job ID
 * @returns {Promise<{id: string, companyName: string, jobTitle: string, description: string, companyPhoto: string[]}>}
 */
export const fetchJobById = async (id) => {
  const url = `${API_BASE}/jobs/${id}`;
  return fetcher(url);
};

/**
 * Fetch education level list
 * @returns {Promise<Array<{id: string, label: string}>>}
 */
export const fetchEducationLevels = async () => {
  const url = `${API_BASE}/educationLevelList`;
  return fetcher(url);
};

/**
 * Fetch salary level list
 * @returns {Promise<Array<{id: string, label: string}>>}
 */
export const fetchSalaryLevels = async () => {
  const url = `${API_BASE}/salaryLevelList`;
  return fetcher(url);
};
