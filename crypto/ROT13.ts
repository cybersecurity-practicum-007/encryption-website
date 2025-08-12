export interface CryptoMethod {
    encrypt: (s: string) => Promise<string>;
    decrypt: (s: string) => Promise<string>;
}


//do the encryption
function rot13Sync(s: string) {
    return 'I am good';
}


const rot13: CryptoMethod = {
    encrypt: async (s) => rot13Sync(s),
    decrypt: async (s) => rot13Sync(s),
};
  
export default rot13;