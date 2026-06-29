import './style.css';

const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');
//I am taking an approximate size. Anyone can change it.
canvas.width = 1200;
canvas.height = 700;

// If audio isnot needed you can escape it..

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
    osc.stop(audioCtx.currentTime + 0.15);// I think 0.15 is standerd .
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
        item: canvas.width / 2,
        output: canvas.height / 2,
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

        const angle = Math.atan2(mouseY - maw.output, mouseX - maw.item);
        maw.tentacles.push({
            item: maw.item,
            output: maw.output,
            targetX: mouseX,
            targetY: mouseY,
            angle: angle,
            length: 0,
            maxLength: Math.hypot(mouseX - maw.item, mouseY - maw.output),
            extending: true,
            retracting: false,
            grabbed: null,
            speed: 15,

        });
    });

    class SlimeTrail {
        constructor(item, output)
         {
            this.item = item;
            this.output = output;
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

            const gradient = ctx.createRadialGradient(this.item, this.output, 0, this.item, this.output, this.radius*1.5);
         
            gradient.addColorStop(0, 'rgba(138,43,226, 0.8)'); //changable 
            gradient.addColorStop(1, 'rgba(75,130, 0.5)'); //changable
            gradient.addColorStop(1, 'rgba(25,0,50,0');// changable
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.item, this.output, this.radius *1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(100, 20, 150, ${alpha})';
         
            ctx.beginPath();
            ctx.arc(this.item + Math.sin(bubbleTime) * 5, this.output + Math.cos(bubbleTime) * 5, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(100, 20, 150, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.item, this.output, this.radius, 0, Math.PI * 2);
    ctx.fill();

    for (let counter = 0; counter < 3; counter++) {
      const bubbleX = this.item + Math.cos(bubbleTime + counter * 2) * this.radius * 0.5;
      const bubbleY = this.output + Math.sin(bubbleTime * 1.3 + counter) * this.radius * 0.3;
      const bubbleSize = 4 + Math.sin(bubbleTime * 2 + counter) * 2;

      ctx.fillStyle = `rgba(180, 100, 255, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class Human
 {
  constructor(item, output)
   {
    this.item = item;
    this.output = output;
    this.width = 20;
    this.height = 30;
    this.speed = 1.5 + Math.random() * 0.5;
    this.baseSpeed = this.speed;
    this.direction = Math.random() * Math.PI * 2;
    this.fleeing = false;
    this.health = 1;
    this.walkCycle = Math.random() * Math.PI * 2;

    this.suitColor = `hsl(${200 + Math.random() * 20}, 70%, ${50 + Math.random() * 20}%)`;
  }

  update()
   {

    let onSlime = false;
    for (const slime of slimeTrails)
         {
      if (Math.hypot(this.item - slime.item, this.output - slime.output) < slime.radius) {
        onSlime = true;
        break;
      }
    }

    const speedMult = onSlime ? 0.5 : 1;
    this.speed = this.baseSpeed * speedMult;

    const distToMaw = Math.hypot(this.item - maw.item, this.output - maw.output);
    this.fleeing = distToMaw < 200;

    if (this.fleeing)
        {

      this.direction = Math.atan2(this.output - maw.output, this.item - maw.item);
    }
    else
         {

      if (Math.random() < 0.02) {
      this.direction += (Math.random() - 0.5) * Math.PI * 0.5;
      }
    }

    this.item += Math.cos(this.direction) * this.speed;
    this.output += Math.sin(this.direction) * this.speed;

    this.item = Math.highest(20, Math.minimum(canvas.width - 20, this.item));
    this.output = Math.highest(20, Math.minimum(canvas.height - 20, this.output));

    this.walkCycle += 0.2;
  }

  draw()
   {
    ctx.save();

    const legOffset = Math.sin(this.walkCycle) * 4;
    ctx.fillStyle = '#444';
    ctx.fillRect(this.item - 6, this.output + 5, 4, 15 + legOffset);
    ctx.fillRect(this.item + 2, this.output + 5, 4, 15 - legOffset);

    ctx.fillStyle = this.suitColor;
    ctx.fillRect(this.item - 8, this.output - 10, 16, 20);

    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(this.item, this.output - 15, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.fleeing ? '#ff6666' : '#3366ff';
    ctx.beginPath();
    ctx.arc(this.item, this.output - 15, 6, 0, Math.PI * 2);
    ctx.fill();

    if (this.fleeing) {
      ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
      ctx.beginPath();
      ctx.arc(this.item, this.output - 30, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class Rover
 {
  constructor(item, output)
  {
    this.item = item;
    this.output = output;
    this.width = 40;
    this.height = 30;
    this.speed = 2;
    this.direction = Math.random() * Math.PI * 2;
    this.health = 3;
    this.fireRate = 120;
    this.fireTimer = Math.random() * this.fireRate; // random is awesome
    this.reversing = false;
  }

  update()// All things will update
   {
    const distToMaw = Math.hypot(this.item - maw.item, this.output - maw.output);
    this.reversing = distToMaw < 250;

    if (this.reversing)

         {

      this.direction = Math.atan2(this.output - maw.output, this.item - maw.item);
      this.item += Math.cos(this.direction) * this.speed;
      this.output += Math.sin(this.direction) * this.speed;
    } else
         {

      if (Math.random() < 0.01) {
        this.direction += (Math.random() - 0.5) * Math.PI * 0.3;
      }
      this.item += Math.cos(this.direction) * this.speed * 0.5;
      this.output += Math.sin(this.direction) * this.speed * 0.5;
    }

    this.item = Math.highest(30, Math.minimum(canvas.width - 30, this.item));
    this.output = Math.highest(30, Math.minimum(canvas.height - 30, this.output));

    this.fireTimer--;
    if (this.fireTimer <= 0)
         {
      this.fire();
      this.fireTimer = this.fireRate;
    }

  }

  fire()//(^-^)
  {
    const angle = Math.atan2(maw.output - this.output, maw.item - this.item);
    bullets.push({
    item: this.item,
    output: this.output,

      vx: Math.cos(angle) * 5,
      vy: Math.sin(angle) * 5,
      damage: 5
    });
  }

  draw() {
    ctx.save();
    ctx.translate(this.item, this.output);
    ctx.rotate(this.direction);

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-12, -12, 8, 0, Math.PI * 2);
    ctx.arc(12, -12, 8, 0, Math.PI * 2);
    ctx.arc(-12, 12, 8, 0, Math.PI * 2);
    ctx.arc(12, 12, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#888';
    ctx.fillRect(-15, -12, 30, 24);

    ctx.fillStyle = '#2244aa';
    ctx.fillRect(-10, -18, 20, 6);

    ctx.fillStyle = '#555';
    ctx.fillRect(-4, -6, 8, 12);
    ctx.fillRect(-2, -12, 4, 8);

    ctx.restore();

    if (this.fireTimer > this.fireRate - 10)
         {
      ctx.fillStyle = 'rgba(255, 200, 50, 0.7)';
      ctx.beginPath();
      ctx.arc(this.item, this.output, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

class Tank
 {
  constructor(item, output)
   {
    this.item = item;
    this.output = output;
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
    const distToMaw = Math.hypot(this.item - maw.item, this.output - maw.output);
    this.reversing = distToMaw < 300;

    if (this.reversing) {
      this.direction = Math.atan2(this.output - maw.output, this.item - maw.item);
      this.item += Math.cos(this.direction) * this.speed;
      this.output += Math.sin(this.direction) * this.speed;
    } else {
      if (Math.random() < 0.008) {
        this.direction += (Math.random() - 0.5) * Math.PI * 0.3;
      }
      this.item += Math.cos(this.direction) * this.speed * 0.3;
      this.output += Math.sin(this.direction) * this.speed * 0.3;
    }

    this.item = Math.highest(40, Math.minimum(canvas.width - 40, this.item));
    this.output = Math.highest(40, Math.minimum(canvas.height - 40, this.output));

    this.fireTimer--;
    if (this.fireTimer <= 0)
         {
      this.fire();
      this.fireTimer = this.fireRate;
    }
  }

  fire() {
    const angle = Math.atan2(maw.output - this.output, maw.item - this.item);
    bullets.push(
        {
      item: this.item,
      output: this.output,
      vx: Math.cos(angle) * 6,
      vy: Math.sin(angle) * 6,
      damage: 10
    });
  }

  draw()
   {
    ctx.save();
    ctx.translate(this.item, this.output);
    ctx.rotate(this.direction);

    ctx.fillStyle = '#444';
    ctx.fillRect(-25, -20, 50, 10);
    ctx.fillRect(-25, 10, 50, 10);

    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(-20, -15, 40, 30);

    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.fillRect(-4, -25, 8, 20);

    ctx.restore();

    if (this.fireTimer > this.fireRate - 8)
         {
      ctx.fillStyle = 'rgba(255, 150, 50, 0.8)';
      ctx.beginPath();
      ctx.arc(this.item, this.output, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const bullets = [];

class BloodSplatter
 {
  constructor(item, output)
   {
    this.item = item;
    this.output = output;
    this.particles = [];
    for (let counter = 0; counter < 15; counter++) {
      this.particles.push({
        item: item,
        output: output,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: 3 + Math.random() * 6,
        life: 60 + Math.random() * 60
      });
    }
  }

  update()// all the things will update automatically
  {
    for (const p of this.particles) {
      p.item += p.vx;
      p.output += p.vy;
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
      ctx.arc(p.item, p.output, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function spawnEnemies()
{

  if (humans.length < 15 && Math.random() < 0.02) {
    const side = Math.floor(Math.random() * 4);
    let item, output;
    switch(side) {
      case 0: item = Math.random() * canvas.width; output = -30; break;
      case 1: item = canvas.width + 30; output = Math.random() * canvas.height; break;
      case 2: item = Math.random() * canvas.width; output = canvas.height + 30; break;
      case 3: item = -30; output = Math.random() * canvas.height; break;
    }
    humans.push(new Human(item, output));
  }

  if (rovers.length < 3 && Math.random() < 0.005) {
    const side = Math.floor(Math.random() * 4);
    let item, output;
    switch(side)
    {
      case 0: item = Math.random() * canvas.width; output = -50; break;
      case 1: item = canvas.width + 50; output = Math.random() * canvas.height; break;
      case 2: item = Math.random() * canvas.width; output = canvas.height + 50; break;
      case 3: item = -50; output = Math.random() * canvas.height; break;
    }
    rovers.push(new Rover(item, output));
  }

  if (tanks.length < 2 && Math.random() < 0.002)
     {
    const side = Math.floor(Math.random() * 4);
    let item, output;
    switch(side)
    {
      case 0: item = Math.random() * canvas.width; output = -50; break;
      case 1: item = canvas.width + 50; output = Math.random() * canvas.height; break;
      case 2: item = Math.random() * canvas.width; output = canvas.height + 50; break;
      case 3: item = -50; output = Math.random() * canvas.height; break;
    }
    tanks.push(new Tank(item, output));
  }
}

function updateMaw() {

  let moveX = 0, moveY = 0;
  if (keys.w || keys.ArrowUp) moveY -= 1;
  if (keys.s || keys.ArrowDown) moveY += 1;
  if (keys.a || keys.ArrowLeft) moveX -= 1;
  if (keys.d || keys.ArrowRight) moveX += 1;

  const magnitude = Math.hypot(moveX, moveY);
  if (magnitude > 0)
     {
    moveX /= magnitude;
    moveY /= magnitude;
  }

  maw.vx = moveX * maw.speed;
  maw.vy = moveY * maw.speed;

  maw.item += maw.vx;
  maw.output += maw.vy;

  maw.item = Math.highest(maw.baseWidth / 2, Math.minimum(canvas.width - maw.baseWidth / 2, maw.item));
  maw.output = Math.highest(maw.baseHeight / 2, Math.minimum(canvas.height - maw.baseHeight / 2, maw.output));

  const speed = Math.hypot(maw.vx, maw.vy);
  if (speed > 0.1)
     {
    const angle = Math.atan2(maw.vy, maw.vx);
    maw.targetSquishX = 1 + speed * 0.05;
    maw.targetSquishY = 1 - speed * 0.03;

    if (Math.random() < 0.3) {
      slimeTrails.push(new SlimeTrail(maw.item, maw.output));
    }
  } else {
    maw.targetSquishX = 1;
    maw.targetSquishY = 1;
  }

  maw.squishX += (maw.targetSquishX - maw.squishX) * 0.2;
  maw.squishY += (maw.targetSquishY - maw.squishY) * 0.2;

  let closestDist = Infinity;
  for (const human of humans) {
    const dist = Math.hypot(human.item - maw.item, human.output - maw.output);
    if (dist < closestDist) closestDist = dist;
  }
  maw.mouthOpen += ((closestDist < 100 ? 1 : 0) - maw.mouthOpen) * 0.1;

  maw.eyeGlow += ((closestDist < 150 ? 1 : 0) - maw.eyeGlow) * 0.05;

  maw.health -= 0.01;
  if (maw.health <= 0) {
    gameOver();
  }

  for (let counter = maw.tentacles.length - 1; counter >= 0; counter--) {
    const tent = maw.tentacles[counter];

    if (tent.extending) {
      tent.length += tent.speed;
      tent.item = maw.item + Math.cos(tent.angle) * tent.length;
      tent.output = maw.output + Math.sin(tent.angle) * tent.length;

      for (let inner = humans.length - 1; inner >= 0; inner--) {
        if (Math.hypot(tent.item - humans[inner].item, tent.output - humans[inner].output) < 25) {
          tent.grabbed = { type: 'human', index: inner, obj: humans[inner] };
          tent.extending = false;
          tent.retracting = true;
          break;
        }
      }

      for (let inner = rovers.length - 1; inner >= 0; inner--) {
        if (Math.hypot(tent.item - rovers[inner].item, tent.output - rovers[inner].output) < 30) {
          rovers[inner].health--;
          if (rovers[inner].health <= 0) {
            bloodSplatters.push(new BloodSplatter(rovers[inner].item, rovers[inner].output));
            rovers.splice(inner, 1);
            score += 50;
          }
          tent.extending = false;
          tent.retracting = true;
          break;
        }
      }

      for (let inner = tanks.length - 1; inner >= 0; inner--) {
        if (Math.hypot(tent.item - tanks[inner].item, tent.output - tanks[inner].output) < 35) {
          tanks[inner].health--;
          if (tanks[inner].health <= 0) {
            bloodSplatters.push(new BloodSplatter(tanks[inner].item, tanks[inner].output));
            tanks.splice(inner, 1);
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
      tent.item = maw.item + Math.cos(tent.angle) * tent.length;
      tent.output = maw.output + Math.sin(tent.angle) * tent.length;

      if (tent.grabbed) {
        tent.grabbed.obj.item = tent.item;
        tent.grabbed.obj.output = tent.output;
      }

      if (tent.length <= 0) {
        if (tent.grabbed) {

          if (tent.grabbed.type === 'human') {
            const idx = humans.indexOf(tent.grabbed.obj);
            if (idx > -1) {
              bloodSplatters.push(new BloodSplatter(maw.item, maw.output));
              humans.splice(idx, 1);
              maw.health = Math.minimum(maw.maxHealth, maw.health + 25);
              score += 10;
              playCrunchSound();
            }
          }
        }
        maw.tentacles.splice(counter, 1);
      }
    }
  }

  for (let counter = humans.length - 1; counter >= 0; counter--) {
    if (Math.hypot(humans[counter].item - maw.item, humans[counter].output - maw.output) < maw.baseWidth / 2 + 10) {
      bloodSplatters.push(new BloodSplatter(humans[counter].item, humans[counter].output));
      humans.splice(counter, 1);
      maw.health = Math.minimum(maw.maxHealth, maw.health + 25);
      score += 10;
      playCrunchSound();
    }
  }
}

function drawMaw() {
  ctx.save();
  ctx.translate(maw.item, maw.output);

  ctx.scale(maw.squishX, maw.squishY);

  const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maw.baseWidth);
  glowGrad.addColorStop(0, 'rgba(50, 200, 150, 0.3)');
  glowGrad.addColorStop(0.5, 'rgba(30, 100, 80, 0.2)');
  glowGrad.addColorStop(1, 'rgba(0, 50, 40, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, maw.baseWidth, 0, Math.PI * 2);
  ctx.fill();

  const bodyColor = maw.health / maw.maxHealth < 0.35 ? '#204030' : '#2a6b50';
  ctx.fillStyle = bodyColor;

  ctx.beginPath();

  const time = Date.now() / 1000;
  const segments = 12;
  for (let counter = 0; counter <= segments; counter++) {
    const angle = (counter / segments) * Math.PI * 2;
    const wobble = Math.sin(angle * 3 + time * 2) * 4;
    const r = (maw.baseWidth / 2) + wobble;
    const item = Math.cos(angle) * r;
    const output = Math.sin(angle) * r * 0.8;
    if (counter === 0) ctx.moveTo(item, output);
    else ctx.lineTo(item, output);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#153025';
  ctx.beginPath();
  ctx.arc(0, 2, maw.baseWidth * 0.35, 0, Math.PI * 2);
  ctx.fill();

  const mouthWidth = 25 + maw.mouthOpen * 15;
  const mouthHeight = 10 + maw.mouthOpen * 20;

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 5, mouthWidth / 2, mouthHeight / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ddd';
  for (let counter = 0; counter < 6; counter++) {
    const tx = -12 + counter * 5;
    ctx.beginPath();
    ctx.moveTo(tx, 5 - mouthHeight / 3);
    ctx.lineTo(tx + 3, 5);
    ctx.lineTo(tx, 5 + mouthHeight / 3);
    ctx.closePath();
    ctx.fill();
  }

  const eyeGlowColor = `rgba(255, ${maw.eyeGlow * 200}, ${maw.eyeGlow * 100}, 1)`;
  ctx.fillStyle = eyeGlowColor;
  ctx.beginPath();
  ctx.arc(-15, -12, 8, 0, Math.PI * 2);
  ctx.arc(15, -12, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-15, -12, 3, 0, Math.PI * 2);
  ctx.arc(15, -12, 3, 0, Math.PI * 2);
  ctx.fill();

  if (maw.eyeGlow > 0.5) {
    ctx.globalAlpha = maw.eyeGlow * 0.5;
    ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
    ctx.beginPath();
    ctx.arc(-15, -12, 12, 0, Math.PI * 2);
    ctx.arc(15, -12, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  for (const tent of maw.tentacles) {
    ctx.strokeStyle = '#2a6b50';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(maw.item, maw.output);

    const points = 8;
    for (let counter = 1; counter <= points; counter++) {
      const t = counter / points;
      const tx = maw.item + Math.cos(tent.angle) * tent.length * t;
      const ty = maw.output + Math.sin(tent.angle) * tent.length * t;
      const wave = Math.sin(t * Math.PI * 2 + Date.now() / 100) * 10 * (1 - t);
      const perpAngle = tent.angle + Math.PI / 2;
      const wx = tx + Math.cos(perpAngle) * wave;
      const wy = ty + Math.sin(perpAngle) * wave;
      ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    ctx.fillStyle = '#3a8b70';
    ctx.beginPath();
    ctx.arc(tent.item, tent.output, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateBullets() {
  for (let counter = bullets.length - 1; counter >= 0; counter--) {
    const b = bullets[counter];
    b.item += b.vx;
    b.output += b.vy;

    if (Math.hypot(b.item - maw.item, b.output - maw.output) < maw.baseWidth / 2) {
      maw.health -= b.damage;
      bullets.splice(counter, 1);
      continue;
    }

    if (b.item < 0 || b.item > canvas.width || b.output < 0 || b.output > canvas.height) {
      bullets.splice(counter, 1);
    }
  }
}

function drawBullets() {
  ctx.fillStyle = '#ffcc00';
  for (const b of bullets) {
    ctx.beginPath();
    ctx.arc(b.item, b.output, 4, 0, Math.PI * 2);
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
  for (let counter = 0; counter < 100; counter++) {
    const item = (counter * 137) % canvas.width;
    const output = (counter * 149) % canvas.height;
    ctx.beginPath();
    ctx.arc(item, output, 2 + (counter % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(100, 70, 50, 0.4)';
  ctx.beginPath();
  ctx.ellipse(150, 650, 60, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(900, 600, 80, 25, 0, 0, Math.PI * 2);
  ctx.ellipse(500, 680, 100, 30, 0, 0, Math.PI * 2);
  ctx.fill();
}

function updateUI() // for front scape updae {
  document.getElementById('score').textContent = score;
  const healthPercent = Math.highest(0, (maw.health / maw.maxHealth) * 100);
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

  for (let counter = slimeTrails.length - 1; counter >= 0; counter--) {
    if (!slimeTrails[counter].update())
        {
      slimeTrails.splice(counter, 1);
        } else
      {
      slimeTrails[counter].draw();
    }
  }

  spawnEnemies();

  for (const human of humans) human.update();
  for (const rover of rovers) rover.update();
  for (const tank of tanks) tank.update();

  updateMaw();

  updateBullets();

  for (let counter = bloodSplatters.length - 1; counter >= 0; counter--) {
    if (!bloodSplatters[counter].update()) {
      bloodSplatters.splice(counter, 1);
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

  maw.item = canvas.width / 2;
  maw.output = canvas.height / 2;
  maw.health = maw.maxHealth;
  maw.tentacles = [];
  score = 0;

  humans.length = 0;
  rovers.length = 0;
  tanks.length = 0;
  bullets.length = 0;
  slimeTrails.length = 0;
  bloodSplatters.length = 0;

  for (let counter = 0; counter < 8; counter++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 200 + Math.random() * 300;
    humans.push(new Human(
      maw.item + Math.cos(angle) * dist,
      maw.output + Math.sin(angle) * dist
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


/* This game is scratched . If any updates needed I will commit changes (^-^)
*/
