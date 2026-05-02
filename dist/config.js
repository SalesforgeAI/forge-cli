import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { authError, usageError } from "./errors.js";
import { DEFAULT_PROFILE, getProduct, isProductId, PRODUCTS, } from "./types.js";
export function resolveConfigPath(env, explicitPath) {
    if (explicitPath)
        return explicitPath;
    if (env.FORGE_CLI_CONFIG)
        return env.FORGE_CLI_CONFIG;
    if (env.XDG_CONFIG_HOME)
        return join(env.XDG_CONFIG_HOME, "forge-cli", "config.json");
    if (process.platform === "win32" && env.APPDATA)
        return join(env.APPDATA, "forge-cli", "config.json");
    return join(homedir(), ".config", "forge-cli", "config.json");
}
export async function loadConfig(configPath) {
    let raw;
    try {
        raw = await readFile(configPath, "utf8");
    }
    catch (error) {
        if (isNodeError(error) && error.code === "ENOENT")
            return {};
        throw error;
    }
    const parsed = JSON.parse(raw);
    if (!isConfig(parsed))
        throw usageError(`Invalid Forge CLI config at ${configPath}`);
    return parsed;
}
export async function saveConfig(configPath, config) {
    await mkdir(dirname(configPath), { recursive: true, mode: 0o700 });
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
}
export async function resolveRuntimeConfig(globals, env) {
    const configPath = resolveConfigPath(env, globals.config);
    const config = await loadConfig(configPath);
    const profile = globals.profile ?? env.FORGE_CLI_PROFILE ?? config.defaultProfile ?? DEFAULT_PROFILE;
    const profileConfig = config.profiles?.[profile] ?? {};
    const keys = {};
    const keySources = {};
    for (const product of PRODUCTS) {
        const flagValue = globals.productKeys[product.id];
        const envValue = env[product.envVar];
        const configValue = profileConfig.keys?.[product.id];
        if (flagValue) {
            keys[product.id] = flagValue;
            keySources[product.id] = "flag";
        }
        else if (envValue) {
            keys[product.id] = envValue;
            keySources[product.id] = "env";
        }
        else if (configValue) {
            keys[product.id] = configValue;
            keySources[product.id] = "config";
        }
    }
    return {
        profile,
        configPath,
        keys,
        keySources,
    };
}
export function assertHasAtLeastOneKey(config) {
    if (Object.keys(config.keys).length === 0) {
        throw authError(`At least one product API key is required. Set one with "forge auth set <product>" or pass ${PRODUCTS.map((product) => product.envVar).join(", ")}.`);
    }
}
export async function setStoredKey(configPath, profile, productId, key) {
    if (!isProductId(productId))
        throw usageError(`Unknown product "${productId}"`);
    const config = await loadConfig(configPath);
    const profileConfig = ensureProfile(config, profile);
    profileConfig.keys = { ...profileConfig.keys, [productId]: key };
    config.defaultProfile ??= profile;
    await saveConfig(configPath, config);
}
export async function unsetStoredKey(configPath, profile, productId) {
    if (!isProductId(productId))
        throw usageError(`Unknown product "${productId}"`);
    const config = await loadConfig(configPath);
    const profileConfig = ensureProfile(config, profile);
    if (profileConfig.keys)
        delete profileConfig.keys[productId];
    await saveConfig(configPath, config);
}
export async function clearStoredProfile(configPath, profile) {
    const config = await loadConfig(configPath);
    if (config.profiles)
        delete config.profiles[profile];
    if (config.defaultProfile === profile)
        config.defaultProfile = DEFAULT_PROFILE;
    await saveConfig(configPath, config);
}
export function getProductDisplay(productId) {
    return getProduct(productId).displayName;
}
function ensureProfile(config, profile) {
    config.profiles ??= {};
    config.profiles[profile] ??= {};
    return config.profiles[profile];
}
function isConfig(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNodeError(error) {
    return typeof error === "object" && error !== null && "code" in error;
}
//# sourceMappingURL=config.js.map