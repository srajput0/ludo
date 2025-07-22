let scene, camera, renderer, diceMesh, pawns = [], paths = [], currentPos = 0, diceValue = 0;

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

    diceMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    diceMesh.position.set(-4, 0.5, -4);
    scene.add(diceMesh);

    for (let i = 0; i < 20; i++) {
        paths.push(new THREE.Vector3(i * 0.5 - 5, 0.5, 0));
    }

    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const pawn = new THREE.Mesh(geometry, material);
    pawn.position.copy(paths[0]);
    scene.add(pawn);
    pawns.push(pawn);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rollDice() {
    diceValue = Math.floor(Math.random() * 6) + 1;
    diceMesh.rotation.x += Math.PI;
    diceMesh.rotation.y += Math.PI;
    movePawn(diceValue);
}

function movePawn(steps) {
    currentPos += steps;
    if (currentPos >= paths.length) currentPos = paths.length - 1;
    pawns[0].position.copy(paths[currentPos]);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

init();
