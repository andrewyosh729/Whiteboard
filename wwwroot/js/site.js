import * as THREE from 'three';

let localId = parseInt(document.getElementById("id").value);

const controlHubConnection = new signalR.HubConnectionBuilder().withUrl("controlHub").build();
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0.1, 1000)
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
const dotMaterial = new THREE.PointsMaterial({size: 5, color: 0xff0000});
const dot = new THREE.Points(dotGeometry, dotMaterial);
scene.add(dot);


const userDots = new Map();

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

async function onMouseUpdate(e) {

    console.log(localId.value)
    let mouseX = -.5 + e.offsetX / window.innerWidth;
    let mouseY = .5 - e.offsetY / window.innerHeight;
    
    dot.position.x = mouseX;
    dot.position.y = mouseY;

    try {
        await controlHubConnection.invoke("SendData", localId, {x: mouseX, y: mouseY})
    } catch (err) {
        console.error(err);

    }
}

controlHubConnection.on("ReceiveData", function (id, mousePosition) {
    // TODO: See if there is a better way to do this with signalR.
    if (id == localId) {
        return;
    }

    if (!userDots.has(id)) {
        const dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
        const dotMaterial = new THREE.PointsMaterial({
            size: 5,
            color: THREE.MathUtils.randInt(0, 0xffffff)
        });
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
        userDots.set(id, dot);
    }

    let userDot = userDots.get(id)
    userDot.position.x = mousePosition.x;
    userDot.position.y = mousePosition.y;
});

controlHubConnection.start();