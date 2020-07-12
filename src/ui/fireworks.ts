import * as PIXI from "pixi.js";
import { canvasSize, APP } from '../ui/store';
import { LAYERS } from '../game/schema';

const gravity = 0.04;

interface Point {
  x: number,
  y: number
}

class Particle {
  circle: PIXI.Graphics;
  velocity: Point;
  explodeHeight: number;
  toExplode: boolean;
  exploded: boolean;
  fade: boolean;
  explode: any;

  constructor(color: number, scale: number, explode: any) {
    this.circle = this.getCircle(color, scale);
    this.velocity = {x: 0, y: 0};
    this.explodeHeight = 0.1 + Math.random();
    this.explode = explode;
    this.toExplode = false;
    this.exploded = false;
    this.fade = false;
  }

  private getCircle(color: number, scale: number) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    const fireworkSize = 4;
    graphics.drawCircle(0, 0, fireworkSize * scale);
    graphics.zIndex = LAYERS.TEXT;
    APP.stage.addChild(graphics);
    return graphics;
  }
  
  setPosition(pos: Point) {
    this.circle.position.x = pos.x;
    this.circle.position.y = pos.y;
  }
  
  setVelocity(vel: Point) {
    this.velocity = vel;
  }
  
  update() {
    this.circle.position.x += this.velocity.x;
    this.circle.position.y += this.velocity.y;
    this.velocity.y += gravity;
    if (this.toExplode && !this.exploded) {
      // explode
      if (this.circle.position.y < canvasSize * this.explodeHeight) {
        this.circle.alpha = 0;
        this.exploded = true;
        this.explode(this.circle);
      }
    }
    
    if (this.fade) {
      this.circle.alpha -= 0.01;
    }
  }
}

export class Fireworks {
  ticker: PIXI.Ticker;
  particles: Array<Particle>;

  constructor() {
    this.particles = [];
    this.ticker = new PIXI.Ticker();
    this.ticker.add(this.loop.bind(this));
  }

  private getParticle(color: number, scale: number) {    
    const particle = new Particle(color, scale, this.explode.bind(this));
    this.particles.push(particle);
    return particle;
  }
  
  private explode(circle: PIXI.Graphics) {
    const steps = 8 + Math.round(Math.random() * 6);
    const radius = 2 + Math.random() * 4;
    for (let i = 0; i < steps; i++) {
      // get velocity
      const x = radius * Math.cos(2 * Math.PI * i / steps);
      const y = radius * Math.sin(2 * Math.PI * i / steps);
      // add particle
      const particle = this.getParticle(circle.fill.color, circle.scale.x);
      particle.fade = true;
      particle.setPosition(circle.position);
      particle.setVelocity({x, y});
    }
  }
  
  private launchParticle() {
    const particleScale = Math.random() * 0.9;
    const color = Math.floor(Math.random() * 16777215);
    const particle = this.getParticle(color, particleScale);
    particle.setPosition({x: Math.random() * canvasSize, y: canvasSize});
    const speed = canvasSize * 0.02;
    particle.setVelocity({x: -speed / 2 + Math.random() * speed, y: -speed + Math.random() * -1});
    particle.toExplode = true;
  }
  
  private fadeBackground() {
    const graphics = new PIXI.Graphics();
    graphics.name = 'fireworks background';
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 10000, 10000);
    graphics.zIndex = LAYERS.TEXT;
    const alphaFilter = new PIXI.filters.AlphaFilter(.9);
    graphics.filters = [alphaFilter];
    APP.stage.addChild(graphics);
  }
  
  loop() {
    this.launchParticle();
    this.particles.forEach(particle => particle.update());
    APP.renderer.render(APP.stage);
  }

  stop() {
    if (this.ticker.started) {
      this.ticker.stop();
      this.particles.forEach(particle => particle.circle.destroy());
      this.particles = [];
      APP.stage.getChildByName('fireworks background')?.destroy();
      APP.renderer.render(APP.stage);
    }
  }

  start() {
    this.fadeBackground();
    this.ticker.start();
    setTimeout(this.stop.bind(this), 5000); // show for 5 seconds
  }
}
