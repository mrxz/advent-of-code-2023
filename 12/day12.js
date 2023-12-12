let input = [
    /* Insert AoC day 12 input here */
    "???.### 1,1,3",
    ".??..??...?##. 1,1,3",
    "?#?#?#?#?#?#?#? 1,3,1,6",
    "????.#...#... 4,1,1",
    "????.######..#####. 1,6,5",
    "?###???????? 3,2,1",
]

const fits = (field, length, i, wrap) => {
    while(length--) {
        if(field[i] === '.') {
            return false;
        }
        i++;
        if(i > field.length) {
            return false;
        }
    }
    if(i === field.length) {
        return wrap === '.';
    }
    return field[i] !== '#';
}

let completePaths = {};
let higherCache = {};
const bfs = (initialState, fieldTemplate, remainingTemplate, layer) => {
    let queue = [initialState];
    let higherCacheKey = `${layer}|${initialState.field}|${initialState.remaining.join(':')}`;
    if(higherCacheKey in higherCache) {
        return higherCache[higherCacheKey];
    }

    let seenKey = (state) => `${state.field}|${state.remaining.join(':')}|${state.i}`
    let visited = {};
    let total = 0;

    while(queue.length) {
        const nextQueue = [];

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                continue;
            }
            visited[stateKey] = true

            // See what needs to be placed
            let length = state.field.length;
            let i = state.i;

            // Advance to next relevant token ('?' or '#' or 'EOS')
            while(state.field[i] === '.') {
                i++;
            }

            if(i >= length) {
                if(layer === 1) {
                    if(state.remaining.length === 0) {
                        const path = initialState.path + state.field;
                        if(path in completePaths) {
                            throw Error('Duplicate');
                        } else {
                            completePaths[path] = true;
                            total++;
                        }
                    }
                } else {
                    let newField = fieldTemplate;
                    if(layer === 2) {
                        newField = newField.substring(0, newField.length - 1);
                    }
                    total += bfs({
                        field: newField,
                        remaining: [...state.remaining, ...remainingTemplate],
                        i: 0,
                        path: (initialState.path || "") + state.field,
                    }, fieldTemplate, remainingTemplate, layer - 1);
                }
                continue;
            }

            // Place
            {
                if(state.remaining.length === 0) {
                    if(layer !== 1) {
                        // Go down a layer
                        let newField = state.field.substring(i) + fieldTemplate;
                        if(layer === 2) {
                            newField = newField.substring(0, newField.length - 1);
                        }
                        total += bfs({
                            field: newField,
                            remaining: remainingTemplate,
                            i: 0,
                            path: (initialState.path || "") + state.field.substring(0, i),
                        }, fieldTemplate, remainingTemplate, layer - 1)
                        continue;
                    }
                } else {
                    const newRemaining = [...state.remaining];
                    const l = +newRemaining.splice(0, 1);

                    let wrap = layer !== 1 ? fieldTemplate[0] : '.';
                    if(fits(state.field, l, i, wrap)) {
                        const newField = [...state.field];
                        for(let j = i; j < i + l + 1; j++) {
                            if(j == i + l) {
                                if(newField[j] === '?') {
                                    newField[j] = '.';
                                }
                            } else {
                                newField[j] = '#';
                            }
                        }
                        nextQueue.push({
                            field: newField.join(''),
                            i: i + l + 1,
                            remaining: newRemaining,
                        })
                    } else {
                        if(i + l >= state.field.length && layer !== 1) {
                            // Go down a layer
                            let newField = state.field.substring(i) + fieldTemplate;
                            if(layer === 2) {
                                newField = newField.substring(0, newField.length - 1);
                            }
                            total += bfs({
                                field: newField,
                                remaining: [...state.remaining, ...remainingTemplate],
                                i: 0,
                                path: (initialState.path || "") + state.field.substring(0, i),
                            }, fieldTemplate, remainingTemplate, layer - 1)
                            continue;
                        }
                    }
                }

                // Delay
                if(state.field[i] === '?') {
                    const newField = [...state.field].map((x, xi) => xi === i ? '.' : x);
                    nextQueue.push({
                        field: newField.join(''),
                        i: i + 1,
                        remaining: [...state.remaining],
                    })
                }
            }
        }

        queue = nextQueue;
    }

    higherCache[higherCacheKey] = total;
    return total;
}

// Part 1
function configurations(line, layers) {
    const parts = line.split(" ");
    const field = parts[0];
    const lengths = parts[1].split(",").map(x => +x);

    completePaths = {};
    higherCache = {};

    const head = bfs({
        field: field + (layers > 1 ? "?" : ''),
        i: 0,
        remaining: lengths,
        path: '',
    }, field + "?", lengths, layers)
    const options = head;
    //console.log(field, lengths, options);
    return options;
}

// Part 1
let sum = 0;
for(let line of input) {
    sum += configurations(line, 1);
}
console.log(sum);
// Part 2
sum = 0;
for(let line of input) {
    sum += configurations(line, 5);
}
console.log(sum);
