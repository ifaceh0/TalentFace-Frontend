import { useCallback, useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error";
export type ShowToast = (msg: string, type?: ToastType) => void;

export function useToast() {
    const [toast, setToast]         = useState<string>("");
    const [toastType, setToastType] = useState<ToastType>("success");
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast: ShowToast = useCallback((msg, type = "success") => {
        if (timer.current) clearTimeout(timer.current);
        setToast(msg);
        setToastType(type);
        timer.current = setTimeout(() => setToast(""), 3500);
    }, []);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    return { toast, toastType, showToast };
}