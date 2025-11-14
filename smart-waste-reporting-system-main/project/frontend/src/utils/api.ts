// src/utils/api.ts

// Automatically switch between local & production API
export const API_BASE_URL = import.meta.env.PROD
  ? "https://smart-waste-reporting-system.onrender.com"
  : "http://localhost:5000";

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Authentication API calls
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to login");
  }
  return res.json();
};

export const registerUser = async (userData: { name: string; email: string; password: string; phone: string; role?: string }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to register");
  }
  return res.json();
};

export const getCurrentUser = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const logoutUser = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error("Failed to logout");
  return res.json();
};

// Reports API calls
export const getReports = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/reports`, {
    headers: { 
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
};

export const getUserReports = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/reports/my-reports`, {
    headers: { 
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error("Failed to fetch your reports");
  return res.json();
};

export const submitReport = async (data: any) => {
  const token = getToken();
  // Create FormData for file upload
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (key === 'location') {
      formData.append(key, JSON.stringify(data[key]));
    } else if (key !== 'image') {
      formData.append(key, data[key]);
    }
  });
  if (data.image) {
    formData.append('image', data.image);
  }

  const res = await fetch(`${API_BASE_URL}/api/reports`, {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to submit report");
  }
  return res.json();
};

// Update report (assign/start/resolve)
export const updateReportStatus = async (
  reportId: string,
  body: Record<string, any>
) => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update report");
  }
  return res.json();
};

export const assignReportToAgent = async (reportId: string, agentId: string) => {
  return updateReportStatus(reportId, { status: 'Assigned', assignedAgentId: agentId });
};
