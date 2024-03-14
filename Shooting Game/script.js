const introMusic = new Audio("./Music/introSong.mp3");
const shootingSound = new Audio("./Music/shoooting.mp3");
const killEnemySound = new Audio("./Music/killEnemy.mp3");
const gameOverSound = new Audio("./Music/gameOver.mp3");
const heavyWeaponSound = new Audio("./Music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./Music/hugeWeapon.mp3");

const musicCheckbox = document.querySelector(".music input[type='checkbox']");

function toggleIntroMusic() {
      if (musicCheckbox.checked) {
          introMusic.play();
      } else {
          introMusic.pause();
      }
  }

toggleIntroMusic();
musicCheckbox.addEventListener("change", toggleIntroMusic);

// introMusic.play();

const canvas = document.createElement("canvas");
let gameStarted = false;

document.querySelector(".mygame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
let difficulty = 2;
const HugeWeaponDamage = 50;

const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let playerScore = 0;

document.querySelector("input").addEventListener("click",(e)=>{
      e.preventDefault();
      //stop intro music
      introMusic.pause();
      gameStarted = true;
      form.style.display = "none";
      scoreBoard.style.display = "block";

      const userValue = document.getElementById("difficulty").value;

      // alert(userValue);
      if(userValue === "Easy"){
            setInterval(spawnEnemy,2000);
            return (difficulty = 3);
      }
      if(userValue === "Medium"){
            setInterval(spawnEnemy,1400);
            return (difficulty = 7);
      }
      if(userValue === "Hard"){
            setInterval(spawnEnemy,1000);
            return (difficulty = 10);
      }
      if(userValue === "Insane"){
            setInterval(spawnEnemy,700);
            return (difficulty = 13);
      }

})
// Game over end screen 
const gameOverLoader = () =>{
      const gameOverBanner = document.createElement("div");
      const gameOverBtn = document.createElement("button");
      const highScore = document.createElement("div");

      highScore.innerHTML = `High Score : ${
            localStorage.getItem("highScore")? localStorage.getItem("highScore"): playerScore
      }`;

      const oldHighScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");

      if(oldHighScore<playerScore){
            localStorage.setItem("highScore",playerScore);

            //update high score
            highScore.innerHTML = `High Score : ${playerScore}`;
      }


      gameOverBtn.innerText = "Play Again";
      gameOverBanner.appendChild(highScore);
      gameOverBanner.appendChild(gameOverBtn);

      gameOverBtn.onclick = ()=>{
            window.location.reload();
      }
      gameOverBanner.classList.add("gameover");
      document.querySelector("body").appendChild(gameOverBanner);
}


//----------------------
playerPosition = {
      x: canvas.width/2,
      y: canvas.height/2,
};

// player ----------------------------------
class Player{
      constructor(x,y,radius,color){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
      }

      draw(){
            context.beginPath();
     context.arc(
      this.x, 
      this.y, 
      this.radius, 
      (Math.PI / 180) * 0,
      (Math.PI / 180 )* 360,
       false);
       context.fillStyle=this.color;
       
      context.fill();
      }

      update(){
            this.x += Math.random()*100
            this.y += Math.random()*100
      }

}


// weapon attack -------------------------
class Weapon{
      constructor(x,y,radius,color,veclocity,damage){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.veclocity = veclocity;
            this.damage = damage;
      }

      draw(){
            context.beginPath();
       context.arc(
      this.x, 
      this.y, 
      this.radius, 
      (Math.PI / 180) * 0,
      (Math.PI / 180 )* 360,
       false);
       context.fillStyle=this.color;
       
      context.fill();
      }

      update(){
            this.draw();
            (this.x += this.veclocity.x);
            (this.y += this.veclocity.y);
      }

}

//------------------------------------

// Hugeweapon attack -------------------------
class HugeWeapon{
      constructor(x,y,color){
            this.x = x;
            this.y = y;
            this.color = color;
            
      }

      draw(){
            context.beginPath();
            context.fillStyle=this.color;
       context.fillRect(this.x,this.y,200,canvas.height);
       
       
      // context.fill();
      }

      update(){
            this.draw();
            (this.x += 20); 
      }

}

//------------------------------------

// Enemy attack -------------------------
class Enemy{
      constructor(x,y,radius,color,veclocity){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.veclocity = veclocity;
      }

      draw(){
            context.beginPath();
       context.arc(
      this.x, 
      this.y, 
      this.radius, 
      (Math.PI / 180) * 0,
      (Math.PI / 180 )* 360,
       false);
       context.fillStyle=this.color;
       
      context.fill();
      }

      update(){
            this.draw();
            (this.x += this.veclocity.x),
            (this.y += this.veclocity.y);
      }

}

// Creating particle class -------------------------
const friction = 0.99;
class Particle{
      constructor(x,y,radius,color,veclocity){
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.veclocity = veclocity;
            this.alpha = 1;
      }

      draw(){
            context.save();
            context.globalAlpha = this.alpha;
            context.beginPath();
       context.arc(
      this.x, 
      this.y, 
      this.radius, 
      (Math.PI / 180) * 0,
      (Math.PI / 180 )* 360,
       false);
       context.fillStyle=this.color;
       
      context.fill();
      context.restore();
      }

      update(){

            this.draw();
            this.veclocity.x *= friction;
            this.veclocity.y *= friction;
            (this.x += this.veclocity.x),
            (this.y += this.veclocity.y);
            this.alpha -= 0.01;
      }

}
//-------------------------------------


//-------------------------------------

const abhi = new Player(
      playerPosition.x,
      playerPosition.y,
      15,
      "white"
      );


const weapons = [];
const enemies = [];
const particles = [];
const hugeWeapons = [];

const spawnEnemy = ()=>{
      const enemySize = Math.random()*(40-5)+5;
      const enemyColor = `hsl(${Math.floor(Math.random()* 360)},100%,50%)`;

      if(Math.random() < 0.5){
            random = {
                  x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
                  y: Math.random()*canvas.height,
            }
      }else{
            random = {
                  x: Math.random()*canvas.width,
                  y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
                 
            }
      }

      const myangle = Math.atan2(
            canvas.height/2-random.y,
            canvas.width/2 - random.x
      );
      const velocity = {
            x: Math.cos(myangle)*difficulty,
            y: Math.sin(myangle)*difficulty,
      };


      enemies.push(new Enemy(random.x,random.y,enemySize,enemyColor,velocity));

}

let animationId;
function animation(){
     animationId = requestAnimationFrame(animation);
      // console.log(Math.random());
      scoreBoard.innerHTML = `Score : ${playerScore}`;
       
      context.fillStyle = "rgb(49,49,49,0.18)"
      context.fillRect(0,0,canvas.width,canvas.height);



      abhi.draw();
      // abhi.update();


    //Particle updates
     particles.forEach((particle,particleIndex)=>{
      if(particle.alpha <= 0){
            particles.splice(particleIndex,1);
      }else{
            particle.update();
      }

      
     })

     // generating huge weapons
     hugeWeapons.forEach((hugeWeapon,hugeWeaponIndex)=>{
      if(hugeWeapon.x > canvas.width){
            hugeWeapons.splice(hugeWeaponIndex,1);
      }else{
            hugeWeapon.update();
      }
      
     })

      //generating bullets
      weapons.forEach((weapon,weaponIndex)=>{
            // item.draw();
            weapon.update();

            if(
                  weapon.x + weapon.radius < 1 || weapon.y + weapon.radius < 1 ||
                  weapon.x - weapon.radius > canvas.width || weapon.y - weapon.radius > canvas.height
            ){
                  weapons.splice(weaponIndex,1);
            }

      });

      //--generating enemies-----
      enemies.forEach((enemy,enemyIndex)=>{
            // item.draw();
            enemy.update();

            const distanceBetweenPlayerAndEnemy = Math.hypot(
                  abhi.x - enemy.x,
                  abhi.y - enemy.y
            );

            if(distanceBetweenPlayerAndEnemy - abhi.radius - enemy.radius < 1){
                  cancelAnimationFrame(animationId);
                  gameOverSound.play();
                  hugeWeaponSound.pause();
                  shootingSound.pause();
                  heavyWeaponSound.pause();
                  killEnemySound.pause();
                  return gameOverLoader();
            }

            //huge weapon location
            hugeWeapons.forEach((hugeWeapon)=>{
                  const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.x - enemy.x;
                  if(distanceBetweenHugeWeaponAndEnemy<=200 && distanceBetweenHugeWeaponAndEnemy>= -200){
                        //player score add
                        playerScore += 10;
                 setTimeout(()=>{
                  killEnemySound.play();
                  enemies.splice(enemyIndex,1);
                 },0)
                  }
            })

            weapons.forEach((weapon,weaponIndex)=>{
             const distanceBetweenWeaponAndEnemy = Math.hypot(
                  weapon.x - enemy.x,
                  weapon.y - enemy.y
             );

             if(distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1){
            
                  // console.log("enemy kill")
                if(enemy.radius > weapon.damage + 8){
                  gsap.to(enemy,{
                        radius: enemy.radius - weapon.damage,
                  })

                 setTimeout(()=>{
                  weapons.splice(weaponIndex,1);
                 },0)

                }else{

                  for (let index = 0; index < enemy.radius *2; index++) {
                        particles.push(new Particle(
                         weapon.x,
                         weapon.y,
                         Math.random()*2,
                         enemy.color,
                         {x:(Math.random() - 0.5 )* (Math.random()*5), y: (Math.random() - 0.5 )* (Math.random()*5)}     
                        ))
                        
                  }

                  //player score add
                  playerScore += 10;

                  // rendering scoreboard and update score
                  scoreBoard.innerHTML = `Score : ${playerScore}`;

                  

                  setTimeout(()=>{
                        killEnemySound.play();
                        enemies.splice(enemyIndex,1);
                        weapons.splice(weaponIndex,1);
                  },0)
                }
             }


            })
      });


}

// console.log(gsap);
// setInterval(spawnEnemy,100);


canvas.addEventListener('click', (e)=>{
      // console.log(e.clientX,e.clientY);
      // console.log("click");
      if(gameStarted){
            shootingSound.play();

      const myangle = Math.atan2(e.clientY - canvas.height/2, e.clientX - canvas.width/2);

      const velocity = {
            x: Math.cos(myangle)*6,
            y: Math.sin(myangle)*6,
      }; 
      // console.log(myangle);

      weapons.push(
           new Weapon(
            canvas.width/2,
            canvas.height/2,
            6,
            "white",
            velocity,
            lightWeaponDamage
           )

      )
      }
})





//heavy weapon -- take a right click
canvas.addEventListener("contextmenu", (e)=>{
      // console.log(e.clientX,e.clientY);
      e.preventDefault();

      // console.log("right click work");
      if(playerScore<=0){
            return;
      }
      heavyWeaponSound.play();
      //decreasing player score use huge weapon
      playerScore -= 2;
      scoreBoard.innerHTML = `Score : ${playerScore}`;
     

      const myangle = Math.atan2(e.clientY - canvas.height/2, e.clientX - canvas.width/2);

      const velocity = {
            x: Math.cos(myangle)*3,
            y: Math.sin(myangle)*3,
      };
      // console.log(myangle);

      weapons.push(
           new Weapon(
            canvas.width/2,
            canvas.height/2,
            30,
            "cyan",
            velocity,
            heavyWeaponDamage
           )

      )
})


addEventListener("keypress",(e)=>{
    if(e.key === " "){


      if(playerScore<=20){
            return;
      }
      //decreasing player score use huge weapon
      playerScore -= 20;
      scoreBoard.innerHTML = `Score : ${playerScore}`;
      hugeWeaponSound.play();
      hugeWeapons.push(
            new HugeWeapon(
             0,
             0,
             `hsl(${Math.floor(Math.random()* 360)},100%,50%)`
            )
 
       )
    }
})
addEventListener("contextmenu",(e)=>{
      e.preventDefault();
})

addEventListener("resize",()=>{
      // canvas.width = innerWidth;
      // canvas.height = innerHeight;

      window.location.reload();
})

animation();

