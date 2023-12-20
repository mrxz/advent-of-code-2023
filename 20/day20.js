let input = [
    /* Insert AoC day 20 input here */
    "broadcaster -> a, b, c",
    "%a -> b",
    "%b -> c",
    "%c -> inv",
    "&inv -> a",
]

// Part 1
let nodes = {};
for(let line of input) {
    const parts = line.split(" -> ");
    const outputs = parts[1].split(", ");
    let label = parts[0];
    let type = 'broadcast';
    if(label[0] === '%') {
        type = 'flip';
        label = label.substring(1);
    } else if(label[0] === '&') {
        type = 'memory';
        label = label.substring(1);
    }

    nodes[label] = {
        type,
        outputs,
        state: 0,
        lastInputs: {}
    };
}

// Figure out all inputs for memory nodes
for(let [label, node] of Object.entries(nodes)) {
    for(let output of node.outputs) {
        if(!(output in nodes)) {
            continue;
        }
        if(nodes[output].type === 'memory') {
            nodes[output].lastInputs[label] = 0;
        }
    }
}

const originalNodes = JSON.parse(JSON.stringify(nodes));

function pushButton(i, trigger, listen) {
    let lowPulses = 0;
    let highPulses = 0;

    let queue = [{from: 'button', to: trigger, pulse: 0}];
    while(queue.length) {
        const message = queue.splice(0, 1)[0];
        if(message.pulse === 0) {
            lowPulses++;
        } else {
            highPulses++;
        }

        const targetNode = nodes[message.to];
        if(!targetNode) {
            continue;
        } else if(targetNode.type === 'broadcast') {
            for(let output of targetNode.outputs) {
                queue.push({from: message.to, to: output, pulse: 0});
            }
        } else if(targetNode.type === 'flip') {
            // Low pulse == flip + emit
            if(message.pulse == 0) {
                // Flip state and emit high pulse
                targetNode.state = 1 - targetNode.state;
                for(let output of targetNode.outputs) {
                    queue.push({from: message.to, to: output, pulse: targetNode.state});
                }
            }
        } else if(targetNode.type === 'memory') {
            // Update
            targetNode.lastInputs[message.from] = message.pulse;
            let outPulse = Object.values(targetNode.lastInputs).every(p => p === 1) ? 0 : 1
            if(message.to === listen && outPulse === 0) {
                return i + 1; // Include the current press, hence + 1
            }
            for(let output of targetNode.outputs) {
                queue.push({from: message.to, to: output, pulse: outPulse});
            }
        }
    }

    return [lowPulses, highPulses];
}

// Part 1
{
    let lowPulses = 0;
    let highPulses = 0;
    for(let i = 0; i < 1000; i++) {
        let pulses = pushButton(i, 'broadcaster', null);

        lowPulses += pulses[0];
        highPulses += pulses[1];
    }
    console.log(lowPulses * highPulses);
}

// Part 2
const rxTriggerNode = Object.entries(nodes).find(x => x[1].outputs[0] === 'rx');
if(rxTriggerNode)
{
    let cycles = [];

    // Note: it seems RX is triggered by one conjunction node which itself is triggered
    //       by several conjunction nodes that in turn are triggered by one conjunction node each.
    //       These nodes end up having their own exclusive network of flip-flops triggered by the button
    //       Find cycles for each of these and compute the moment they all synchronize
    // Example:
    //                          ..................  (4x network of flip-flops)
    //                            |   |   |   |
    //                            nx  dj  zp  bz    (all conjunction nodes)
    //                            |   |   |   |
    //                            vd  ns  bh  dl    (all conjunction nodes)
    //                             \   |  |   /
    //                                  zh          (conjunction node)
    //                                  |
    //                                  rx

    const networkNodes = Object.keys(nodes[rxTriggerNode[0]].lastInputs).map(x => Object.entries(nodes).find(n => n[1].outputs.indexOf(x) !== -1)[0]);

    // Reset machine
    for(let networkNode of networkNodes) {
        nodes = JSON.parse(JSON.stringify(originalNodes));
        for(let i = 0; ; i++) {
            let pulses = pushButton(i, 'broadcaster', networkNode);
            if(typeof pulses !== 'object') {
                cycles.push(pulses);
                break;
            }
        }
    }

    // Result
    console.log(cycles.reduce((a,x) => a*x, 1))
}
