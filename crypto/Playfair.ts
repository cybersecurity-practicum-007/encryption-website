//Author: Natalia Zaitseva

export interface CryptoMethod {
    encrypt: (s: string) => Promise<string>;
    decrypt: (s: string) => Promise<string>;
}

//helpers
function buildKeySquare(keyword: string): string[][] {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let keyString = (keyword + alphabet)
        .toUpperCase()
        .replace(/J/g, "I")
        .replace(/[^A-Z]/g, "");
    
    let seen = new Set<string>();
    let key = "";
    for (let c of keyString) {
        if (!seen.has(c)) {
            seen.add(c);
            key += c;
        }
    }
    
    const square: string[][] = [];
    for (let i = 0; i < 25; i += 5) {
        square.push(key.slice(i, i + 5).split(""));
    }
    return square;
}


function findPosition(square: string[][], letter: string): [number, number] {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (square[r][c] === letter) return [r, c];
        }
    }
    throw new Error("Letter not found: " + letter);
}

function prepareText(text: string): string[] {
    let clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let pairs: string[] = [];
    
    for (let i = 0; i < clean.length; i++) {
        let a = clean[i];
        let b = clean[i + 1];
        
        if (!b || a === b) {
            pairs.push(a + "X");
        } else {
            pairs.push(a + b);
            i++; // skip next
        }
    }
    if (pairs.length && pairs[pairs.length - 1].length === 1) {
        pairs[pairs.length - 1] += "X";
    }
    return pairs;
}



function processPair(pair: string, square: string[][], encrypt: boolean): string {
    let [a, b] = pair.split("");
    let [r1, c1] = findPosition(square, a);
    let [r2, c2] = findPosition(square, b);

    if (r1 === r2) {
        c1 = (c1 + (encrypt ? 1 : 4)) % 5;
        c2 = (c2 + (encrypt ? 1 : 4)) % 5;
    } else if (c1 === c2) {
        r1 = (r1 + (encrypt ? 1 : 4)) % 5;
        r2 = (r2 + (encrypt ? 1 : 4)) % 5;
    } else {
        [c1, c2] = [c2, c1];
    }
    return square[r1][c1] + square[r2][c2];
}


function PlayfairFunc(text: string, encrypt: boolean, keyword: string = "PLAYFAIR EXAMPLE") {
    //let square = buildKeySquare(keyword);
    let square = buildKeySquare("keyword");
    let pairs = prepareText(text);
    let result = "";

    for (let p of pairs) {
        result += processPair(p, square, encrypt);
    }
    return result;
}

const playfair: CryptoMethod = {
    encrypt: async (s) => PlayfairFunc(s, true),
    decrypt: async (s) => PlayfairFunc(s, false),
};

export default playfair;