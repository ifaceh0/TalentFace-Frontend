const CURRENCY_SYMBOLS: Record<string, string> = {
    INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "د.إ", SGD: "S$", AUD: "A$", CAD: "C$",
};

export const formatSalary = (v: number, currency: string): string => {
    const sym = CURRENCY_SYMBOLS[currency] ?? "₹";
    if (currency === "INR") {
        if (v === 0) return `${sym}0 LPA`;
        if (v <= 99) return `${sym}${v} LPA`;
        const cr = v / 100;
        return `${sym}${Number.isInteger(cr) ? cr : cr.toFixed(1)} Cr`;
    }
    return v === 0 ? `${sym}0` : `${sym}${v}K/yr`;
};

// Converts Tiptap JSON (or a plain string) to plain text
export const richTextToPlain = (v: unknown): string => {
    if (!v) return "";
    if (typeof v === "string") return v;
    const node = v as { type?: string; text?: string; content?: unknown[] };
    if (node.text) return node.text;
    const parts = (node.content ?? []).map(richTextToPlain);
    return ["paragraph", "heading", "listItem"].includes(node.type ?? "")
        ? parts.join("")
        : parts.join("\n");
};

export const formatAmount = (v: number, currency: string): string =>
    new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(v);