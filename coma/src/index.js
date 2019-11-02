/*global Phaser, window*/

import Config from './config/config.js';
import LoadScene from './scenes/loadscreen.js';
import start from './scenes/start.js';
import caves from './scenes/caves.js';
import Forest from './scenes/forest.js';
import Hospital from './scenes/Hospital.js';
import GameOverScene from './scenes/GameOverScene.js';
import message from './scenes/messages/messageBox.js';
import Hospital from './scenes/hospital.js';

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
<<<<<<< HEAD
=======
    this.scene.add('City', City);
>>>>>>> b6fc8d6221a4c5732aea4d0d64a268dd5a88323b
    this.scene.add('Hospital', Hospital);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('message', message);

    this.scene.add('CarMiniGame', Instructions);
    this.scene.add('Race', Race1);
    this.scene.add('TryAgain', TryAgain);

    this.scene.start('preloader');
  }
}

window.game = new Game();
