/*global Phaser, window*/

import Config from './config/config.js';
import LoadScene from './scenes/loadscreen.js';
import start from './scenes/start.js';
import caves from './scenes/caves.js';
import Forest from './scenes/forest.js';
import City from './scenes/City.js';
import GameOverScene from './scenes/GameOverScene.js';

import Instructions from '../CAD/src/scenes/instructions.js';
import Race1 from '../CAD/src/scenes/Race.js';
import TryAgain from '../CAD/src/scenes/TryAgain.js';
import Winner from '../CAD/src/scenes/Winner.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);

    this.scene.add('preloader', LoadScene);
    this.scene.add('start', start);
    this.scene.add('caves', caves);
    this.scene.add('Forest', Forest);
    this.scene.add('City', City);
    this.scene.add('GameOverScene', GameOverScene);

    this.scene.add('CarMiniGame', Instructions);
    this.scene.add('Race', Race1);
    this.scene.add('TryAgain', TryAgain);

    this.scene.start('Forest');
  }
}

window.game = new Game();
