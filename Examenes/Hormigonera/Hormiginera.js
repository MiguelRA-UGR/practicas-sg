import * as THREE from "../libs/three.module.js";

class Hormiginera extends THREE.Object3D {
  constructor() {
    super();

    this.maxGrados = 90;
    this.gradosRotados = 0;
    this.velocidadRotacion = 0.01;
    this.direccionRotacion = 1; // 1 para rotación en sentido horario, -1 para rotación en sentido antihorario
    this.velocidadRotacionCilindro = 0.01; // Velocidad de rotación del cilindro en el eje Y

    // Cargar la textura
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./descarga.png");

    // Crear material con textura
    const materialTexturizado = new THREE.MeshBasicMaterial({ map: texture,side: THREE.DoubleSide });

    this.esferaGeom = new THREE.SphereGeometry(1, 20, 20, 0, Math.PI);
    this.esferaGeom.rotateX(THREE.MathUtils.degToRad(90));

    const materialNormal = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

    this.esfera = new THREE.Mesh(this.esferaGeom, materialNormal);

    this.cilindroGeom = new THREE.CylinderGeometry(0.5, 1, 1, 20, 20, true);
    this.cilindroGeom.translate(0, 0.5, 0);

    // Asignar material texturizado al cilindro
    this.cilindro = new THREE.Mesh(this.cilindroGeom, materialTexturizado);

    this.esfera.add(this.cilindro);
    this.add(this.esfera);
  }

  update() {
    // Girar la esfera en el eje X
    this.esfera.rotation.x += this.velocidadRotacion * this.direccionRotacion;

    // Rotar el cilindro en el eje Y
    this.cilindro.rotation.y += this.velocidadRotacionCilindro;

    // Actualizar los grados rotados
    this.gradosRotados += Math.abs(THREE.MathUtils.radToDeg(this.velocidadRotacion));

    // Cambiar la dirección de rotación cuando se alcanza el máximo de grados
    if (this.gradosRotados >= this.maxGrados) {
      this.direccionRotacion *= -1; // Cambiar la dirección de rotación
      this.gradosRotados = 0; // Reiniciar los grados rotados
    }
  }
}

export { Hormiginera };
