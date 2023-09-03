const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const speed = 1;
const you = "MedievalKingPack" //samuraiMack  MedievalKingPack
const him = "kenji"

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc : './img/background.png'
})

const shop = new Sprite({
    position: {
        x:600,
        y:128
    },
    imageSrc : './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

    const player = new Fighter({
        position: {
            x: 50,
            y: 0
        },
        velocity: {
            x: 0,
            y: 2
        },
        offset: {
            x: 0,
            y: 0
        },
        imageSrc : './img/'+you+'/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x : 215,
            y: 157 //115
        },
        sprites: {
            idle: {
                imageSrc : './img/'+you+'/Idle.png',
                framesMax: 8
            },
            run: {
                imageSrc : './img/'+you+'/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc : './img/'+you+'/Jump.png',
                framesMax: 2
            },
            fall: {
                imageSrc : './img/'+you+'/Fall.png',
                framesMax: 2
            },
            attack1: {
                imageSrc : './img/'+you+'/Attack1.png',
                framesMax: 6 //4
            },
            takeHit: {
                imageSrc : './img/'+you+'/Take Hit - white silhouette.png',
                framesMax: 4 
            },
            death: {
                imageSrc : './img/'+you+'/Death.png',
                framesMax: 6 
            }
        },
        attackBox:{
            offset: {
                x: 100,
                y: 50
            }, 
            width: 160,
            height: 50
        }
    
    });
if (you === 'MedievalKingPack'){
    player.offset = {
        x : 215,
        y: 115 //157 //115
    }
    player.sprites.attack1.imageSrc = './img/'+you+'/Attack2.png'
    player.sprites.attack1.framesMax = 4

}


const enemy = new Fighter({
    position: {
        x: 900,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc : './img/'+him+'/Idle.png',
        framesMax: 4,
        scale: 2.5,
        offset: {
            x : 215,
            y: 169 //115
        },
        sprites: {
            idle: {
                imageSrc : './img/'+him+'/Idle.png',
                framesMax: 4
            },
            run: {
                imageSrc : './img/'+him+'/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc : './img/'+him+'/Jump.png',
                framesMax: 2
            },
            fall: {
                imageSrc : './img/'+him+'/Fall.png',
                framesMax: 2
            },
            attack1: {
                imageSrc : './img/'+him+'/Attack1.png',
                framesMax: 4 
            },
            takeHit: {
                imageSrc : './img/'+him+'/Take hit.png',
                framesMax: 3 
            },
            death: {
                imageSrc : './img/'+him+'/Death.png',
                framesMax: 7 
            }
        },
        attackBox:{
            offset: {
                x: -170,
                y: 50
            }, 
            width: 170,
            height: 50
        }
});


// console.log(player);

const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}



decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update()
    player.update();
    enemy.update();
    
    //player movement

    player.velocity.x = 0;
   
    if(keys.q.pressed && player.lastKey ==='q') {
        player.velocity.x = -5*speed;
        player.switchSprite('run') 
    } else if (keys.d.pressed && player.lastKey ==='d') {
        player.velocity.x = 5*speed;
        player.switchSprite('run') 
    }else{
        player.switchSprite('idle') 
    }

    //player jump
    if(player.velocity.y < 0){
        player.switchSprite('jump') 
    }else if (player.velocity.y > 0){
        player.switchSprite('fall') 
    }
   
    //enemy movement
    enemy.velocity.x = 0;

    if(keys.ArrowLeft.pressed && enemy.lastKey ==='ArrowLeft') {
        enemy.velocity.x = -5*speed;
        enemy.switchSprite('run') 
    } else if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight') {
        enemy.velocity.x = 5*speed;
        enemy.switchSprite('run') 
    }else{
        enemy.switchSprite('idle') 
    }

     //enemy jump
     if(enemy.velocity.y < 0){
        enemy.switchSprite('jump') 
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall') 
    }

    // detect collision

    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.framesCurrent === 4 //2 //4
    ){
        enemy.takeHit()
        player.isAttacking = false;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    }

    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking  && enemy.framesCurrent === 2
    ){
        player.takeHit()
        enemy.isAttacking = false;
        document.querySelector('#playerHealth').style.width = player.health + '%';    
    }

     //if enemy misses
     if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <=0 ){
        determineWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (e) => {
    // console.log(e.key);
    if(!player.dead){
        switch (e.key) { //.toLowerCase()
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'q':
                keys.q.pressed = true;
                player.lastKey = 'q';
                break;
            case 'z':
                player.velocity.y = -18;
                break;
            case ' ':
                player.attack();
                break;
        }
    }

    if(!enemy.dead){
        switch (e.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -18;
                break;
             case '5':
                enemy.attack();
                break;
        }
    }
});

window.addEventListener('keyup', (e) => {
    //player keys
    
    switch (e.key.toLowerCase()) {
        case 'd':
            keys.d.pressed = false;
            // player.lastKey = 'd';
            break;
        case 'q':
            keys.q.pressed = false;
            // player.lastKey = 'q';
            break;
    }

    //enemy keys

    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});
