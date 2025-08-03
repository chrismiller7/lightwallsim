function create_scene(THREE, OrbitControls) {
  let rods = [];

  globalThis.scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 50);

  globalThis.renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  globalThis.controls = new OrbitControls(camera, renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Function to generate a random bright color
  function getRandomColor() {
    const hue = Math.random();
    return new THREE.Color().setHSL(hue, 1, 0.5);
  }

  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  globalThis.rodw = 40;
  globalThis.rodh = 20;
  const radius = 0.5;
  const height = 5;
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);

  const spacing = 2;
  const offsetX = (rodw * spacing) / 2;
  const offsetY = (rodh * spacing) / 2;

  for (let i = 0; i < rodh; i++) {
    rods.push([]);
    for (let j = 0; j < rodw; j++) {
      const color = getRandomColor();

      const material = new THREE.MeshPhysicalMaterial({
        color: color,
        //transmission: .5, // acrylic transparency
        //thickness: 0.5,
        //roughness: 0.1,
        //metalness: 0.5,
        //clearcoat: 1.0,
        //clearcoatRoughness: 0.1,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5,
      });

      let addX = i % 2 == 0 ? 0 : 1;
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.color = color;
      cylinder.position.set(
        j * spacing - offsetX + addX,
        height / 2,
        i * spacing - offsetY
      );
      scene.add(cylinder);
      rods[i].push(cylinder);
    }
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  globalThis.camera = camera;
  globalThis.rods = rods;
}

globalThis.create_scene = create_scene;
