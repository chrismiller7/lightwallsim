function create_scene(THREE, OrbitControls) {
  let rods = [];

  globalThis.THREE = THREE;
  globalThis.scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

  const spacingX = 4;
  const spacingY = 2.675;
  const centerX = (rodw * spacingX) / 2;
  const centerY = (rodh * spacingY) / 2;

  globalThis.selectableObjects = [];
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

      let addX = i % 2 == 0 ? 0 : spacingX / 2;
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.color = color;

      let posx = j * spacingX - centerX + addX;
      let posy = i * spacingY - centerY;
      cylinder.x = j;
      cylinder.y = i;
      cylinder.position.set(posx, height / 2, posy);
      scene.add(cylinder);
      selectableObjects.push(cylinder);
      rods[i].push(cylinder);

      let blur = createBlur(THREE, color, 0.05);
      blur.position.set(posx, height, posy);
      cylinder.blur = blur;
      scene.add(blur);

      cylinder.setColor = (cc) => {
        for (let i = 0; i < cylinder.blur.geometry.attributes.color.array.length; i += 4) {
          cylinder.blur.geometry.attributes.color.array[i + 0] = cc.r;
          cylinder.blur.geometry.attributes.color.array[i + 1] = cc.g;
          cylinder.blur.geometry.attributes.color.array[i + 2] = cc.b;
        }
        cylinder.blur.geometry.attributes.color.needsUpdate = true;
        //cylinder.blur.material.color = cc;
        cylinder.material.color = cc;
        cylinder.material.emissive = cc;
      };
    }
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  renderer.domElement.addEventListener(
    'mousedown',
    (e) => {
      getObjectFromPos(e.clientX, e.clientY);
    },
    false
  );

  globalThis.camera = camera;
  globalThis.rods = rods;
}

globalThis.getObjectFromPos = function (mousex, mousey) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  pointer.x = (mousex / window.innerWidth) * 2 - 1;
  pointer.y = -(mousey / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(selectableObjects, true);
  if (intersects.length > 0 && onObjectClick) {
    onObjectClick(intersects[0].object);
  }
};

function createBlur(THREE, color, alpha) {
  const geometry = new THREE.BufferGeometry();
  let count = 7;
  let size = 10;
  let pos = [];
  let cols = [];

  for (let i = 0; i < count; i += 1) {
    pos.push(0, 0, 0);
    cols.push(color.r, color.g, color.b, alpha);

    let len = (Math.PI * 2) / count;
    pos.push(Math.cos(i * len) * size, 0, Math.sin(i * len) * size);
    cols.push(color.r, color.g, color.b, 0);

    pos.push(Math.cos((i + 1) * len) * size, 0, Math.sin((i + 1) * len) * size);
    cols.push(color.r, color.g, color.b, 0);
  }

  const positions = new Float32Array(pos);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const colors = new Float32Array(cols);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4)); // 3 components for RGB

  const material = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, side: 2, depthTest: false });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

globalThis.create_scene = create_scene;
