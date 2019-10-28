/*global Phaser*/
//import * as ChangeScene from './ChangeScenes.js';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('preloader');
  }

  preload () {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(this.centerX - 160, this.centerY - 30, 320, 50);

    var loadingText = this.make.text({
      x: this.centerX,
      y: this.centerY - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: this.centerX,
      y: this.centerY - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: this.centerX,
      y: this.centerY + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(490, 340, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.src);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
///////////////////////////////////////////////////////////////////////////////////////////////////////
    //START
    this.load.spritesheet('buttons', './UI-Elements/PlayButton.png',{
      frameHeight: 1000,
      frameWidth: 2000
    });
    this.load.audio('pops', './assets/sounds/buttonPops.mp3');

    //CAVES
      //BACKGROUND AND FOREGROUND
    this.load.image('caveBackground', "./assets/images/cave/cave_bg.jpg",{
      frameWidth: 2304, //432
      frameHeight: 3687, // 32
    });
    this.load.image('caveWaterfall', './assets/images/cave/blue1.png');
    this.load.image('caveForeground', "./assets/images/cave/cave_fg_test003.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });


    this.load.image('caveTiles', "./assets/textures/cave_tileset1.png");
    this.load.image('shrub', "./assets/sprites/shrub1.png");
    this.load.tilemapTiledJSON('caveMap', "./assets/tilemaps/cave_tilemap6.json")
    this.load.image("pressX", "./assets/images/pressX.png")

    // Transitions
    this.load.image("ctft", "./assets/images/cave_to_forest_transition.jpg");
    this.load.image("ctft1", "./assets/images/ctft_text1.png");
    this.load.image("ctft2", "./assets/images/ctft_text2.png");

      //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('exit', "./assets/sprites/bones_sketch.png");
    this.load.image('caveScroll', './assets/sprites/cave/map_sketch.png');
    this.load.image('caveTestRock', './assets/sprites/test_rock.png');
    this.load.image('boy_ghost', './assets/sprites/boy_ghost.png');
    this.load.image('car_side', './assets/sprites/car_side.png');

      //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/cave/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/cave/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/ghost.png", {
      frameWidth: 148,
      frameHeight: 200
    });

      //SOUNDS
    this.load.audio('cave_music', "./assets/music/cave_music.mp3");
    this.load.audio('forest_music', "./assets/music/forest_music.mp3");
    this.load.audio('left_step', "./assets/sounds/left_step.mp3");
    this.load.audio('right_step', "./assets/sounds/right_step.mp3");
    this.load.audio('bush', "./assets/sounds/bushes.mp3");


    //FOREST
      //BACKGROUND AND FOREGROUND
    this.load.image('forest_tiles', "./assets/textures/ground_tileset1.png");
    this.load.tilemapTiledJSON('forest_map', "./assets/tilemaps/forest_tilemap1.json");
    this.load.image('scenery', "./assets/images/forest_tilemap_overlay.png");
    this.load.image('forest_sky', "./assets/images/forest_sky.jpg");

    //CITY
      //BACKGROUND AND FOREGROUND
    this.load.image('cityBackground', "./assets/images/city_sky1.jpg");
    this.load.image('cityTiles', "./assets/textures/city_tileset1.png");
    this.load.tilemapTiledJSON('cityMap', "./assets/tilemaps/city_tilemap1.json");
    //MINIGAME
      //RACE
    this.load.image("raceTiles1", 'CAD/assets/tilesets/tuxmon-sample.png');
    this.load.image("raceTiles2", 'CAD/assets/tilesets/ground_tileset1.png');
    this.load.tilemapTiledJSON("raceMap", 'CAD/assets/tilemaps/map1b.json');
    this.load.audio("aralia", 'CAD/assets/music/pranilzaman_burymymind.mp3');
    this.load.image("racer", 'CAD/assets/cars/red_car2.png');
      //TRY AGAIN
    this.load.image('try', './CAD/assets/images/tryagain.png');
    this.load.audio('romulus', './CAD/assets/music/romdiprisco_romulus3.mp3');
}

  create () {
    //Add event addSceneEventListeners
    //ChangeScene.addSceneEventListeners(this);

    this.scene.start('start');
  }

}
