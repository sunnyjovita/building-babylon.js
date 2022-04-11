// <reference path="/scripts/babylon.js" />

var engine;
var canvas;
var scene;

document.addEventListener("DOMContentLoaded", startGame, false);
function startGame() {
  if (BABYLON.Engine.isSupported()) {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);

    BABYLON.SceneLoader.Load(
      "./assets/building/",
      "building.babylon",
      engine,
      function (newScene) {
        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function () {
          var joystickCamera = new BABYLON.VirtualJoysticksCamera(
            "VJC",
            newScene.activeCamera.position,
            newScene
          );
          // joystickCamera.rotation = newScene.activeCamera.rotation;
          joystickCamera.inertia = 0;
          joystickCamera.inputs.attached.virtualJoystick.camera.inertia = 0;
          // console.log(
          //   joystickCamera.inputs.attached.virtualJoystick.getRightJoystick()
          // );
          joystickCamera.checkCollisions = newScene.activeCamera.checkCollisions;
          joystickCamera.applyGravity = newScene.activeCamera.applyGravity;
          joystickCamera.eliipsoid = newScene.activeCamera.ellipsoid;
          newScene.activeCamera = joystickCamera;

          // Attach camera to canvas inputs
          newScene.activeCamera.attachControl(canvas);

          var onVJCready = function () {
            // console.log(joystickCamera.inputs.attached.virtualJoystick.getRightJoystick());
            // joystickCamera.inputs.attached.virtualJoystick.detachControl();
            // console.log("released");
          };

          setTimeout(onVJCready, 10);

          newScene.enablePhysics(
            new BABYLON.Vector3(0, -10, 0),
            new BABYLON.OimoJSPlugin()
          );
          CreateMaterials();
          addListeners();

          // var camera = new BABYLON.ArcRotateCamera(
          //   "Camera",
          //   -Math.PI / 2,
          //   1.1,
          //   90,
          //   BABYLON.Vector3.Zero(),
          //   newScene
          // );
          // camera.attachControl(canvas, true);
          function CreateMaterials() {
            materialAmiga = new BABYLON.StandardMaterial("amiga", newScene);
            materialAmiga.diffuseTexture = new BABYLON.Texture(
              "assets2/red_and_black.jpg",
              newScene
            );
            materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            materialAmiga.diffuseTexture.uScale = 5;
            materialAmiga.diffuseTexture.vScale = 5;
          }

          function addListeners() {
            window.addEventListener("keydown", function (evt) {
              // s for shapes
              if (evt.keyCode == 83) {
                var index = 30;

                // checkpoint1 torus knot
                var sphere = BABYLON.MeshBuilder.CreateTorusKnot(
                  "tk",
                  {},
                  scene
                );
                sphere.scaling.y = 0.09;
                sphere.scaling.x = 0.09;
                sphere.scaling.z = 0.09;
                // var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 10, 0.5, newScene);
                sphere.material = materialAmiga;
                sphere.position = new BABYLON.Vector3(-5.5, 1, 11.7);
                // sphere.position = new BABYLON.Vector3(3,1,8);

                var alpha = 0;

                // higher y makin ke atas
                // z makin kecil makin kanan
                // x makin kecil makin ke belakang

                // checkpoint 2 torus
                var sphere2 = BABYLON.Mesh.CreateTorus(
                  "torus",
                  5,
                  1,
                  10,
                  scene,
                  false
                );
                sphere2.scaling.y = 0.09;
                sphere2.scaling.x = 0.09;
                sphere2.scaling.z = 0.09;
                sphere2.rotation.x = 1.5;
                sphere2.material = materialAmiga;
                sphere2.position = new BABYLON.Vector3(-5.5, 4, 11.7);
                // sphere2.position = new BABYLON.Vector3(3,5,8);

                // checkpoint 3

                var sphere3 = BABYLON.MeshBuilder.CreateBox(
                  "box",
                  { size: 0.5 },
                  newScene
                );
                sphere3.material = materialAmiga;
                // sphere3.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/2004_satellite_picture_of_Istanbul_and_the_Bosphorus.jpg/640px-2004_satellite_picture_of_Istanbul_and_the_Bosphorus.jpg", scene);

                // sphere3.diffuseTexture = new BABYLON.Texture("textures/grass.png", newScene);
                sphere3.position = new BABYLON.Vector3(-11, 1, 6);
                // sphere3.position = new BABYLON.Vector3(3,5,6);

                newScene.beforeRender = function () {
                  sphere2.rotation.y = alpha;
                  sphere.rotation.y = alpha;
                  sphere3.rotation.y = alpha;

                  alpha += 0.03;
                };
              }
            });
          }

          // Once the scene is loaded, just register a render loop to render it
          engine.runRenderLoop(function () {
            newScene.render();
          });
        });
      },
      function (progress) {
        // To do: give progress feedback to user
      }
    );
  }
}
