// KONFIGURASI GOOGLE APPS SCRIPT
// 1. Buka Google Spreadsheet -> Ekstensi -> Apps Script
// 2. Paste kode yang diberikan di chat (menggunakan Folder ID: 1_rWWi5si0Yg8UYbp4a338ghIdDfUgTa4)
// 3. Deploy sebagai Web App (Who has access: Anyone)
// 4. Copy URL Web App dan paste di bawah ini menggantikan "PASTE_URL_GOOGLE_SCRIPT_DISINI":

export const API_BASE_URL = "https://script.google.com/macros/s/AKfycbzPJILNTQ74PVDlmtarMj9aSFjVLbUHhQIvrfhXKzdtqCflAujE5x-yUfxamFN3eCT5/exec";

export const getApiUrl = (action: string) => `${API_BASE_URL}?action=${action}`;