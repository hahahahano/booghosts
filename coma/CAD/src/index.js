/*global Phaser, window*/
import Menu from './CAD/scenes/Menu.js';
import Instructions from './CAD/scenes/Instructions.js';
import Config from './CAD/config/config.js';
import Race1 from './CAD/scenes/Race.js';
import TryAgain from './CAD/scenes/TryAgain.js';
import Winner from './CAD/scenes/winner.js';

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
