/*
  INDEX
*/

///////////////////////////////////////////////GENERAL/////////////////////////////////////////////////////////////////////////////////////////////////
import Config from './config/config.js';
import LoadScene from './scenes/loadscreen.js';
import message from './scenes/messages/messageBox.js';
import start from './scenes/start.js';
import GameOverScene from './scenes/GameOverScene.js';

///////////////////////////////////////////////VIDEOS//////////////////////////////////////////////////////////////////////////////////////////////////
import intro_video from './scenes/transitions/intro_video.js';
import fth_video from './scenes/transitions/fth_video.js';

///////////////////////////////////////////////CAVES///////////////////////////////////////////////////////////////////////////////////////////////////
import caves from './scenes/caves.js';
import caveForestTransition from '../CAD/src/scenes/instructions.js';

///////////////////////////////////////////////FOREST//////////////////////////////////////////////////////////////////////////////////////////////////
import Forest from './scenes/forest.js';

///////////////////////////////////////////////RACE////////////////////////////////////////////////////////////////////////////////////////////////////
import Race1 from '../CAD/src/scenes/Race.js';
import RacePopup from '../CAD/src/scenes/RacePopup.js';
import TryAgain from '../CAD/src/scenes/TryAgain.js';

///////////////////////////////////////////////HOSPITAL////////////////////////////////////////////////////////////////////////////////////////////////
    //Lobby
import Hospital from './scenes/hospital/lobby.js';
    //Bedrooms
import HosNo from './scenes/hospital/kidRoom.js';
import HosYes from './scenes/hospital/adultRoom.js';
    //Hallways
import hoscoldadult from './scenes/hospital/hallAdultCOLD.js';
import hoscoldkid from './scenes/hospital/hallKidCOLD.js';
import hoshotadult from './scenes/hospital/hallAdultHOT.js';
import hoshotkid from './scenes/hospital/hallKidHOT.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
        //General
    this.scene.add('preloader', LoadScene);
    
    this.scene.add('start', start);
    this.scene.add('GameOverScene', GameOverScene);
        //Videos
    this.scene.add('intro_video', intro_video);
    this.scene.add('fth_video', fth_video);
        //Caves
    this.scene.add('caves', caves);
    this.scene.add('CTFT', caveForestTransition);
        //Forest
    this.scene.add('Forest', Forest);
        //Race
    this.scene.add('Race', Race1);
    this.scene.add('RacePopup', RacePopup);
    this.scene.add('TryAgain', TryAgain);
        //Hospital
    this.scene.add('Hospital', Hospital);
    this.scene.add('HosNo', HosNo);
    this.scene.add('hoscoldadult', hoscoldadult);
    this.scene.add('hoshotadult', hoshotadult);
    this.scene.add('hoscoldkid', hoscoldkid);
    this.scene.add('hoshotkid', hoshotkid);
    this.scene.add('HosYes', HosYes);
    
    this.scene.start('preloader');
    this.scene.add('message', message);
  }
}

window.game = new Game();
