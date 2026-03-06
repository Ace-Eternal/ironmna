import { cacheCipher } from '@/settings/encryptionSetting';
import { AesEncrypt } from '../cipher';
import { isNullOrUnDef } from '../is';
export const createStorage = ({ prefixKey = '', storage = sessionStorage, hasEncrypt = true, key = cacheCipher.key, iv = cacheCipher.iv, timeout = null } = {}) => {
    if (hasEncrypt && [key.length, iv.length].some(item => item !== 16)) {
        throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
    }
    const encrypt = new AesEncrypt({ key, iv });
    /**
     * Cache class
     * Construction parameters can be passed into sessionStorage, localStorage
     * @class Cache
     * @example
     */
    const WebStorage = class WebStorage {
        storage;
        prefixKey;
        encrypt;
        hasEncrypt;
        constructor() {
            this.storage = storage;
            this.prefixKey = prefixKey;
            this.encrypt = encrypt;
            this.hasEncrypt = hasEncrypt;
        }
        getKey(key) {
            return `${this.prefixKey}${key}`.toUpperCase();
        }
        /**
         * Set cache
         * @param {string} key
         * @param {*} value
         * @param {*} expire Expiration time in seconds
         * @memberof Cache
         */
        set(key, value, expire = timeout) {
            const stringData = JSON.stringify({
                value,
                time: Date.now(),
                expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null
            });
            const stringifyValue = this.hasEncrypt ? this.encrypt.encryptByAES(stringData) : stringData;
            this.storage.setItem(this.getKey(key), stringifyValue);
        }
        /**
         * Read cache
         * @param {string} key
         * @param {*} def
         * @memberof Cache
         */
        get(key, def = null) {
            const val = this.storage.getItem(this.getKey(key));
            if (!val)
                return def;
            try {
                const decVal = this.hasEncrypt ? this.encrypt.decryptByAES(val) : val;
                const data = JSON.parse(decVal);
                const { value, expire } = data;
                if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
                    return value;
                }
                this.remove(key);
            }
            catch (e) {
                return def;
            }
        }
        /**
         * Delete cache based on key
         * @param {string} key
         * @memberof Cache
         */
        remove(key) {
            this.storage.removeItem(this.getKey(key));
        }
        /**
         * Delete all caches of this instance
         */
        clear() {
            this.storage.clear();
        }
    };
    return new WebStorage();
};
