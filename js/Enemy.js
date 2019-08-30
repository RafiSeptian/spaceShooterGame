class Enemy {
     constructor(x, y, w, h) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;

          this.enemyB = [];
     }

     draw() {
          this.x -= 3;

          if (this.x <= cw - 300) {
               this.x = cw - 300;

               this.y += 2;

               if (this.y >= ch - this.h) {
                    this.y = ch - this.h
                    this.y -= ch;
                    console.log(this.y);
               }

               this.enemyB.forEach((bull) => {
                    bull.enemyBullet();
               });
          }

          pen.drawImage(media.enemy, this.x, this.y, this.w, this.h);

     }

     shoot() {
          this.enemyB.push(new Bullet(this.x, this.y + this.h / 2 - 10, 30, 30));
          setTimeout(() => {
               this.shoot();
          }, 1000);
     }
}