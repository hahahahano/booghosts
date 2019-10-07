/*global Phaser, window*/

import GameOverScene from './scenes/GameOverScene.js';
import start from './scenes/start.js';
import caves from './scenes/caves.js';
import Config from './config/config.js';
import BootScene from './scenes/loadscreen.js';
import city from './scenes/City.js';
import Instructions from '../CAD/src/scenes/instructions.js'
import Race1 from '../CAD/src/scenes/Race1.js'
import TryAgain from '../CAD/src/scenes/TryAgain.js'
import Winner from '../CAD/src/scenes/Winner.js'

class Game extends Phaser.Game {
  constructor () {
    super(Config);

    this.scene.add('Boot',BootScene);
    this.scene.add('TryAgain',TryAgain);
    this.scene.add('Instructions',Instructions);
    this.scene.add('Race1',Race1);
    this.scene.add('city',city);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('start',start);
    this.scene.add('caves',caves);
    this.scene.start('Boot');
  }
}

window.game = new Game();
