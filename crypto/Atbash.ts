export interface CryptoMethod {
    encrypt: (s: string) => Promise<string>;
    decrypt: (s: string) => Promise<string>;
}


function atbashSync(text: string) {
    let result = "";
    
    for (const ch of text) {
        // Get the char code of the caracter
        let letter = ch.charCodeAt(0);

        // If the character is lowercase, subtract the char code of 'a' (97) to see how far it's from 'A'
        // then subtract from 25 (index of letters) to get the mirrored index (For example 'c' index -2- would get turned into the 'x' index - 23)
        if(/[a-z]/.test(ch)) {
            result += String.fromCharCode(97 + (25 - (letter - 97)));
        }
        // Same logic but for uppercase letters. Uppercase 'A' has char code of 65.
        else if(/[A-Z]/.test(ch)) {
            result += String.fromCharCode(65 + (25- (letter - 65)));
        }
        // If the character is not a letter, leave it unchanged
        else {
            result += ch;
        }
    }

    return result;
}


const atbash: CryptoMethod = {
    encrypt: async (s) => atbashSync(s),
    decrypt: async (s) => atbashSync(s),
};
  
export default atbash;