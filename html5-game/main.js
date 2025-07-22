let scene, camera, renderer, dice, pawn, path = [], currentIndex = 0, diceNumber = 0;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.8), 0.1, 1000);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    const board = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({ color: 0x55aa55 })
    );
    board.rotation.x = -Math.PI / 2;
    scene.add(board);

    dice = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    dice.position.set(-4, 0.5, -4);
    scene.add(dice);

    for (let i = 0; i < 20; i++) {
        path.push(new THREE.Vector3(i * 0.5 - 5, 0.5, 0));
    }

    const pawnGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const pawnMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    pawn = new THREE.Mesh(pawnGeometry, pawnMaterial);
    pawn.position.copy(path[0]);
    scene.add(pawn);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rollDice() {
    diceNumber = Math.floor(Math.random() * 6) + 1;
    dice.rotation.x += Math.PI;
    dice.rotation.y += Math.PI;
    movePawn(diceNumber);
}

function movePawn(steps) {
    currentIndex += steps;
    if (currentIndex >= path.length) currentIndex = path.length - 1;
    pawn.position.copy(path[currentIndex]);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

init();
