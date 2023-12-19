let input = [
    /* Insert AoC day 19 input here */
    "px{a<2006:qkq,m>2090:A,rfg}",
    "pv{a>1716:R,A}",
    "lnx{m>1548:A,A}",
    "rfg{s<537:gd,x>2440:R,A}",
    "qs{s>3448:A,lnx}",
    "qkq{x<1416:A,crn}",
    "crn{x>2662:A,R}",
    "in{s<1351:px,qqz}",
    "qqz{s>2770:qs,m<1801:hdj,R}",
    "gd{a>3333:R,R}",
    "hdj{m>838:A,pv}",
    "",
    "{x=787,m=2655,a=1222,s=2876}",
    "{x=1679,m=44,a=2067,s=496}",
    "{x=2036,m=264,a=79,s=2244}",
    "{x=2461,m=1339,a=466,s=291}",
    "{x=2127,m=1623,a=2188,s=1013}",
]

// Parse
function parseCondition(cond) {
    if(cond.indexOf('>') !== -1) {
        return {
            var: cond.substring(0, cond.indexOf('>')),
            op: '>',
            val: +cond.substring(cond.indexOf('>') + 1),
        }
    } else if(cond.indexOf('<') !== -1) {
        return {
            var: cond.substring(0, cond.indexOf('<')),
            op: '<',
            val: +cond.substring(cond.indexOf('<') + 1),
        }
    } else {
        throw Error('Unsupported condition: ' + cond);
    }
}

let rules = {};
let i;
for(i = 0; i < input.length; i++) {
    if(input[i] === '') {
        break;
    }

    const line = input[i];
    const ruleName = line.split("{")[0];
    const steps = line.substring(ruleName.length + 1, line.length - 1).split(",")
        .map(s => {
            if(s.indexOf(":") !== -1) {
                return {
                    condition: parseCondition(s.split(":")[0]),
                    jump: s.split(":")[1],
                }
            }
            return { jump: s }
        });

    rules[ruleName] = steps;
}

// Part 1
let sum = 0;

let objects = {};
for(i++; i < input.length; i++) {
    const line = input[i];
    const pairs = line.substring(1, line.length - 1).split(",").map(x => x.split("=")).map(p => [p[0], +p[1]]);
    const obj = Object.fromEntries(pairs);

    let r = rules['in'];
    let pc = 0;
    while(r) {
        let nextRule = null;
        if(r[pc].condition) {
            const cond = r[pc].condition;
            const objValue = obj[cond.var];
            if(cond.op === '>') {
                if(objValue > cond.val) {
                    nextRule = r[pc].jump;
                }
            } else {
                if(objValue < cond.val) {
                    nextRule = r[pc].jump;
                }
            }
        } else {
            nextRule = r[pc].jump;
        }

        if(nextRule) {
            if(nextRule in rules) {
                r = rules[nextRule];
                pc = 0;
            } else {
                if(nextRule === 'A') {
                    sum += +(obj['x'] + obj['m'] + obj['a'] + obj['s']);
                }
                break;
            }
        } else {
            pc++;
        }
    }
}

console.log(sum);

// Part 2
{
    const ranges = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]};

    function getRanges(ruleName, inputRange) {
        if(ruleName === 'A') {
            return [JSON.parse(JSON.stringify(inputRange))];
        } else if(ruleName === 'R') {
            return [];
        }

        let result = [];
        let remainingRange = JSON.parse(JSON.stringify(inputRange));

        let r = rules[ruleName];
        for(let pc = 0; pc < r.length; pc++) {
            if(r[pc].condition) {
                const cond = r[pc].condition;
                if(cond.op === '>') {
                    // Split the range
                    const childRange = JSON.parse(JSON.stringify(remainingRange));
                    childRange[cond.var] = [cond.val + 1, remainingRange[cond.var][1]];
                    remainingRange[cond.var] = [remainingRange[cond.var][0], cond.val];
                    result.push(getRanges(r[pc].jump, childRange));
                } else {
                    const childRange = JSON.parse(JSON.stringify(remainingRange));
                    childRange[cond.var] = [remainingRange[cond.var][0], cond.val - 1];
                    remainingRange[cond.var] = [cond.val, remainingRange[cond.var][1]];
                    result.push(getRanges(r[pc].jump, childRange));
                }
            } else {
                result.push(getRanges(r[pc].jump, remainingRange));
            }
        }
        return result.flat();
    }

    let acceptedRanges = getRanges('in', ranges);
    let sum = 0;
    for(let r of acceptedRanges) {
        let options = (r.x[1] - r.x[0] + 1) * (r.m[1] - r.m[0] + 1) * (r.a[1] - r.a[0] + 1) * (r.s[1] - r.s[0] + 1);
        sum += options;
    }
    console.log(sum);
}
