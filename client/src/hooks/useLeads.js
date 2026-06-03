import { useState, useEffect, useCallback, useRef } from "react";
import { leadsApi } from "../utils/api";
import { DEFAULT_PARAMS } from "../utils/constants";

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const fetchLeads = useCallback(async (queryParams) => {
    try {
      setLoading(true);
      setError(null);
      const res = await leadsApi.getAll(queryParams);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(params);
  }, [fetchLeads, params]);

  const updateParams = useCallback((updates) => {
    setParams((prev) => ({
      ...prev,
      ...updates,
      // reset to page 1 whenever anything other than page changes
      page: updates.page ?? 1,
    }));
  }, []);

  const setSearch = useCallback((value) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateParams({ search: value });
    }, 350);
  }, [updateParams]);

  const refresh = useCallback(() => fetchLeads(params), [fetchLeads, params]);

  return {
    leads,
    pagination,
    params,
    loading,
    error,
    updateParams,
    setSearch,
    refresh,
  };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leadsApi.getStats();
      setStats(res.data.data);
    } catch {
      // stats are supplemental — fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}
