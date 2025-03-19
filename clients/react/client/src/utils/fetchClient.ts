"use client";

import axios from "axios";

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:4242";

const defaultOptions = {
  method: "get",
  baseURL: SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const fetchClient = axios.create(defaultOptions);

export default fetchClient;
