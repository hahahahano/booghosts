/*global Phaser, window*/

import GameOverScene from './scenes/GameOverScene.js';
import start from './scenes/start.js';
import caves from './scenes/caves.js';
import tutorial from './scenes/tutorial.js';
import Config from './config/config.js';
import BootScene from './scenes/loadscreen.js';
import city from './scenes/City.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);

    this.scene.add('Boot',BootScene);
    this.scene.add('city',city);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('start',start);
    this.scene.add('caves',caves);
    this.scene.add('tutorial', tutorial);
    this.scene.start('tutorial');
  }
}

window.game = new Game();
