import { Memory } from './memory';
import { APP_LOCAL_CACHE_KEY, APP_SESSION_CACHE_KEY } from '@/enums/cacheEnum';
import { createLocalStorage, createSessionStorage } from '@/utils/cache';
import { DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting';
const ls = createLocalStorage();
const ss = createSessionStorage();
const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);
function initPersistentMemory() {
    const localCache = ls.get(APP_LOCAL_CACHE_KEY);
    const sessionCache = ss.get(APP_SESSION_CACHE_KEY);
    localCache && localMemory.resetCache(localCache);
    sessionCache && sessionMemory.resetCache(sessionCache);
}
export class Persistent {
    static getLocal(key) {
        return localMemory.get(key)?.value;
    }
    static setLocal(key, value, immediate = false) {
        localMemory.set(key, value);
        immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
    }
    static removeLocal(key, immediate = false) {
        localMemory.remove(key);
        immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
    }
    static clearLocal(immediate = false) {
        localMemory.clear();
        immediate && ls.clear();
    }
    static getSession(key) {
        return sessionMemory.get(key)?.value;
    }
    static setSession(key, value, immediate = false) {
        sessionMemory.set(key, value);
        immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
    }
    static removeSession(key, immediate = false) {
        sessionMemory.remove(key);
        immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
    }
    static clearSession(immediate = false) {
        sessionMemory.clear();
        immediate && ss.clear();
    }
    static clearAll(immediate = false) {
        sessionMemory.clear();
        localMemory.clear();
        if (immediate) {
            ls.clear();
            ss.clear();
        }
    }
}
function storageChange(e) {
    const { key, newValue, oldValue } = e;
    if (!key) {
        Persistent.clearAll();
        return;
    }
    if (!!newValue && !!oldValue) {
        if (APP_LOCAL_CACHE_KEY === key) {
            Persistent.clearLocal();
        }
        if (APP_SESSION_CACHE_KEY === key) {
            Persistent.clearSession();
        }
    }
}
window.addEventListener('storage', storageChange);
initPersistentMemory();
