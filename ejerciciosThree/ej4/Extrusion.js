import * as THREE from '../libs/three.module.js';
import { Forma2D } from './Forma2D.js'; // Importa la clase Forma2D si no está en el mismo archivo

class Extrusion extends THREE.Object3D {
    constructor(gui, titleGui, points, curva) {
        super();

        // Verificar si se proporcionaron la forma 2D y la curva
        if (!points || !curva) {
            console.error("Se necesitan una forma 2D y una curva para crear la extrusión.");
            return;
        }

        this.gui = gui; // Guardar la referencia a la interfaz de usuario

        var shape = new THREE.Shape(points);
        this.shape = shape; // Guardar la forma como propiedad de la instancia

        this.curva = curva; // Guardar la curva como propiedad de la instancia

        // Crear la geometría extruida a partir de la forma 2D y la curva

        var extrudeSettings = {
            steps: 3, // Cambiar el número de pasos predeterminado a 5
            bevelEnabled: true, // Con bisel de forma predeterminada
            extrudePath: new THREE.CatmullRomCurve3(curva)
        };
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.geometry = geometry; // Guardar la geometría como propiedad de la instancia

        // Crear un material
        var material = new THREE.MeshNormalMaterial({ color: 0xFF0000 });

        // Crear un Mesh utilizando la geometría y el material
        this.mesh = new THREE.Mesh(geometry, material);

        // Añadir el Mesh como hijo de este Object3D
        this.add(this.mesh);

        // Agregar controles de interfaz de usuario
        this.createGUI(gui, titleGui);
    }


    createGUI(gui, titleGui) {
        this.guiControls = {
            pasos: 3, 
            bisel: true, 
            // Función para resetear los controles
            reset: () => {
              this.guiControls.pasos = 3;
              this.guiControls.bisel = true;
              this.updateGeometry();
            }
          };
        
        var folder = gui.addFolder(titleGui);
    
        folder.add(this.guiControls, 'pasos', 3, 100, 1).name('Nº de pasos: ').listen();
    
        folder.add(this.guiControls, 'bisel').name('Bisel').onChange(() => {
            
            this.guiControls.bisel =! !this.guiControls.bisel;
            this.updateGeometry();
        });
    
        // Añadir botón de reset
        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }
    
    updateGeometry() {
        // Actualizar la geometría del mesh
        this.geometry.dispose(); // Limpiamos la geometría anterior

        var extrudeSettings = {
            steps : this.guiControls.pasos,
            bevelEnabled : this.guiControls.bisel,
            extrudePath: new THREE.CatmullRomCurve3(this.curva)
        };

        var geometry = new THREE.ExtrudeGeometry(this.shape, extrudeSettings);
        // Actualizamos la geometría del Mesh
        this.mesh.geometry = geometry;
      }

    update() {
        this.position.set(1, 1, 0);
        this.updateGeometry();
    }
}

export { Extrusion };
