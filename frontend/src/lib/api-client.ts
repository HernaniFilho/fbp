import axios from 'axios'

const API_URL = process.env.API_URL ?? 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})
