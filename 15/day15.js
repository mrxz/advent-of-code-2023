/* Insert AoC day 15 input here */
let input = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7"

function hash(input) {
    let r = 0;
    for(let i = 0; i < input.length; i++) {
        let c = input.charCodeAt(i);
        r += c;
        r *= 17;
        r %= 256;
    }
    return r;
}

// Part 1
console.log(input.split(",").map(x => hash(x)).reduce((acc,x) => acc + x));

// Part 2
let boxes = [];
for(let line of input.split(",")) {
    const [label, focal] = line.split(/[=-]/);
    const operation = line.indexOf('=') !== -1 ? '=' : '-';

    const boxId = hash(label);
    const box = boxes[boxId] = (boxes[boxId] || []);

    const index = box.findIndex(b => b.label === label);
    if(operation == '=') {
        if(index !== -1) {
            box[index].focal = focal;
        } else {
            box.push({label, focal});
        }
    } else {
        if(index !== -1) {
            box.splice(index, 1);
        }
    }
}

let sum = 0;
for(let bi = 0; bi < 256; bi++) {
    const box = boxes[bi];
    if(!box) {continue};

    for(let i = 0; i < box.length; i++) {
        sum += (bi + 1) * (i + 1) * box[i].focal;
    }
}

console.log(sum)