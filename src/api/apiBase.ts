import axios from 'axios';

import { createClient } from '@/lib/supabase/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseFunctionInstance = axios.create({
  baseURL: supabaseUrl ? `${supabaseUrl}/functions/v1` : undefined,
  timeout: 10000,
});

supabaseFunctionInstance.interceptors.request.use(async (config) => {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required.');
  }

  if (!supabasePublishableKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable is required.');
  }

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Login is required.');
  }

  config.headers.Authorization = `Bearer ${session.access_token}`;
  config.headers.apikey = supabasePublishableKey;
  config.headers['Content-Type'] = 'application/json';

  return config;
});

const apiRequest = {
  async get<TResponse>(url: string): Promise<TResponse> {
    const response = await supabaseFunctionInstance.get<TResponse>(url);
    return response.data;
  },

  async post<TResponse, TBody = unknown>(url: string, data?: TBody): Promise<TResponse> {
    const response = await supabaseFunctionInstance.post<TResponse>(url, data);
    return response.data;
  },

  async put<TResponse, TBody = unknown>(url: string, data?: TBody): Promise<TResponse> {
    const response = await supabaseFunctionInstance.put<TResponse>(url, data);
    return response.data;
  },

  async delete<TResponse>(url: string): Promise<TResponse> {
    const response = await supabaseFunctionInstance.delete<TResponse>(url);
    return response.data;
  },
};

export default apiRequest;
