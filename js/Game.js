class Game {
     constructor() {
          this.state = 'intro';
          this.bg = {
               x: 0,
               y: 0,
               w: 1920,
               h: 600
          }

          this.plane = null;
          this.enemy = null;
          this.asteroids = [];
          this.bullets = [];
          this.powerUps = [];

          this.point = 0;
          this.life = 5;
          this.hC = 0;
     }

     animate(callback) {
          window.requestAnimationFrame(callback);
     }

     run() {

          this.start();

          // menjalankan audio
          this.playAudio();
     }

     generate() {
          this.plane = new Plane(10, 300 - 50, 100, 100);

          this.enemy = new Enemy(cw, 300 - 50, 100, 100);

          setTimeout(() => {
               this.enemy.shoot();
          }, 1200);

          // generate 
          this.generatePowerUp();
          this.generateAsteroid();


          // this.generateBullet();

     }
     // generateBullet() {
     //      this.bullets.push(new Bullet(110, 295, 10, 10));
     //      setTimeout(() => {
     //           this.generateBullet();
     //      }, 500);

     // }

     generatePowerUp() {
          let randomX = Math.abs(Math.floor(Math.random() * cw));

          if (randomX < this.plane.w + 20) {
               randomX = this.plane.w * 2;
          }

          this.powerUps.push(new PowerUp(randomX, 1, 30, 30));

          setTimeout(() => {
               this.generatePowerUp()
          }, 9000);
     }

     generateAsteroid() {
          let randomY = Math.abs(Math.floor(Math.random() * ch));

          this.asteroids.push(new Asteroid(cw, randomY, 50, 50));

          setTimeout(() => {
               this.generateAsteroid()
          }, 1000);

     }

     start() {
          this.animate(() => this.start());

          // menghapus dokumen
          pen.clearRect(0, 0, cw, ch);

          this.draw();
          this.update();
     }

     draw() {
          if (this.state === 'intro') {
               this.drawBackground();
               this.drawHC();
               this.drawBtnStart();
               // gambar objek statis
               // pen.drawImage(media.plane, 40, ch / 2 - 50, 100, 100);
          } else if (this.state !== 'intro') {
               this.drawBackground();
               this.powerUps.forEach((power) => {
                    power.draw();
               })
               this.enemy.draw();
               this.plane.draw();
               this.asteroids.forEach((asteroid) => {
                    asteroid.draw();
               });
               this.bullets.forEach((bullet) => {
                    bullet.draw();
               });
               this.drawHUT();



               // gambar objek statis
               // pen.drawImage(media.plane, 40, ch / 2 - 50, 100, 100);
          }
     }

     drawHC() {
          pen.beginPath();
          pen.fillStyle = '#ffffff';
          pen.font = '24px KenVector Future';
          pen.textAlign = 'center';
          pen.textBaseline = 'middle';
          pen.fillText('HighScore: ' + localStorage.getItem('hc'), cw / 2, ch / 4);
     }

     drawBtnStart() {
          pen.beginPath();

          pen.strokeStyle = '#ffffff';
          pen.rect(cw / 2 - 250 / 2, ch / 2 - 25, 250, 50);
          pen.stroke();

          pen.fillStyle = '#ffffff';
          pen.font = '24px KenVector Future';
          pen.textAlign = 'center';
          pen.textBaseline = 'middle';
          pen.fillText('Start Game', cw / 2, ch / 2);
     };

     drawHUT() {
          // text
          pen.fillStyle = '#FFFFFF';
          pen.font = "24px KenVector Future";
          pen.textBaseline = 'middle';
          pen.textAlign = 'left';
          pen.fillText('Point:' + this.point, 20, 20);

          //nyawa
          pen.fillStyle = '#FFFFFF';
          pen.font = "24px KenVector Future";
          pen.textBaseline = 'middle';
          pen.textAlign = 'right';
          pen.fillText('Nyawa:' + this.life, cw - 20, 20);
     }

     drawBackground() {

          this.bg.x -= 5;

          if (this.bg.x + this.bg.w <= cw) {
               this.bg.x = 0;
          }
          pen.drawImage(media.bg, this.bg.x, this.bg.y, this.bg.w, this.bg.h);
     }

     update() {

          if (this.plane !== null) {
               this.plane.bullets.forEach((bullet, i) => {
                    this.asteroids.forEach((asteroid, i2) => {

                         this.collide(bullet, asteroid, () => {
                              this.plane.bullets.splice(i, 1);
                              this.asteroids.splice(i2, 1);
                              this.point += 15;
                         });

                    })
               });

               // bullet meet powerup
               this.plane.bullets.forEach((bullet, i) => {
                    this.powerUps.forEach((power, i2) => {
                         this.collide(bullet, power, () => {
                              this.plane.bullets.splice(i, 1);
                              this.powerUps.splice(i2, 1);

                              if (this.life === 5) {
                                   this.life = 5;
                              } else if (this.life < 5) {
                                   this.life += 1;
                              }
                         })
                    })
               });

               // enemybullet meet plane
               this.enemy.enemyB.forEach((bullet, i) => {
                    this.collide(bullet, this.plane, () => {
                         this.enemy.enemyB.splice(i, 1);
                         this.life -= 1;

                         if (this.life === 0) {
                              this.gameOver();
                              this.resetProp();
                              this.state = 'intro';
                         }
                    })
               })
          }

          if (this.enemy !== null) {
               this.plane.bullets.forEach((bullet, i) => {
                    this.enemy.enemyB.forEach((bullet2, i2) => {

                         this.collide(bullet, bullet2, () => {
                              this.plane.bullets.splice(i, 1);
                              this.enemy.enemyB.splice(i2, 1);
                         });

                    })
               })
          }

          // plane ketemu asteroid
          this.asteroids.forEach((asteroid, i) => {
               this.collide(this.plane, asteroid, () => {
                    this.life -= 1;
                    this.asteroids.splice(i, 1);

                    if (this.life == 0) {
                         this.gameOver();
                    }
               });
          });

     }

     gameOver() {
          if (this.point > this.hC) {
               this.hC = this.point;
               localStorage.setItem('hc', this.hC);
          }
          alert('Game Over');
          this.resetProp();
          this.state = 'intro';
     }

     resetProp() {

          this.plane = null;
          this.asteroids = [];

          this.point = 0;
          this.life = 5;
     }

     collide(obj1, obj2, callback) {
          if (
               obj1.x + obj1.w > obj2.x &&
               obj1.x < obj2.x + obj2.w &&
               obj1.y + obj1.h > obj2.y &&
               obj1.y < obj2.y + obj2.h
          ) {
               callback();
          }
     }


     playAudio() {
          try {
               media.bgAudio.play();
          } catch (err) {
               alert(err);
          }
     }

     clicked(x, y) {
          let btn = {
               x: cw / 2 - 250 / 2,
               y: ch / 2 - 25,
               w: 250,
               h: 50
          }
          this.pointerEnter(x, y, btn, () => {
               this.generate();
               this.state = 'gameplay';
          });
     }

     pointerEnter(x, y, obj, callback) {
          if (
               x > obj.x &&
               x < obj.x + obj.w &&
               y > obj.y &&
               y < obj.y + obj.h
          ) {
               callback();
          }
     }

}