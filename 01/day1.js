let input = [
    /* Insert AoC day 1 input here */
    "1abc2",
    "pqr3stu8vwx",
    "a1b2c3d4e5f",
    "treb7uchet",
]

const letters = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

// Part 1
let sum = 0;
for(let line of input) {
    const chars = [...line].filter(x => Number.isInteger(+x))

    sum += +(chars[0] + chars[chars.length - 1]);

    //console.log(chars);
}

console.log(sum)

// Part 2
sum = 0;
for(let line of input) {
    const digits = [];
    for(let i = 0; i < line.length; i++) {
        if(Number.isInteger(+line[i])) {
            digits.push(line[i]);
        } else {
            for(let text of letters) {
                if(line.substring(i, i + text.length) === text) {
                    digits.push(""+(letters.indexOf(text) + 1));
                }
            }
        }
    }

    sum += +(digits[0] + digits[digits.length - 1]);
}
console.log(sum)