import * as PIXI from "pixi.js";
import { canvasSize, APP } from '../ui/store';
import { LAYERS } from '../game/schema';

const gravity = 0.03;

interface Point {
  x: number,
  y: number
}

class Particle {
  texture: PIXI.Texture;
  sprite: PIXI.Sprite;
  scale: number;
  velocity: Point;
  explodeHeight: number;
  toExplode: boolean;
  exploded: boolean;
  fade: boolean;
  explode: any;

  constructor(texture: PIXI.Texture, scale: number, explode: any) {
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.zIndex = LAYERS.TEXT;
    this.scale = scale;
    this.sprite.scale.x = this.scale;
    this.sprite.scale.y = this.scale;
    this.velocity = {x: 0, y: 0};
    this.explodeHeight = 0.4 + Math.random()*0.5;
    this.explode = explode;
    this.toExplode = false;
    this.exploded = false;
    this.fade = false;
  }
  
  reset(texture: PIXI.Texture, scale: number) {
    this.sprite.alpha = 1;
    this.sprite.scale.x = scale;
    this.sprite.scale.y = scale;
    this.sprite.texture = texture;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.toExplode = false;
    this.exploded = false;
    this.fade = false;
  }
  
  setPosition(pos: Point) {
    this.sprite.position.x = pos.x;
    this.sprite.position.y = pos.y;
  }
  
  setVelocity(vel: Point) {
    this.velocity = vel;
  }
  
  update() {
    this.sprite.position.x += this.velocity.x;
    this.sprite.position.y += this.velocity.y;
    this.velocity.y += gravity;
    if (this.toExplode && !this.exploded) {
      // explode
      if (this.sprite.position.y < window.innerHeight * this.explodeHeight) {
        this.sprite.alpha = 0;
        this.exploded = true;
        this.explode(this.sprite.position, this.sprite.texture, this.sprite.scale.x);
      }
    }
    
    if (this.fade) {
      this.sprite.alpha -= 0.01;
    }
  }
}

export class Fireworks {
  ticker: PIXI.Ticker;
  particles: Array<Particle>;
  textures: Array<PIXI.Texture>;
  currentTexture: number = 0;
  loopStarted: number = 0;

  constructor() {
    this.ticker = new PIXI.Ticker();
    this.particles = [];
    this.textures = [];
  }

  private initTextures() {
    // TODO: draw circles instead of pulling a sprite
    for (let i = 0; i < 10; i++) {
      this.textures.push(PIXI.Texture.from(`https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-${i}.png?123`));
    }
  }

  private getParticle(texture: PIXI.Texture, scale: number) {
    // get the first particle that has been used
    let particle;
    // check for a used particle (alpha <= 0)
    for (var i = 0, l = this.particles.length; i < l; i++) {
      if (this.particles[i].sprite.alpha <= 0) {
        particle = this.particles[i];
        break;
      }
    }
    // update characteristics of particle
    if (particle) {
      particle.reset(texture, scale);
      return particle;
    }
    
    // otherwise create a new particle
    particle = new Particle(texture, scale, this.explode.bind(this));
    this.particles.push(particle);
    APP.stage.addChild(particle.sprite);
    return particle;
  }
  
  private explode(position: any, texture: PIXI.Texture, scale: number) {
    const steps = 8 + Math.round(Math.random() * 6);
    const radius = 2 + Math.random() * 4;
    for (let i = 0; i < steps; i++) {
      // get velocity
      const x = radius * Math.cos(2 * Math.PI * i / steps);
      const y = radius * Math.sin(2 * Math.PI * i / steps);
      // add particle
      const particle = this.getParticle(texture, scale);
      particle.fade = true;
      particle.setPosition(position);
      particle.setVelocity({x, y});
    }
  }
  
  private launchParticle() {
    const particle = this.getParticle(this.textures[this.currentTexture], Math.random() * 0.5);
    this.currentTexture++;
    if (this.currentTexture > 9) {
      this.currentTexture = 0;
    }
    particle.setPosition({x: Math.random() * canvasSize, y: canvasSize});
    const speed = canvasSize * 0.01;
    particle.setVelocity({x: -speed / 2 + Math.random() * speed, y: -speed + Math.random() * -1});
    particle.toExplode = true;
   
    // launch a new particle
    setTimeout(this.launchParticle.bind(this), 200 + Math.random() * 600);
  }
  
  private fadeBackground() {
    var graphics = new PIXI.Graphics();
    graphics.name = 'fireworks';
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 10000, 10000);
    graphics.zIndex = LAYERS.TEXT;
    const alphaFilter = new PIXI.filters.AlphaFilter(.9);
    graphics.filters = [alphaFilter];
    APP.stage.addChild(graphics);
  }
  
  loop() {
    this.particles.forEach(particle => particle.update());
    APP.renderer.render(APP.stage);
  }

  stop() {
    this.ticker.stop();
    this.particles.forEach(particle => particle.sprite.destroy());
    this.particles = [];
    APP.stage.getChildByName('fireworks')?.destroy();
    APP.renderer.render(APP.stage);
  }

  start() {
    this.fadeBackground();
    this.initTextures();
    this.launchParticle();
    this.ticker.add(this.loop.bind(this));
    this.ticker.start();
    setTimeout(this.stop.bind(this), 5000); // show for 5 seconds
  }
}
