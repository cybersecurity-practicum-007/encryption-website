// Affine.ts

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function modInverse(a: number, m: number): number {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) return x;
  }
  throw new Error(`No modular inverse for ${a} under modulus ${m}`);
}

const Affine = {
  encrypt: async (plaintext: string, a: number, b: number): Promise<string> => {
    let result = '';
    for (const ch of plaintext) {
      if (ch >= 'A' && ch <= 'Z') {
        const code = ch.charCodeAt(0) - 65;
        const enc = mod(a * code + b, 26);
        result += String.fromCharCode(enc + 65);
      } else if (ch >= 'a' && ch <= 'z') {
        const code = ch.charCodeAt(0) - 97;
        const enc = mod(a * code + b, 26);
        result += String.fromCharCode(enc + 97);
      } else {
        result += ch;
      }
    }
    return result;
  },

  decrypt: async (ciphertext: string, a: number, b: number): Promise<string> => {
    const a_inv = modInverse(a, 26);
    let result = '';
    for (const ch of ciphertext) {
      if (ch >= 'A' && ch <= 'Z') {
        const code = ch.charCodeAt(0) - 65;
        const dec = mod(a_inv * (code - b), 26);
        result += String.fromCharCode(dec + 65);
      } else if (ch >= 'a' && ch <= 'z') {
        const code = ch.charCodeAt(0) - 97;
        const dec = mod(a_inv * (code - b), 26);
        result += String.fromCharCode(dec + 97);
      } else {
        result += ch;
      }
    }
    return result;
  }
};

export default Affine;
