/*global Phaser, window*/
import Menu from './scenes/Menu.js';
import Instructions from './scenes/Instructions.js';
import Config from './config/config.js';
import Race1 from './scenes/Race1.js';
import TryAgain from './scenes/TryAgain.js';
import Winner from './scenes/winner.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Menu', Menu);
    this.scene.add('Instructions', Instructions);
    this.scene.add('Race1', Race1);
    this.scene.add('TryAgain', TryAgain);
    this.scene.add('winner', Winner);
    this.scene.start('Menu');
  }
}

window.game = new Game();
