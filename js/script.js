window.onload = init();

function init() {

     setCanvas();
     setMedia();

     game = new Game();

     game.run();

}

function setCanvas() {
     canvas = document.getElementById('canvas');

     cw = canvas.width = 960;
     ch = canvas.height = 600;

     pen = canvas.getContext('2d');

}

function setMedia() {
     media = {};

     media.plane = new Image();
     media.plane.src = 'PNG/plane.png';

     media.bgAudio = new Audio();
     media.bgAudio.src = 'Bonus/sfx_laser1.ogg';

     media.bg = new Image();
     media.bg.src = 'PNG/background.png';

     media.asteroid = new Image();
     media.asteroid.src = 'PNG/asteroid.png';

     media.bullet = new Image();
     media.bullet.src = 'PNG/bullet.png';

     media.enemy = new Image();
     media.enemy.src = 'PNG/enemyRed1.png'

     media.powerup = new Image();
     media.powerup.src = 'PNG/powerup.png';

}

// event
window.addEventListener('keydown', function (e) {
     let key = e.keyCode;

     if (e.keyCode === 38) {
          game.plane.moving = true;
          game.plane.moveUp();
     } else if (e.keyCode === 40) {
          game.plane.moving = true;
          game.plane.moveDown();
     }

     if (e.keyCode === 32) {
          game.plane.shoot();
          game.playAudio();
     }
});

window.addEventListener('keyup', function (e) {
     game.plane.moving = false;
})

canvas.addEventListener('click', function (e) {
     let rect = canvas.getBoundingClientRect();

     let x = e.clientX - rect.left;
     let y = e.clientY - rect.top;

     game.clicked(x, y);
});