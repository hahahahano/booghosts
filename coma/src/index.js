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
import caveForestTransition from './scenes/transitions/ctf_TRAN.js';

///////////////////////////////////////////////FOREST//////////////////////////////////////////////////////////////////////////////////////////////////
import Forest from './scenes/forest.js';

///////////////////////////////////////////////RACE////////////////////////////////////////////////////////////////////////////////////////////////////
import Race1 from './scenes/car/Race.js';
import RacePopup from'./scenes/car/RacePopup.js';
import TryAgain from './scenes/car/TryAgain.js';

///////////////////////////////////////////////HOSPITAL////////////////////////////////////////////////////////////////////////////////////////////////
    //Lobby
import hosLobby from './scenes/hospital/lobby.js';
    //Bedrooms
import kidRoom from './scenes/hospital/kidRoom.js';
import adultRoom from './scenes/hospital/adultRoom.js';
    //Hallways
import hallAdultCOLD from './scenes/hospital/hallAdultCOLD.js';
import hallKidCOLD from './scenes/hospital/hallKidCOLD.js';
import hallAdultHOT from './scenes/hospital/hallAdultHOT.js';
import hallKidHOT from './scenes/hospital/hallKidHOT.js';

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
    this.scene.add('Hospital', hosLobby);
    this.scene.add('kidRoom', kidRoom);
    this.scene.add('adultRoom', adultRoom);
    this.scene.add('hallAdultCOLD', hallAdultCOLD);
    this.scene.add('hallAdultHOT', hallAdultHOT);
    this.scene.add('hallKidCOLD', hallKidCOLD);
    this.scene.add('hallKidHOT', hallKidHOT);
    
    this.scene.start('preloader');
    this.scene.add('message', message);
  }
}

window.game = new Game();
