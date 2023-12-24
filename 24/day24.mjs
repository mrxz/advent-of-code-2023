import {vec3, glMatrix} from './gl-matrix.js';

glMatrix.setMatrixArrayType(Array); // Need >32bit integers

let input = [
    /* Insert AoC day 24 input here, does not give solution for example input */
    "19, 13, 30 @ -2,  1, -2",
    "18, 19, 22 @ -1, -1, -2",
    "20, 25, 34 @ -2, -2, -4",
    "12, 31, 28 @ -1, -2, -1",
    "20, 19, 15 @  1, -5, -3",
]

// Part 1
const particles = input.map(line => {
    const parts = line.split(" @ ");
    const position = vec3.set(vec3.create(), ...parts[0].split(", ").map(x => +x));
    const velocity = vec3.set(vec3.create(), ...parts[1].split(", ").map(x => +x));
    return {position, velocity};
});

// Bounds to search in
const lower = 200000000000000;
const higher = 400000000000000;

function intersects(a, b) {
    const lineVec3 = vec3.sub(vec3.create(), b.position, a.position);
    const cross12 = vec3.cross(vec3.create(), a.velocity, b.velocity);
    const cross32 = vec3.cross(vec3.create(), lineVec3, b.velocity);
    const cross31 = vec3.cross(vec3.create(), lineVec3, a.velocity);

    const planarFactor = vec3.dot(lineVec3, cross12);
    if(planarFactor < 0.0001 && vec3.sqrLen(cross12) > 0.0001) {
        const t1 = vec3.dot(cross32, cross12) / vec3.sqrLen(cross12);
        const t2 = vec3.dot(cross31, cross12) / vec3.sqrLen(cross12);

        // Check if the intersection point lies inside the region of interes
        const intersection = vec3.scaleAndAdd(vec3.create(), a.position, a.velocity, t1);
        if(intersection[0] < lower || intersection[0] > higher) {
            return false;
        }
        if(intersection[1] < lower || intersection[1] > higher) {
            return false;
        }
        // Ensure the intersections don't happen in the "past"
        if(t1 < 0 || t2 < 0) {
            return false;
        }
        return true;
    }

    // Lines are parallel
    return false;
}

// Find intersections
let sum = 0;
for(let i = 0; i < particles.length; i++) {
    for(let j = i + 1; j < particles.length; j++) {
        const newA = JSON.parse(JSON.stringify(particles[i]));
        const newB = JSON.parse(JSON.stringify(particles[j]));

        // Ignore Z-axis
        newA.position[2] = newA.velocity[2] = 0
        newB.position[2] = newB.velocity[2] = 0;

        // Check if lines intersect inside region of interest
        if(intersects(newA, newB)) {
            sum++;
        }
    }
}
console.log(sum);

// Part 2

// Note: in the input there is a pair of particles with the same coordinate and velocity on a particular axis
//       they also don't intersect at any point in the future, meaning the only way for our stone to collide
//       with both of them is by being on that same plane (= same velocity)
function findPlanarParticles(axisIndex) {
    const velocities = {};
    for(let particle of particles) {
        const key = `${particle.position[axisIndex]}@${particle.velocity[axisIndex]}`
        if(key in velocities) {
            return [velocities[key], particle];
        }
        velocities[key] = particle;
    }
    return null;
}

const stonePosition = [0, 0, 0];
const stoneVelocity = [0, 0, 0];
for(let axis = 0; axis < 3; axis++) {
    const planarParticles = findPlanarParticles(axis);
    if(!planarParticles) {
        continue;
    }

    // Velocity and start position is known for one axis
    // Note: position is known for an unknown time, but only care about relative time for now
    stoneVelocity[axis] = planarParticles[0].velocity[axis];
    stonePosition[axis] = planarParticles[0].position[axis];

    // Iterate over the particles and compute their position relative to the first planar particle
    let lastParticle = null;
    for(let particle of particles) {
        // Compute the number of time steps along the known axis from the starting position
        const positionDelta = particle.position[axis] - stonePosition[axis];
        const relativeVelocity = stoneVelocity[axis] - particle.velocity[axis];
        const steps = positionDelta/relativeVelocity;
        if(relativeVelocity === 0) {
            continue; // Omit the planar particles
        }

        // Compute the position of said particle after steps
        const adjustedPosition = vec3.scaleAndAdd(vec3.create(), particle.position, particle.velocity, steps);
        if(lastParticle == null) {
            // Record it;
            lastParticle = { steps, position: adjustedPosition }
        } else {
            // Only need two known collision points to compute origin
            const delta = vec3.sub(vec3.create(), lastParticle.position, adjustedPosition);
            const deltaSteps = lastParticle.steps - steps;
            const origin = vec3.scaleAndAdd(vec3.create(), lastParticle.position, delta, -lastParticle.steps/deltaSteps);
            console.log(origin[0] + origin[1] + origin[2]);
            break;
        }
    }
}