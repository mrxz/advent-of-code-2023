let input = [
    /* Insert AoC day 5 input here */
    "Time:      7  15   30",
    "Distance:  9  40  200",
]

// Part 1
let times = input[0].split(':')[1].split(/\s+/).filter(x => !!x).map(x => +x);
let distances = input[1].split(':')[1].split(/\s+/).filter(x => !!x).map(x => +x);
let races = [];
for(let i = 0; i < times.length; i++) {
    races.push({
        time: times[i],
        dist: distances[i]
    })
}

// Part 1
let product = 1;
for(let race of races) {
    console.log(race);

    let ways = 0;
    for(let p = 0; p < race.time; p++) {
        const speed = p;
        const totalDist = (race.time - p) * speed;

        if(totalDist > race.dist) {
            ways++;
        }
    }

    product *= ways;
}

console.log(product)
console.log();

// Part 2

{
    const time = +input[0].split(':')[1].replace(/\s+/g, '')
    const distToBeat = +input[1].split(':')[1].replace(/\s+/g, '')
    const f = (p) => (time - p) * p;

    // Binary search raising edge
    let low = 0;
    let high = Math.floor(time/2);
    while(high - low > 1)
    {
        const mid = Math.floor((low + high)/2);
        //console.log(f(low), f(high), low, mid, high);

        if(f(mid) > distToBeat) {
            // Move high to mid
            high = mid;
        } else {
            low = mid;
        }
    }
    const lowerBound = high;

    // Binary search falling edge
    low = Math.floor(time/2);
    high = time;
    while(high - low > 1)
    {
        const mid = Math.floor((low + high)/2);
        //console.log(f(low), f(high), low, mid, high);

        if(f(mid) > distToBeat) {
            // Move high to mid
            low = mid;
        } else {
            high = mid;
        }
    }
    const higherBound = low;

    console.log(higherBound - lowerBound + 1);
}