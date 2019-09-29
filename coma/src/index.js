/*global Phaser, window*/

import GameOverScene from './scenes/GameOverScene.js';
import start from './scenes/start.js';
import caves from './scenes/caves.js';
import Config from './config/config.js';
import BootScene from './scenes/loadscreen.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);

    this.scene.add('Boot',BootScene)
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('start',start);
    this.scene.add('caves',caves);
    this.scene.start('Boot');
  }
}

window.game = new Game();
