//hello world!
import './style.css';

const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 700;

let audioCtx = null;

function initAudio()
 {
    if (!audioCtx)
         {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playCrunchSound() 
{
     if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(150, audioCtx.currentTime);

    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
}


function
    playerheartbeatSound(rate)
    {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        audio.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(60, audioCtx.currentTime);
        
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
    
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);


    } 

    let gameState ='Start';
    start, playing, gameover;

    let score = 0;
    let heartbeatInterval = null;

    const maw = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        baseWidth: 60,
        baseHeight: 60,
        width: 60,
        height: 50,
        speed: 4,
        vx: 0,
        vy: 0,
        health: 100,
        maxHealth: 100,
        tentacles: [],

        squishX: 1,
        squishY: 1,
        targetSquishX: 1,
        targetSquishY: 1,
        
        mouthOpen: 0,
        eyeOpen: 0,
        
    }

    const slimeTrails = [];

    const humans = [];
    const rovers = [];
    const tanks = [];

    const bloodSplatters = [];

    const particles = [];

    const keys = {
        w: false,
        a: false,
        s: false,
        d: false,
    };

    document.addEventListener('keydown', (e) => {

        if (keys.hasOwnProperty(e.key)) 
        {
            keys[e.key] = true;
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) 
        {
            keys[e.key] = false;

        }
    });
    canvas.addEventListener('click', (e) => {
        if (gameState !== 'playing ') 
            return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const angle = Math.atan2(mouseY - maw.y, mouseX - maw.x);
        maw.tentacles.push({
            x: maw.x,
            y: maw.y,
            targetX: mouseX,
            targetY: mouseY,
            angle: angle,
            length: 0,
            maxLength: Math.hypot(mouseX - maw.x, mouseY - maw.y),
            extending: true,
            retracting: false,
            grabbed: null,
            speed: 15,

        });
    });

    class SlimeTrail {
        constructor(x, y)
         {
            this.x = x;
            this.y = y;
            this.radius = 25 +
                Math.random() * 15;
            this.life = 6*60; 
            seconds at 60 fps
            this.maxLife = this.life;
            this.bubbleoffset = Math.random() * Math.PI * 2;;

        }

        update() {
            this.life--;
            return this.life > 0;
        }

        draw () {
            const alpha = this.life / this.maxLife;
            const bubbleTime = Date.now() / 500 + this.bubbleoffset;

            ctx.save();
            ctx.globalAlpha = alpha * 07;

            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius*1.5);
            gradient.addColorStop(0, 'rgba(138,43,226, 0.8)');
            gradient.addColorStop(1, 'rgba(75,130, 0.5)');
            gradient.addColorStop(1, 'rgba(25,0,50,0');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius *1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(100, 20, 150, ${alpha})';
            ctx.beginPath();
            ctx.arc(this.x + Math.sin(bubbleTime) * 5, this.y + Math.cos(bubbleTime) * 5, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();


             ctx.fillStyle = `rgba(100, 20, 150, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bubbles

    for (let i = 0; i < 3; i++) {
      const bubbleX = this.x + Math.cos(bubbleTime + i * 2) * this.radius * 0.5;
      const bubbleY = this.y + Math.sin(bubbleTime * 1.3 + i) * this.radius * 0.3;
      const bubbleSize = 4 + Math.sin(bubbleTime * 2 + i) * 2;

      ctx.fillStyle = `rgba(180, 100, 255, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Human class
class Human
 {
  constructor(x, y)
   {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 30;
    this.speed = 1.5 + Math.random() * 0.5;
    this.baseSpeed = this.speed;
    this.direction = Math.random() * Math.PI * 2;
    this.fleeing = false;
    this.health = 1;
    this.walkCycle = Math.random() * Math.PI * 2;
    // Astronaut colors
    this.suitColor = `hsl(${200 + Math.random() * 20}, 70%, ${50 + Math.random() * 20}%)`;
  }

  update()
   {
    // Check if on slime
    let onSlime = false;
    for (const slime of slimeTrails)
         {
      if (Math.hypot(this.x - slime.x, this.y - slime.y) < slime.radius) {
        onSlime = true;
        break;
      }
    }

    const speedMult = onSlime ? 0.5 : 1;
    this.speed = this.baseSpeed * speedMult;

    // Check distance to Maw

    const distToMaw = Math.hypot(this.x - maw.x, this.y - maw.y);
    this.fleeing = distToMaw < 200;

    if (this.fleeing) 
        {
      // Run away from Maw
      this.direction = Math.atan2(this.y - maw.y, this.x - maw.x);
    } 
    else
         {
      // Random wandering

      if (Math.random() < 0.02) {
        this.direction += (Math.random() - 0.5) * Math.PI * 0.5;
      }
    }

    // Move

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    // Keep in bounds

    this.x = Math.max(20, Math.min(canvas.width - 20, this.x));
    this.y = Math.max(20, Math.min(canvas.height - 20, this.y));

    // Walking animation
    this.walkCycle += 0.2;
  }

  draw()
   {
    ctx.save();

    // Legs on walking

    const legOffset = Math.sin(this.walkCycle) * 4;
    ctx.fillStyle = '#444';
    ctx.fillRect(this.x - 6, this.y + 5, 4, 15 + legOffset);
    ctx.fillRect(this.x + 2, this.y + 5, 4, 15 - legOffset);

    // Body
    ctx.fillStyle = this.suitColor;
    ctx.fillRect(this.x - 8, this.y - 10, 16, 20);

    // Helmet

    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 15, 10, 0, Math.PI * 2);
    ctx.fill();

    // Visor

    ctx.fillStyle = this.fleeing ? '#ff6666' : '#3366ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 15, 6, 0, Math.PI * 2);
    ctx.fill();

    // Fear indicator

    if (this.fleeing) {
      ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 30, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Rover class
class Rover
 {
  constructor(x, y) 
  {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.speed = 2;
    this.direction = Math.random() * Math.PI * 2;
    this.health = 3;
    this.fireRate = 120;
    this.fireTimer = Math.random() * this.fireRate;
    this.reversing = false;
  }

  update()
   {
    const distToMaw = Math.hypot(this.x - maw.x, this.y - maw.y);
    this.reversing = distToMaw < 250;

    if (this.reversing)

         {

      // Reverse away from Maw while firing

      this.direction = Math.atan2(this.y - maw.y, this.x - maw.x);
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;
    } else
         {
      // Patrol randomly
      if (Math.random() < 0.01) {
        this.direction += (Math.random() - 0.5) * Math.PI * 0.3;
      }
      this.x += Math.cos(this.direction) * this.speed * 0.5;
      this.y += Math.sin(this.direction) * this.speed * 0.5;
    }

    // Keep in bounds
    this.x = Math.max(30, Math.min(canvas.width - 30, this.x));
    this.y = Math.max(30, Math.min(canvas.height - 30, this.y));



    // Fire timer
    this.fireTimer--;
    if (this.fireTimer <= 0)
         {
      this.fire();
      this.fireTimer = this.fireRate;
    }

  }

  fire() 
  {
    const angle = Math.atan2(maw.y - this.y, maw.x - this.x);
    bullets.push({
      x: this.x,
      y: this.y,

      vx: Math.cos(angle) * 5,
      vy: Math.sin(angle) * 5,
      damage: 5
    });
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.direction);

    // Wheels
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-12, -12, 8, 0, Math.PI * 2);
    ctx.arc(12, -12, 8, 0, Math.PI * 2);
    ctx.arc(-12, 12, 8, 0, Math.PI * 2);
    ctx.arc(12, 12, 8, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#888';
    ctx.fillRect(-15, -12, 30, 24);

    // Solar panel
    ctx.fillStyle = '#2244aa';
    ctx.fillRect(-10, -18, 20, 6);

    // Gun turret
    ctx.fillStyle = '#555';
    ctx.fillRect(-4, -6, 8, 12);
    ctx.fillRect(-2, -12, 4, 8);

    ctx.restore();

    // Muzzle flash when firing
    if (this.fireTimer > this.fireRate - 10)
         {
      ctx.fillStyle = 'rgba(255, 200, 50, 0.7)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Tank class
class Tank
 {
  constructor(x, y)
   {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 40;
    this.speed = 1.5;
    this.direction = Math.random() * Math.PI * 2;
    this.health = 5;
    this.fireRate = 90;
    this.fireTimer = Math.random() * this.fireRate;
    this.reversing = false;
  }

  update()
   {
    const distToMaw = Math.hypot(this.x - maw.x, this.y - maw.y);
    this.reversing = distToMaw < 300;

    if (this.reversing) {
      this.direction = Math.atan2(this.y - maw.y, this.x - maw.x);
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;
    } else {
      if (Math.random() < 0.008) {
        this.direction += (Math.random() - 0.5) * Math.PI * 0.3;
      }
      this.x += Math.cos(this.direction) * this.speed * 0.3;
      this.y += Math.sin(this.direction) * this.speed * 0.3;
    }

    this.x = Math.max(40, Math.min(canvas.width - 40, this.x));
    this.y = Math.max(40, Math.min(canvas.height - 40, this.y));

    this.fireTimer--;
    if (this.fireTimer <= 0)
         {
      this.fire();
      this.fireTimer = this.fireRate;
    }
  }

  fire() {
    const angle = Math.atan2(maw.y - this.y, maw.x - this.x);
    bullets.push(
        {
      x: this.x,
      y: this.y,
      vx: Math.cos(angle) * 6,
      vy: Math.sin(angle) * 6,
      damage: 10
    });
  }

  draw()
   {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.direction);

    // Tank treads
    ctx.fillStyle = '#444';
    ctx.fillRect(-25, -20, 50, 10);
    ctx.fillRect(-25, 10, 50, 10);

    // Body
    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(-20, -15, 40, 30);

    // Turret
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    // Cannon
    ctx.fillStyle = '#333';
    ctx.fillRect(-4, -25, 8, 20);

    ctx.restore();

    if (this.fireTimer > this.fireRate - 8)
         {
      ctx.fillStyle = 'rgba(255, 150, 50, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Bullets
const bullets = [];

// Blood splatter class
class BloodSplatter
 {
  constructor(x, y)
   {
    this.x = x;
    this.y = y;
    this.particles = [];
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: 3 + Math.random() * 6,
        life: 60 + Math.random() * 60
      });
    }
  }

  update() 
  {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life--;
      p.size *= 0.98;
    }
    this.particles = this.particles.filter(p => p.life > 0);
    return this.particles.length > 0;
  }

  draw() 
  {
    for (const p of this.particles) {
      ctx.fillStyle = `rgba(180, 20, 20, ${p.life / 120})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Spawn enemies
function spawnEnemies() 
{
  // Spawn humans

  if (humans.length < 15 && Math.random() < 0.02) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch(side) {
      case 0: x = Math.random() * canvas.width; y = -30; break;
      case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
      case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
      case 3: x = -30; y = Math.random() * canvas.height; break;
    }
    humans.push(new Human(x, y));
  }

  // Spawn rovers
  if (rovers.length < 3 && Math.random() < 0.005) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch(side) 
    {
      case 0: x = Math.random() * canvas.width; y = -50; break;
      case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
      case 2: x = Math.random() * canvas.width; y = canvas.height + 50; break;
      case 3: x = -50; y = Math.random() * canvas.height; break;
    }
    rovers.push(new Rover(x, y));
  }

  // Spawn tanks
  if (tanks.length < 2 && Math.random() < 0.002)
     {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch(side) 
    {
      case 0: x = Math.random() * canvas.width; y = -50; break;
      case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
      case 2: x = Math.random() * canvas.width; y = canvas.height + 50; break;
      case 3: x = -50; y = Math.random() * canvas.height; break;
    }
    tanks.push(new Tank(x, y));
  }
}

// Update Maw
function updateMaw() {
  // Movement input
  let moveX = 0, moveY = 0;
  if (keys.w || keys.ArrowUp) moveY -= 1;
  if (keys.s || keys.ArrowDown) moveY += 1;
  if (keys.a || keys.ArrowLeft) moveX -= 1;
  if (keys.d || keys.ArrowRight) moveX += 1;

  // Normalize diagonal movement
  const magnitude = Math.hypot(moveX, moveY);
  if (magnitude > 0)
     {
    moveX /= magnitude;
    moveY /= magnitude;
  }

  // Apply velocity with smoothing
  maw.vx = moveX * maw.speed;
  maw.vy = moveY * maw.speed;

  maw.x += maw.vx;
  maw.y += maw.vy;

  // Keep in bounds
  maw.x = Math.max(maw.baseWidth / 2, Math.min(canvas.width - maw.baseWidth / 2, maw.x));
  maw.y = Math.max(maw.baseHeight / 2, Math.min(canvas.height - maw.baseHeight / 2, maw.y));

  // Squish/stretch based on velocity
  const speed = Math.hypot(maw.vx, maw.vy);
  if (speed > 0.1)
     {
    const angle = Math.atan2(maw.vy, maw.vx);
    maw.targetSquishX = 1 + speed * 0.05;
    maw.targetSquishY = 1 - speed * 0.03;

    // Leave slime trail for making choice
    if (Math.random() < 0.3) {
      slimeTrails.push(new SlimeTrail(maw.x, maw.y));
    }
  } else {
    maw.targetSquishX = 1;
    maw.targetSquishY = 1;
  }

  // Smooth squish
  maw.squishX += (maw.targetSquishX - maw.squishX) * 0.2;
  maw.squishY += (maw.targetSquishY - maw.squishY) * 0.2;

  // Mouth animation - open when close to prey
  let closestDist = Infinity;
  for (const human of humans) {
    const dist = Math.hypot(human.x - maw.x, human.y - maw.y);
    if (dist < closestDist) closestDist = dist;
  }
  maw.mouthOpen += ((closestDist < 100 ? 1 : 0) - maw.mouthOpen) * 0.1;

  // Eye glow based on hunting
  maw.eyeGlow += ((closestDist < 150 ? 1 : 0) - maw.eyeGlow) * 0.05;

  // Health decay
  maw.health -= 0.01;
  if (maw.health <= 0) {
    gameOver();
  }

  // Update tentacles
  for (let i = maw.tentacles.length - 1; i >= 0; i--) {
    const tent = maw.tentacles[i];

    if (tent.extending) {
      tent.length += tent.speed;
      tent.x = maw.x + Math.cos(tent.angle) * tent.length;
      tent.y = maw.y + Math.sin(tent.angle) * tent.length;

      // Check collision with enemies
      for (let j = humans.length - 1; j >= 0; j--) {
        if (Math.hypot(tent.x - humans[j].x, tent.y - humans[j].y) < 25) {
          tent.grabbed = { type: 'human', index: j, obj: humans[j] };
          tent.extending = false;
          tent.retracting = true;
          break;
        }
      }

      for (let j = rovers.length - 1; j >= 0; j--) {
        if (Math.hypot(tent.x - rovers[j].x, tent.y - rovers[j].y) < 30) {
          rovers[j].health--;
          if (rovers[j].health <= 0) {
            bloodSplatters.push(new BloodSplatter(rovers[j].x, rovers[j].y));
            rovers.splice(j, 1);
            score += 50;
          }
          tent.extending = false;
          tent.retracting = true;
          break;
        }
      }

      for (let j = tanks.length - 1; j >= 0; j--) {
        if (Math.hypot(tent.x - tanks[j].x, tent.y - tanks[j].y) < 35) {
          tanks[j].health--;
          if (tanks[j].health <= 0) {
            bloodSplatters.push(new BloodSplatter(tanks[j].x, tanks[j].y));
            tanks.splice(j, 1);
            score += 100;
          }
          tent.extending = false;
          tent.retracting = true;
          break;
        }
      }

      if (tent.length >= tent.maxLength) {
        tent.extending = false;
        tent.retracting = true;
      }
    }

    if (tent.retracting) {
      tent.length -= tent.speed * 1.5;
      tent.x = maw.x + Math.cos(tent.angle) * tent.length;
      tent.y = maw.y + Math.sin(tent.angle) * tent.length;

      if (tent.grabbed) {
        tent.grabbed.obj.x = tent.x;
        tent.grabbed.obj.y = tent.y;
      }

      if (tent.length <= 0) {
        if (tent.grabbed) {
          // Eat the captured human
          if (tent.grabbed.type === 'human') {
            const idx = humans.indexOf(tent.grabbed.obj);
            if (idx > -1) {
              bloodSplatters.push(new BloodSplatter(maw.x, maw.y));
              humans.splice(idx, 1);
              maw.health = Math.min(maw.maxHealth, maw.health + 25);
              score += 10;
              playCrunchSound();
            }
          }
        }
        maw.tentacles.splice(i, 1);
      }
    }
  }

  // Proximity gulp - eat humans directly
  for (let i = humans.length - 1; i >= 0; i--) {
    if (Math.hypot(humans[i].x - maw.x, humans[i].y - maw.y) < maw.baseWidth / 2 + 10) {
      bloodSplatters.push(new BloodSplatter(humans[i].x, humans[i].y));
      humans.splice(i, 1);
      maw.health = Math.min(maw.maxHealth, maw.health + 25);
      score += 10;
      playCrunchSound();
    }
  }
}

// Draw the Zombii frog
function drawMaw() {
  ctx.save();
  ctx.translate(maw.x, maw.y);

  // Apply squish transformation
  ctx.scale(maw.squishX, maw.squishY);

  // Glowing effect
  const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maw.baseWidth);
  glowGrad.addColorStop(0, 'rgba(50, 200, 150, 0.3)');
  glowGrad.addColorStop(0.5, 'rgba(30, 100, 80, 0.2)');
  glowGrad.addColorStop(1, 'rgba(0, 50, 40, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, maw.baseWidth, 0, Math.PI * 2);
  ctx.fill();

  // Main body - organic blob shape fill
  const bodyColor = maw.health / maw.maxHealth < 0.35 ? '#204030' : '#2a6b50';
  ctx.fillStyle = bodyColor;

  ctx.beginPath();

  // Organic blob for outline   using noise-like curves
  const time = Date.now() / 1000;
  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const wobble = Math.sin(angle * 3 + time * 2) * 4;
    const r = (maw.baseWidth / 2) + wobble;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r * 0.8;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Darker inner area!
  ctx.fillStyle = '#153025';
  ctx.beginPath();
  ctx.arc(0, 2, maw.baseWidth * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Mouth hohoho
  const mouthWidth = 25 + maw.mouthOpen * 15;
  const mouthHeight = 10 + maw.mouthOpen * 20;

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 5, mouthWidth / 2, mouthHeight / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Teeth hahaha 
  ctx.fillStyle = '#ddd';
  for (let i = 0; i < 6; i++) {
    const tx = -12 + i * 5;
    ctx.beginPath();
    ctx.moveTo(tx, 5 - mouthHeight / 3);
    ctx.lineTo(tx + 3, 5);
    ctx.lineTo(tx, 5 + mouthHeight / 3);
    ctx.closePath();
    ctx.fill();
  }

  // Eyes


  const eyeGlowColor = `rgba(255, ${maw.eyeGlow * 200}, ${maw.eyeGlow * 100}, 1)`;
  ctx.fillStyle = eyeGlowColor;
  ctx.beginPath();
  ctx.arc(-15, -12, 8, 0, Math.PI * 2);
  ctx.arc(15, -12, 8, 0, Math.PI * 2);
  ctx.fill();

  // Pupils


  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-15, -12, 3, 0, Math.PI * 2);
  ctx.arc(15, -12, 3, 0, Math.PI * 2);
  ctx.fill();

  // Eye glow effect


  if (maw.eyeGlow > 0.5) {
    ctx.globalAlpha = maw.eyeGlow * 0.5;
    ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
    ctx.beginPath();
    ctx.arc(-15, -12, 12, 0, Math.PI * 2);
    ctx.arc(15, -12, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();


  // Drawing tentacles gradients

  for (const tent of maw.tentacles) {
    ctx.strokeStyle = '#2a6b50';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(maw.x, maw.y);

    // Wavy tentacle path with noise

    const points = 8;
    for (let i = 1; i <= points; i++) {
      const t = i / points;
      const tx = maw.x + Math.cos(tent.angle) * tent.length * t;
      const ty = maw.y + Math.sin(tent.angle) * tent.length * t;
      const wave = Math.sin(t * Math.PI * 2 + Date.now() / 100) * 10 * (1 - t);
      const perpAngle = tent.angle + Math.PI / 2;
      const wx = tx + Math.cos(perpAngle) * wave;
      const wy = ty + Math.sin(perpAngle) * wave;
      ctx.lineTo(wx, wy);
    }
    ctx.stroke();

  
    ctx.fillStyle = '#3a8b70';
    ctx.beginPath();
    ctx.arc(tent.x, tent.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}


function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;

   
    if (Math.hypot(b.x - maw.x, b.y - maw.y) < maw.baseWidth / 2) {
      maw.health -= b.damage;
      bullets.splice(i, 1);
      continue;
    }

   
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
    }
  }
}


function drawBullets() {
  ctx.fillStyle = '#ffcc00';
  for (const b of bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}


function drawBackground() {
  
  const sandGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sandGrad.addColorStop(0, '#d4a574');
  sandGrad.addColorStop(0.5, '#c49464');
  sandGrad.addColorStop(1, '#a47044');
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

 
   ctx.fillStylel = 'rgba(139, 90, 43, 0.3)';
  for (let i = 0; i < 100; i++) {
    const x = (i * 137) % canvas.width;
    const y = (i * 149) % canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

 
  ctx.fillStyle = 'rgba(100, 70, 50, 0.4)';
  ctx.beginPath();
  ctx.ellipse(150, 650, 60, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(900, 600, 80, 25, 0, 0, Math.PI * 2);
  ctx.ellipse(500, 680, 100, 30, 0, 0, Math.PI * 2);
  ctx.fill();
}

function updateUI() {
  document.getElementById('score').textContent = score;
  const healthPercent = Math.max(0, (maw.health / maw.maxHealth) * 100);
  const healthFill = document.getElementById('health-fill');
  healthFill.style.width = healthPercent + '%' ;

  if (healthPercent < 35)
     {
    healthFill.style.background = '#aa2222';
  } else if (healthPercent < 60)
     {
    healthFill.style.background = '#aa6600';
  } else 
    {
    healthFill.style.background = '#22aa44';
  }
}


 let lastHeartbeat = 0;
function checkHeartbeat() {
  if (maw.health / maw.maxHealth < 0.35) {
    const now = Date.now();
    const rate = 500 + (maw.health / maw.maxHealth) * 1000;
    if (now - lastHeartbeat > rate) {
      playHeartbeatSound(rate);
      lastHeartbeat = now;
    }
  }
}


function gameLoop() {
  if (gameState !== 'playing') {
    requestAnimationFrame(gameLoop);
    return;
  }

 
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  drawBackground();

  for (let i = slimeTrails.length - 1; i >= 0; i--) {
    if (!slimeTrails[i].update()) 
        {
      slimeTrails.splice(i, 1);
        } else 
      {
      slimeTrails[i].draw();
    }
  }

 
  spawnEnemies();

 
  for (const human of humans) human.update();
  for (const rover of rovers) rover.update();
  for (const tank of tanks) tank.update();

 
  updateMaw();


  updateBullets();

  
  for (let i = bloodSplatters.length - 1; i >= 0; i--) {
    if (!bloodSplatters[i].update()) {
      bloodSplatters.splice(i, 1);
    }
  }

 
  for (const blood of bloodSplatters) blood.draw();

  
  for (const human of humans) human.draw();
  for (const rover of rovers) rover.draw();
  for (const tank of tanks) tank.draw();

  
  drawBullets();

  
  drawMaw();

  checkHeartbeat();

  updateUI();

  requestAnimationFrame(gameLoop);
}


function startGame() {
  initAudio();
  gameState = 'playing';
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over-screen').style.display = 'none';


  maw.x = canvas.width / 2;
  maw.y = canvas.height / 2;
  maw.health = maw.maxHealth;
  maw.tentacles = [];
  score = 0;

  humans.length = 0;
  rovers.length = 0;
  tanks.length = 0;
  bullets.length = 0;
  slimeTrails.length = 0;
  bloodSplatters.length = 0;


  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 200 + Math.random() * 300;
    humans.push(new Human(
      maw.x + Math.cos(angle) * dist,
      maw.y + Math.sin(angle) * dist
    ));
    
  }
}


function gameOver() {
  gameState = 'gameover';
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over-screen').style.display = 'flex';
}


document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);


gameLoop();
