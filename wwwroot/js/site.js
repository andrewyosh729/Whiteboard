import * as THREE from 'three';

const controlHubConnection = new signalR.HubConnectionBuilder().withUrl("controlHub").build();
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0.1, 1000)
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));
const dotMaterial = new THREE.PointsMaterial({ size: 5, color: 0xff0000 });
const dot = new THREE.Points(dotGeometry, dotMaterial);
scene.add(dot);

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);


let mouseX = null;
let mouseY = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function onMouseUpdate(e) {
    mouseX = -.5 + e.offsetX / window.innerWidth;
    mouseY = .5 -  e.offsetY / window.innerHeight;

    controlHubConnection.invoke("SendData", {
        x: mouseX,
        y: mouseY
    })
        .catch(function (err) {
            return console.error(err.toString());
        });
    console.log(mouseX,mouseY);
}

controlHubConnection.on("ReceiveData", function (mousePosition) {
    dot.position.x = mousePosition.x;
    dot.position.y = mousePosition.y;

});

controlHubConnection.start();