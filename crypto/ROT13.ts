//Author: Natalia Zaitseva

export interface CryptoMethod {
    encrypt: (s: string) => Promise<string>;
    decrypt: (s: string) => Promise<string>;
}

//ROT13: shift 13 letters forward for each letter
//all the chars/numbers stays unchanged
//fact: applying it twice returns the previous text
//security rate: no security, only for forums to hide spoilers:)
function rot13Sync(text: string) {
    let result = "";
    
    for (const ch of text) {
        const code = ch.charCodeAt(0);
    
        //uppercase
        if (code >= 65 && code <= 90) {
          const idx = code - 65;
          //%26 wraps around
          const rotated = (idx + 13) % 26;
          //append to the string
          result += String.fromCharCode(65 + rotated);
        }
        //lowercase
        else if (code >= 97 && code <= 122) {
          const idx = code - 97;
          const rotated = (idx + 13) % 26;
          result += String.fromCharCode(97 + rotated);
        }
        //other non-letter cases
        else {
          result += ch;
        }
      }

    return result;
}


const rot13: CryptoMethod = {
    encrypt: async (s) => rot13Sync(s),
    decrypt: async (s) => rot13Sync(s),
};
  
export default rot13;