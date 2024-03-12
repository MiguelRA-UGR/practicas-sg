import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';

import { Motor } from './Motor.js';
import { Minigun } from './Minigun.js';

class Coche extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();
        
        this.createGUI(gui);
        this.crearMateriales();
        this.cargarModelos();
        this.crearFocos();

        //Definicion de formas para extrusion
        const radius = 0.05;
        const segments = 32;
        this.circleShape = new THREE.Shape();
        this.circleShape.moveTo(radius, 0);
        for (let i = 1; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const x = radius * Math.cos(theta);
            const y = radius * Math.sin(theta);
            this.circleShape.lineTo(x, y);
        }

        var baseShape = new THREE.Shape();
        baseShape.moveTo(0.8, 2.4);
        baseShape.lineTo(1.2, 2);
        baseShape.lineTo(1.2, 1.6);
        baseShape.lineTo(0.8, 1.2);
        baseShape.lineTo(0.8, 0.6);
        baseShape.lineTo(1.2, 0);
        baseShape.lineTo(1.2, -0.6);
        baseShape.lineTo(0.8, -1);
        baseShape.lineTo(0.8, -1.8);
        baseShape.lineTo(1, -2);
        baseShape.lineTo(1.2, -2.2);
        baseShape.lineTo(1, -2.6);
        baseShape.lineTo(0.6, -2.6);
        baseShape.lineTo(0.4, -2.8);
        baseShape.lineTo(-0.4, -2.8);
        baseShape.lineTo(-0.6, -2.6);
        baseShape.lineTo(-1, -2.6);
        baseShape.lineTo(-1.2, -2.2);
        baseShape.lineTo(-1, -2);
        baseShape.lineTo(-0.8, -1.8);
        baseShape.lineTo(-0.8, -1);
        baseShape.lineTo(-1.2, -0.6);
        baseShape.lineTo(-1.2, 0);
        baseShape.lineTo(-0.8, 0.6);
        baseShape.lineTo(-0.8, 1.2);
        baseShape.lineTo(-1.2, 1.6);
        baseShape.lineTo(-1.2, 2);
        baseShape.lineTo(-0.8, 2.4);
        
        //Definicion de trayectorias de extrusion
        const baseShapePoints = [
            new THREE.Vector3(0.0, 0.1, 2.4),
            new THREE.Vector3(0.8, 0.1, 2.4),
            new THREE.Vector3(1.2, 0.1, 2),
            new THREE.Vector3(1.2, 0.1, 1.6),
            new THREE.Vector3(0.8, 0.1, 1.2),
            new THREE.Vector3(0.8, 0.1, 0.6),
            new THREE.Vector3(1.2, 0.1, 0),
            new THREE.Vector3(1.2, 0.1, -0.6),
            new THREE.Vector3(0.8, 0.1, -1),
            new THREE.Vector3(0.8, 0.1, -1.8),
            new THREE.Vector3(1, 0.1, -2),
            new THREE.Vector3(1.2, 0.1, -2.2),
            new THREE.Vector3(1, 0.1, -2.6),
            new THREE.Vector3(0.6, 0.1, -2.6),
            new THREE.Vector3(0.4, 0.1, -2.8),
            new THREE.Vector3(-0.4, 0.1, -2.8),
            new THREE.Vector3(-0.6, 0.1, -2.6),
            new THREE.Vector3(-1, 0.1, -2.6),
            new THREE.Vector3(-1.2, 0.1, -2.2),
            new THREE.Vector3(-1, 0.1, -2),
            new THREE.Vector3(-0.8, 0.1, -1.8),
            new THREE.Vector3(-0.8, 0.1, -1),
            new THREE.Vector3(-1.2, 0.1, -0.6),
            new THREE.Vector3(-1.2, 0.1, 0),
            new THREE.Vector3(-0.8, 0.1, 0.6),
            new THREE.Vector3(-0.8, 0.1, 1.2),
            new THREE.Vector3(-1.2, 0.1, 1.6),
            new THREE.Vector3(-1.2, 0.1, 2),
            new THREE.Vector3(-0.8, 0.1, 2.4),
            new THREE.Vector3(0.0, 0.1, 2.4)
        ];

        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(0, 0.05, 0);

        const path = new THREE.CatmullRomCurve3([
            start,
            end
        ]);

        const pathChasis = new THREE.CatmullRomCurve3(baseShapePoints,false,'catmullrom',0);

        var extrudeSettingsBase = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: path
        };

        var extrudeSettingsBaseChasis = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: pathChasis
        };

        var baseChasisGeom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsBaseChasis);
        
        var baseGeom = new THREE.ExtrudeGeometry(baseShape, extrudeSettingsBase);
        this.base = new THREE.Mesh(baseGeom, this.metalGris);
        this.baseChasis = new THREE.Mesh(baseChasisGeom, this.metalGris);
       

        this.baseChasis.rotateY(THREE.MathUtils.degToRad(-90));
        this.base.rotateY(THREE.MathUtils.degToRad(-90));

        this.ejeRuedaGeom = new THREE.CylinderGeometry(0.05,0.05,0.7,20,20);
        this.ejeRuedaGeom.rotateX(THREE.MathUtils.degToRad(-90));
        this.ejerueda1 = new THREE.Mesh(this.ejeRuedaGeom, this.metalGris);
        
        this.ejerueda2 = this.ejerueda1.clone();
        this.ejerueda3 = this.ejerueda1.clone();
        this.ejerueda4 = this.ejerueda1.clone();

        this.ejerueda1.position.set(1.4,0,1);
        this.ejerueda2.position.set(1.4,0,-1);

        this.ejerueda3.scale.set(1,1,1.2);
        this.ejerueda4.scale.set(1,1,1.2);
        this.ejerueda3.position.set(-0.8,0.3,1.2);
        this.ejerueda4.position.set(-0.8,0.3,-1.2);

        this.base.add(this.ejerueda1);
        this.base.add(this.ejerueda2);
        this.base.add(this.ejerueda3);
        this.base.add(this.ejerueda4);
        this.base.add(this.baseChasis);

        this.crearChasis();

    
        this.motor = new Motor(gui, "Motor");
        this.motor.scale.set(0.4,0.4,0.4);
        this.motor.position.set(0,0.05,-0.8);
        this.add(this.motor);

        this.minigun = new Minigun(gui, "MInigun");
        this.minigun.scale.set(0.2,0.2,0.2);
        this.minigun.position.set(0,1.5,0);
        this.minigun.rotateX(THREE.MathUtils.degToRad(90));
        this.add(this.minigun);

        this.add(this.base);

    };

	crearMateriales(){
		this.metalGris = new THREE.MeshStandardMaterial({
            color: 0x808080,
            metalness: 0.5,
            roughness: 0.5  
        });

        this.materialFoco = new THREE.MeshStandardMaterial({ color: 0xFFBF00, transparent: true, opacity: 0.7 });
	}

    crearFocos(){
		this.focoIntGeom = new THREE.SphereGeometry(0.1,20,20);
        this.focoExtGeom = new THREE.SphereGeometry(0.15,20,20);
        this.cuboGeom = new THREE.BoxGeometry(0.3,0.3,0.3);
        this.interiorFoco = new THREE.Mesh(this.focoIntGeom, this.materialFoco);
        this.exteriorFoco = new THREE.Mesh(this.focoExtGeom, this.metalGris);
        
        this.cubo= new THREE.Mesh(this.cuboGeom, this.metalGris);
        this.cubo.position.set(0,0,0.15);
        this.cubo.rotateX(THREE.MathUtils.degToRad(30))

        var focoCSG = new CSG();
		focoCSG.subtract([this.exteriorFoco, this.cubo, this.interiorFoco]);
		this.foco = focoCSG.toMesh();
        this.foco.add(this.interiorFoco);

        this.luzfoco = new THREE.DirectionalLight(0xffffff,1);
        
        const targetPosition = new THREE.Vector3(0, 0, 10);
        this.luzfoco.position.set(0, 0, -0.2);
        this.luzfoco.target.position.copy(targetPosition);
        const helper = new THREE.DirectionalLightHelper( this.luzfoco,5);
        
        this.luzfoco2 = this.luzfoco.clone();
        this.luzfoco2.position.set(0, 0, -0.2);
        const helper2 = new THREE.DirectionalLightHelper( this.luzfoco2,5);

        
        this.foco2 = this.foco.clone();
        this.foco.position.set(-0.5,0.5,2.35);
        this.foco2.position.set(0.5,0.5,2.35);
        this.foco.add(this.luzfoco);
        this.foco2.add(this.luzfoco2);

        this.add(helper);
        this.add(helper2);
        this.add(this.foco);
        this.add(this.foco2);
	}

	createGUI(gui) {
        const self = this;
        this.guiControls = new function() {
            this.focoEncendido = false;
        };
    
        gui.add(this.guiControls, 'focoEncendido').name('Foco encendido').onChange(function(value) {
            self.luzfoco.visible = value;
        });
    }


    cargarModelos() {
        const self = this;
    
        const mtlLoader = new MTLLoader();
        const mtlPath = '../models/rueda1/disk.mtl';
    
        mtlLoader.load(mtlPath, function(materials) {
            materials.preload();
    
            const objLoader = new OBJLoader();
    
            objLoader.setMaterials(materials);
    
            const objPath = '../models/rueda1/disk.obj';
    
            objLoader.load(objPath, function(rueda) {
                
                rueda.scale.set(0.2,0.2,0.3);
                rueda.position.set(1.4,0.05,1.4);

                self.base.add(rueda);

                const rueda2 = rueda.clone();
                const rueda3 = rueda.clone();
                const rueda4 = rueda.clone();

                const rueda5 = rueda.clone();
                
                rueda2.scale.set(0.2,0.2,0.3);
                rueda2.rotateY(THREE.MathUtils.degToRad(180));
                rueda2.position.set(1.4,0.05,-1.4);
                rueda3.scale.set(0.3,0.3,0.3);
                rueda3.position.set(-0.8,0.35,1.7);
                rueda4.scale.set(0.3,0.3,0.3);
                rueda4.rotateY(THREE.MathUtils.degToRad(180));
                rueda4.position.set(-0.8,0.35,-1.7);
                rueda5.scale.set(0.2,0.2,0.2);
                rueda5.rotateY(THREE.MathUtils.degToRad(-90));
                rueda5.rotateX(THREE.MathUtils.degToRad(-40));
                rueda5.position.set(-1.8,0.9,0);

                self.base.add(rueda2);
                self.base.add(rueda3);
                self.base.add(rueda4);
                self.base.add(rueda5);

            });
        });
    }
    
    crearChasis(){
        const chasisLargoPoints = [
            new THREE.Vector3(0.6, 0, -2.6),
            new THREE.Vector3(0.4, 0.8, -1.8),
            new THREE.Vector3(0.6, 1.2, -1),
            new THREE.Vector3(0.6, 1.2, 0.6),
            new THREE.Vector3(0.8, 1.0, 1.2),
            new THREE.Vector3(0.6, 0, 2),
            new THREE.Vector3(0.6, 0, 2.4)
        ];

        const pieza1points = [
            new THREE.Vector3(-0.8, 0, -1.8),
            new THREE.Vector3(-0.4, 0.8, -1.8),
        ];

        const pieza2points = [
            new THREE.Vector3(-0.6, 1.2, -1),
            new THREE.Vector3(-0.8, 0, -1)
        ];
    
        const pieza3points = [
            new THREE.Vector3(-0.6, 1.2, 0.6),
            new THREE.Vector3(-0.8, 0, 0.6)
        ];
    
        const pieza4points = [
            new THREE.Vector3(-0.6, 1.2, 0.6),
            new THREE.Vector3(-0.8, 0, 1.2)
        ];

        const pieza5points = [
            new THREE.Vector3(-0.8, 1, 1.2),
            new THREE.Vector3(-0.8, 0, 1.2)
        ];
    
        const pieza6points = [
            new THREE.Vector3(-0.6, 1.2, -1),
            new THREE.Vector3(0.6, 1.2, -1)
        ];

        const pieza7points = [
            new THREE.Vector3(-0.6, 1.2, 0.6),
            new THREE.Vector3(0.6, 1.2, 0.6)
        ];

        const pieza8points = [
            new THREE.Vector3(-0.8, 1, 1.2),
            new THREE.Vector3(0.8, 1, 1.2)
        ];

        const pieza9points = [
            new THREE.Vector3(-0.6, 0, 2),
            new THREE.Vector3(0.6, 0, 2)
        ];

        const pieza10points = [
            new THREE.Vector3(-0.4, 0.8, -1.8),
            new THREE.Vector3(0.4, 0.8, -1.8)
        ];

        const pieza11points = [
            new THREE.Vector3(-0.8, 1.0, 1.2),
            new THREE.Vector3(0.6, 0, 2)
        ];

        const pieza12points = [
            new THREE.Vector3(0.8, 1.0, 1.2),
            new THREE.Vector3(-0.6, 0, 2)
        ];
    
        const pathPieza2 = new THREE.CatmullRomCurve3(pieza2points, false, 'catmullrom', 0);
        const pathPieza3 = new THREE.CatmullRomCurve3(pieza3points, false, 'catmullrom', 0);
        const pathPieza4 = new THREE.CatmullRomCurve3(pieza4points, false, 'catmullrom', 0);
        const pathPieza5 = new THREE.CatmullRomCurve3(pieza5points, false, 'catmullrom', 0);
        const pathPieza6 = new THREE.CatmullRomCurve3(pieza6points, false, 'catmullrom', 0);
        const pathPieza7 = new THREE.CatmullRomCurve3(pieza7points, false, 'catmullrom', 0);
        const pathPieza8 = new THREE.CatmullRomCurve3(pieza8points, false, 'catmullrom', 0);
        const pathPieza9 = new THREE.CatmullRomCurve3(pieza9points, false, 'catmullrom', 0);
        const pathPieza10 = new THREE.CatmullRomCurve3(pieza10points, false, 'catmullrom', 0);
        const pathPieza11 = new THREE.CatmullRomCurve3(pieza11points, false, 'catmullrom', 0);
        const pathPieza12 = new THREE.CatmullRomCurve3(pieza12points, false, 'catmullrom', 0);
        
    
        const extrudeSettingsPieza2 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza2 };
        const extrudeSettingsPieza3 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza3 };
        const extrudeSettingsPieza4 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza4 };
        const extrudeSettingsPieza5 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza5 };
        const extrudeSettingsPieza6 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza6 };
        const extrudeSettingsPieza7 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza7 };
        const extrudeSettingsPieza8 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza8 };
        const extrudeSettingsPieza9 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza9 };
        const extrudeSettingsPieza10 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza10 };
        const extrudeSettingsPieza11 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza11 };
        const extrudeSettingsPieza12 = { steps: 100, bevelEnabled: false, extrudePath: pathPieza12 };
    
        const pieza2Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza2);
        const pieza3Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza3);
        const pieza4Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza4);
        const pieza5Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza5);
        const pieza6Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza6);
        const pieza7Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza7);
        const pieza8Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza8);
        const pieza9Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza9);
        const pieza10Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza10);
        const pieza11Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza11);
        const pieza12Geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsPieza12);
    
        pieza2Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza3Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza4Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza5Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza6Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza7Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza8Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza9Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza10Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza11Geom.rotateY(THREE.MathUtils.degToRad(-90));
        pieza12Geom.rotateY(THREE.MathUtils.degToRad(-90));
    
        this.chasispieza2 = new THREE.Mesh(pieza2Geom, this.metalGris);
        this.chasispieza3 = new THREE.Mesh(pieza3Geom, this.metalGris);
        this.chasispieza4 = new THREE.Mesh(pieza4Geom, this.metalGris);
        this.chasispieza5 = new THREE.Mesh(pieza5Geom, this.metalGris);
        this.chasispieza6 = new THREE.Mesh(pieza6Geom, this.metalGris);
        this.chasispieza7 = new THREE.Mesh(pieza7Geom, this.metalGris);
        this.chasispieza8 = new THREE.Mesh(pieza8Geom, this.metalGris);
        this.chasispieza9 = new THREE.Mesh(pieza9Geom, this.metalGris);
        this.chasispieza10 = new THREE.Mesh(pieza10Geom, this.metalGris);
        this.chasispieza11 = new THREE.Mesh(pieza11Geom, this.metalGris);
        this.chasispieza12 = new THREE.Mesh(pieza12Geom, this.metalGris);

        const pathChasisLargo = new THREE.CatmullRomCurve3(chasisLargoPoints,false,'catmullrom',0);
        const pathpieza1 = new THREE.CatmullRomCurve3(pieza1points,false,'catmullrom',0);

        var extrudeSettingsChasisLargo = {steps: 100,bevelEnabled: false,extrudePath: pathChasisLargo};
        var extrudeSettingspieza1 = {steps: 100,bevelEnabled: false,extrudePath: pathpieza1};

        var chasisLargoGeom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingsChasisLargo);
        var pieza1geom = new THREE.ExtrudeGeometry(this.circleShape, extrudeSettingspieza1);

        chasisLargoGeom.rotateY(THREE.MathUtils.degToRad(-90));
        this.chasisLargo1 = new THREE.Mesh(chasisLargoGeom, this.metalGris);
        this.chasisLargo1.position.set(0,0.1,0);
        pieza1geom.rotateY(THREE.MathUtils.degToRad(-90));
        this.chasispieza1 = new THREE.Mesh(pieza1geom, this.metalGris);
        
        this.chasisLargo1.add(this.chasispieza1);
        this.chasisLargo1.add(this.chasispieza2);
        this.chasisLargo1.add(this.chasispieza3);
        this.chasisLargo1.add(this.chasispieza4);
        this.chasisLargo1.add(this.chasispieza5);

        this.chasisLargo2 = this.chasisLargo1.clone();
        this.chasisLargo2.scale.z *= -1;

        this.base.add(this.chasispieza6);
        this.base.add(this.chasispieza7);
        this.base.add(this.chasispieza8);
        this.base.add(this.chasispieza9);
        this.base.add(this.chasispieza10);
        this.base.add(this.chasispieza11);
        this.base.add(this.chasispieza12);
        this.base.add(this.chasisLargo1);
        this.base.add(this.chasisLargo2);
    }

	update() {
        this.motor.update()
        this.minigun.update()
    }
    
} export { Coche };
