let input = [
    /* Insert AoC day 25 input here */
    "jqt: rhn xhk nvd",
    "rsh: frs pzl lsr",
    "xhk: hfx",
    "cmg: qnr nvd lhk bvb",
    "rhn: xhk bvb hfx",
    "bvb: xhk hfx",
    "pzl: lsr hfx nvd",
    "qnr: nvd",
    "ntq: jqt hfx bvb xhk",
    "nvd: lhk",
    "lsr: lhk",
    "rzs: qnr cmg lsr rsh",
    "frs: qnr lhk lsr",
]

// Part 1
const nodes = {};
for(let line of input) {
    const [from, tos] = line.split(": ");
    const to = tos.split(" ");

    nodes[from] = (nodes[from] || []);
    nodes[from].push(...to);
    for(let toId of to) {
        nodes[toId] = (nodes[toId] || []);
        nodes[toId].push(from);
    }
}

let connections = {};
const bfs = (initialState) => {
    let queue = [initialState];
    let seenKey = (state) => `${state.id}`
    let visited = {};
    let i = 0;

    while(queue.length) {
        const nextQueue = [];

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                continue;
            }
            visited[stateKey] = true
            if(state.prev) {
                const parts = [state.prev.id, state.id];
                parts.sort();
                const connectionKey = `${parts[0]}|${parts[1]}`;
                connections[connectionKey] = (connections[connectionKey] || 0) + 1
            }

            for(let to of nodes[state.id]) {
                nextQueue.push({id: to, prev: state});
            }
        }

        queue = nextQueue;
    }

    return Object.keys(visited).length;
}

// Remove three wires
for(let i = 0; i < 3; i++) {
    // Traverse the network starting from each node and keep track of the connections
    for(let start of Object.keys(nodes)) {
        bfs({id: start, prev: null});
    }
    // The most used connection is a candidate to cut
    let highestConnection = null;
    for(let connection of Object.entries(connections)) {
        if(!highestConnection || highestConnection[1] < connection[1]) {
            highestConnection = connection;
        }
    }
    const nodeIds = highestConnection[0].split("|");
    console.log('Cutting wire:', nodeIds);
    nodes[nodeIds[0]] = nodes[nodeIds[0]].filter(x => x !== nodeIds[1]);
    nodes[nodeIds[1]] = nodes[nodeIds[1]].filter(x => x !== nodeIds[0]);

    connections = {};
}

// Final traversal to find the size of one of the two groups
const groupSize = bfs({id: Object.keys(nodes)[0], prev: null});
const otherGroupSize = Object.keys(nodes).length - groupSize;
console.log(groupSize * otherGroupSize);
