/*global Phaser*/
//import * as ChangeScene from './ChangeScenes.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('scroll', './assets/sprites/map_sketch.png');

    this.load.spritesheet('buttons', './UI-Elements/PlayButton.png',{
      frameHeight: 1000,
      frameWidth: 2000
    });

    this.load.audio('pops', './assets/sounds/buttonPops.mp3');

    //BACKGROUND AND FOREGROUND
    this.load.image('background', "./assets/images/cave_bg_test003.jpg",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });
    this.load.image('foreground', "./assets/images/cave_fg_test003.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });

    this.load.image('tiles', "./assets/sprites/cave_platform03.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/cave_tilemap3.json")

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('body', "./assets/sprites/bones_sketch.png");
    this.load.image('orange', './assets/images/blue1.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/run_spritesheet1.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS
    this.load.audio('cave_music1', "./assets/music/obsession_slowmix.wav");
  }



  create () {
    //Add event addSceneEventListeners
    //ChangeScene.addSceneEventListeners(this);
    this.add.text(this.centerX, this.centerY, "Loading game...");
    this.scene.start("start");



  }

}
