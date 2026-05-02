export const CLI_VERSION = "0.1.0";
export const DEFAULT_PROFILE = "default";
export const SALESFORGE_CORE_BASE_URL = "https://api.salesforge.ai/public/v2";
export const PRODUCTS = [
    {
        id: "salesforge",
        displayName: "Salesforge",
        envVar: "SALESFORGE_API_KEY",
        header: "X-Salesforge-Key",
        baseUrl: SALESFORGE_CORE_BASE_URL,
    },
    {
        id: "primeforge",
        displayName: "Primeforge",
        envVar: "PRIMEFORGE_API_KEY",
        header: "X-Primeforge-Key",
        toolPrefix: "primeforge_",
        baseUrl: "https://api.primeforge.ai/public",
    },
    {
        id: "leadsforge",
        displayName: "Leadsforge",
        envVar: "LEADSFORGE_API_KEY",
        header: "X-Leadsforge-Key",
        toolPrefix: "leadsforge_",
        baseUrl: "https://api.leadsforge.ai/public/v1",
    },
    {
        id: "infraforge",
        displayName: "Infraforge",
        envVar: "INFRAFORGE_API_KEY",
        header: "X-Infraforge-Key",
        toolPrefix: "infraforge_",
        baseUrl: "https://api.infraforge.ai/public",
    },
    {
        id: "warmforge",
        displayName: "Warmforge",
        envVar: "WARMFORGE_API_KEY",
        header: "X-Warmforge-Key",
        toolPrefix: "warmforge_",
        baseUrl: "https://api.warmforge.ai/public/v1",
        authScheme: "bearer",
    },
    {
        id: "mailforge",
        displayName: "Mailforge",
        envVar: "MAILFORGE_API_KEY",
        header: "X-Mailforge-Key",
        toolPrefix: "mailforge_",
        baseUrl: "https://api.mailforge.ai/public",
    },
];
export const PRODUCT_IDS = PRODUCTS.map((product) => product.id);
export function isProductId(value) {
    return PRODUCT_IDS.includes(value);
}
export function getProduct(value) {
    return PRODUCTS.find((product) => product.id === value);
}
export function productFromToolName(toolName) {
    const product = PRODUCTS.find((candidate) => candidate.toolPrefix && toolName.startsWith(candidate.toolPrefix));
    return product?.id ?? "salesforge";
}
export function redactSecret(value) {
    if (value.length <= 8)
        return "****";
    return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
//# sourceMappingURL=types.js.map