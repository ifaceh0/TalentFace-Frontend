import { useCallback, useEffect, useRef, useState } from "react";
import { getJobs } from "../services/candidate.service";
import type { Job } from "../types/candidate.types";
import type { ShowToast } from "./useToast";

export type MultiKey = "type" | "workMode" | "experienceLevel";

export interface JobFilterState {
    type: string[];
    workMode: string[];
    experienceLevel: string[];
    currency: string | null;
    minSalary: number | null; 
    location: string;
  
}

export const EMPTY_FILTERS: JobFilterState = {
    type: [], workMode: [], experienceLevel: [], currency: null, minSalary: null, location: "",
};

const DEFAULT_CURRENCY = "INR";

export function useJobs(showToast: ShowToast) {
    const [jobs, setJobs]               = useState<Job[]>([]);
    const [search, setSearch]           = useState<string>("");
    const [filters, setFilters]         = useState<JobFilterState>(EMPTY_FILTERS);
    const [loading, setLoading]         = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    const [page, setPage]               = useState<number>(1);

    const requestId     = useRef(0);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const filtersRef    = useRef<JobFilterState>(EMPTY_FILTERS); // latest filters for debounced/async callbacks

    const fetchJobs = useCallback(async (
        pageNum: number,
        f: JobFilterState,
        query: string,
        append = false
    ) => {
        const id = ++requestId.current;
        try {
            if (append) setLoadingMore(true);
            else setLoading(true);

            const params: Record<string, string> = {
                status: "open",
                page: String(pageNum),
                limit: "12",
            };
            if (query.trim()) params.q = query.trim();
            (["type", "workMode", "experienceLevel"] as const).forEach((k) => {
                if (f[k].length) params[k] = f[k].join(",");
            });
            if (f.currency) params.currency = f.currency;
            if (f.minSalary) params.minSalary = String(f.minSalary);
            if (f.location.trim()) params.location = f.location.trim();

            const data = await getJobs(params);
            if (id !== requestId.current) return; // a newer request replaced this one

            setJobs((prev) => (append ? [...prev, ...data.jobs] : data.jobs));
            setHasNextPage(data.hasNextPage ?? false);
            setPage(pageNum);
        } catch {
            if (id !== requestId.current) return;
            showToast("Failed to load jobs. Please try again.", "error");
        } finally {
            if (id === requestId.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [showToast]);

    // initial load
    useEffect(() => { fetchJobs(1, EMPTY_FILTERS, ""); }, [fetchJobs]);

    // clear pending debounce on unmount
    useEffect(() => () => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
    }, []);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => fetchJobs(1, filtersRef.current, value), 300);
    };

    const submitSearch = () => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        fetchJobs(1, filtersRef.current, search);
    };

    // every filter change goes back to page 1
    const applyFilters = (next: JobFilterState) => {
        filtersRef.current = next;
        setFilters(next);
        fetchJobs(1, next, search);
    };

    const toggleFilter = (key: MultiKey, value: string) => {
        const current = filters[key];
        applyFilters({
            ...filters,
            [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
        });
    };

    // changing or clearing the currency resets the amount
    const setCurrency = (currency: string | null) => {
        if (currency === filters.currency) return;
        applyFilters({ ...filters, currency, minSalary: null });
    };

    // an amount without a currency auto-fills the default currency; clearing the amount keeps the currency
    const setMinSalary = (minSalary: number | null) => {
        applyFilters({
            ...filters,
            minSalary,
            currency: minSalary && !filters.currency ? DEFAULT_CURRENCY : filters.currency,
        });
    };

    const setLocation = (location: string) => {
    // read from the ref, not `filters`: the debounced call in JobFilters can hold a stale copy
    if (location === filtersRef.current.location) return;   // skips the extra fetch on mount and after Reset
    applyFilters({ ...filtersRef.current, location });
};

    const resetFilters = () => applyFilters(EMPTY_FILTERS);

    const handleLoadMore = () => fetchJobs(page + 1, filtersRef.current, search, true);

    return {
        jobs, loading, loadingMore, hasNextPage,
        search, filters,
        handleSearchChange, submitSearch,
        toggleFilter, setCurrency, setMinSalary,setLocation, resetFilters,
        handleLoadMore,
    };
}
// import { useCallback, useEffect, useRef, useState } from "react";
// import { getJobs } from "../services/candidate.service";
// import type { Job } from "../types/candidate.types";
// import type { ShowToast } from "./useToast";

// export type FilterOption = "All" | "Full-time" | "Part-time" | "Contract" | "Remote";

// export function useJobs(showToast: ShowToast) {
//     const [jobs, setJobs]                 = useState<Job[]>([]);
//     const [search, setSearch]             = useState<string>("");
//     const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
//     const [loading, setLoading]           = useState<boolean>(true);
//     const [loadingMore, setLoadingMore]   = useState<boolean>(false);
//     const [hasNextPage, setHasNextPage]   = useState<boolean>(true);
//     const [page, setPage]                 = useState<number>(1);

//     const requestId     = useRef(0);
//     const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//     const fetchJobs = useCallback(async (
//         pageNum: number,
//         filter: FilterOption,
//         query: string,
//         append = false
//     ) => {
//         const id = ++requestId.current;
//         try {
//             if (append) setLoadingMore(true);
//             else setLoading(true);

//             const params: Record<string, string> = {
//                 status: "open",
//                 page: String(pageNum),
//                 limit: "12",
//             };
//             if (query.trim()) params.q = query.trim();
//             if (filter !== "All") params.type = filter === "Remote" ? "remote" : filter;

//             const data = await getJobs(params);
//             if (id !== requestId.current) return;

//             setJobs((prev) => (append ? [...prev, ...data.jobs] : data.jobs));
//             setHasNextPage(data.hasNextPage ?? false);
//             setPage(pageNum);
//         } catch {
//             if (id !== requestId.current) return;
//             showToast("Failed to load jobs. Please try again.", "error");
//         } finally {
//             if (id === requestId.current) {
//                 setLoading(false);
//                 setLoadingMore(false);
//             }
//         }
//     }, [showToast]);

//     // initial load
//     useEffect(() => { fetchJobs(1, "All", ""); }, [fetchJobs]);

//     // clear pending debounce on unmount
//     useEffect(() => () => {
//         if (searchTimeout.current) clearTimeout(searchTimeout.current);
//     }, []);

//     const handleSearchChange = (value: string) => {
//         setSearch(value);
//         if (searchTimeout.current) clearTimeout(searchTimeout.current);
//         searchTimeout.current = setTimeout(() => fetchJobs(1, activeFilter, value), 300);
//     };

//     const submitSearch = () => {
//         if (searchTimeout.current) clearTimeout(searchTimeout.current);
//         fetchJobs(1, activeFilter, search);
//     };

//     const handleFilterChange = (f: FilterOption) => {
//         setActiveFilter(f);
//         fetchJobs(1, f, search);
//     };

//     const handleLoadMore = () => fetchJobs(page + 1, activeFilter, search, true);

//     return {
//         jobs, loading, loadingMore, hasNextPage,
//         search, activeFilter,
//         handleSearchChange, submitSearch, handleFilterChange, handleLoadMore,
//     };
// }