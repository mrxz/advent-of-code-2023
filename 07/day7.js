let input = [
    /* Insert AoC day 7 input here */
    "32T3K 765",
    "T55J5 684",
    "KK677 28",
    "KTJJT 220",
    "QQQJA 483",
]

const bids = input.map(x => x.split(' '))

function maximize(hand) {
    const tally = {};
    for(const c of hand) {
        tally[c] = (tally[c] || 0) + 1;
    }

    if(!('J' in tally)) {
        return hand;
    }

    let maxHand = hand;
    let maxType = -1;
    for(let opt of Object.keys(tally)) {
        let newHand = [...hand].map(x => x === 'J' ? opt : x);
        let type = getType(newHand);
        if(type > maxType) {
            maxHand = newHand;
            maxType = type;
        }
    }
    return maxHand;
}


function getType(hand) {
    const tally = {};
    for(const c of hand) {
        tally[c] = (tally[c] || 0) + 1;
    }
    const values = Object.values(tally).sort((a,b) => b-a);
    if(values[0] == 5) {
        return 5;
    }
    if(values[0] == 4) {
        return 4;
    }
    if(values[0] == 3 && values[1] == 2) {
        return 3.5;
    }
    if(values[0] == 3) {
        return 3;
    }
    if(values[0] == 2&& values[1] == 2) {
        return 2.5;
    }
    if(values[0] == 2) {
        return 2;
    }
    return 1;
}

function score(cards, transform) {
    bids.sort((a, b) => {
        const aT = getType(transform(a[0]));
        const bT = getType(transform(b[0]));
        if(aT != bT) {
            return bT - aT;
        }

        for(let i = 0; i < a[0].length; i++) {
            if(a[0][i] != b[0][i]) {
                return cards.indexOf(b[0][i]) - cards.indexOf(a[0][i]);
            }
        }
        return 0;
    }).reverse()


    return bids.reduce((sum, bid, i) => sum + +bid[1]*(i+1), 0);
}

console.log(score("23456789TJQKA", hand => hand))
console.log(score("J23456789TQKA", hand => maximize(hand)))