/*
  CAVE SCENE
*/

export default class BootScene extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('preloader');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //START
    this.load.spritesheet('playbutton', './assets/spriteSheets/playbutton.png',{
      frameHeight: 224,
      frameWidth: 500,
    });
    this.load.spritesheet('replaybutton', './assets/spriteSheets/replaybutton.png',{
      frameHeight: 224,
      frameWidth: 500,
    });
    this.load.image('titlepage', './assets/images/titlepage.jpg');
    this.load.audio('pops', './assets/sounds/buttonPops.mp3');

    //MESSAGES
    this.load.image('caveTestRock', './assets/sprites/test_rock.png');
    this.load.image('lgSpiritStill', './assets/images/cave/large_spirit_still.png');
    this.load.image('ghostStill', './assets/images/cave/ghost_still.png');
    this.load.image('kidStill', './assets/images/forest/kid_still.png');

    //TRANSITION VIDEOS
    this.load.video('intro', './assets/videos/intro_storyboard.mp4', 'loadeddata', false, true);
    this.load.video('city', './assets/videos/cth_storyboard.mp4', 'loadeddata', false, true);

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
    this.load.tilemapTiledJSON('caveMap', "./assets/tilemaps/cave_tilemap7.json")
    this.load.image('pressXCropped', "./assets/images/pressXCropped.png");

      //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('exit', "./assets/sprites/bones_sketch.png");
    this.load.image('caveScroll', './assets/sprites/cave/map_sketch.png');

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
    this.load.audio('left_step', "./assets/sounds/left_step.mp3");
    this.load.audio('right_step', "./assets/sounds/right_step.mp3");
    this.load.audio('bush', "./assets/sounds/bushes.mp3");
    this.load.audio('memory_collect', "./assets/sounds/memory.mp3");

    //Cave to Forest Transition
    this.load.image('ctft', "./assets/images/transitions/cave_to_forest_transition.jpg");
    this.load.image('ctft1', "./assets/images/transitions/ctft_text1.png");
    this.load.image('ctft2', "./assets/images/transitions/ctft_text2.png");

    //FOREST
      //BACKGROUND AND FOREGROUND
    this.load.image('forest_tiles', "./assets/textures/ground_tileset1.png");
    this.load.tilemapTiledJSON('forest_map', "./assets/tilemaps/forest_tilemap1.json");
    this.load.image('scenery', "./assets/images/forest/forest_tilemap_overlay.png");
    this.load.image('forest_sky', "./assets/images/forest/forest_sky.jpg");

      //OBJECTS
    this.load.image('acorn', "./assets/sprites/forest/acorn.jpg");
    this.load.image('boy_ghost', "./assets/sprites/boy_ghost.png");
    this.load.image('car_side', "./assets/sprites/forest/car_side.png");
    this.load.image('toy_car', "./assets/sprites/car/red_car2_old.png")

      //SOUNDS
    this.load.audio('forest_music', "./assets/music/forest_music.mp3");
    this.load.audio('memory_collect1', "./assets/sounds/memory1.mp3");

    //MINIGAME
      //BACKGROUND
    this.load.image("raceTiles1", './assets/textures/tuxmon-sample.png');
    this.load.image("raceTiles2", './assets/textures/ground_tileset1.png');
    this.load.tilemapTiledJSON("raceMap", './assets/tilemaps/race_tilemap1.json');
    this.load.image('try', './assets/images/tryagain.png');

      //LIVE CHARACTERS (car)
    this.load.image("racer", "./assets/sprites/car/red_car2.png");

      //SOUNDS
    this.load.audio('aralia', './assets/music/pranilzaman_burymymind.mp3');
    this.load.audio('romulus', './assets/music/romdiprisco_romulus3.mp3');

    //HOSPITAL
      //BACKGROUND AND FOREGROUND
    this.load.image('desk', "./assets/images/hospital/lobby.png");
    this.load.image('hospital_tiles', "./assets/textures/hospital_tileset1.png");
    this.load.tilemapTiledJSON('hospital_map', "./assets/tilemaps/hospital_tilemap1.json");
    this.load.tilemapTiledJSON('lobby_map', "./assets/tilemaps/lobby_tilemap1.json");
    this.load.image('hospital_tiles2', "./assets/textures/hospital_tileset2.png");
    this.load.tilemapTiledJSON('hospital_room1', "./assets/tilemaps/hospital_room1.json");
    this.load.image('adult', "./assets/sprites/hospital/adult.png");
    this.load.image('kid', "./assets/sprites/hospital/kid.png");
    this.load.image('hosDoor', "./assets/images/hospital/hospital_door.png");
    this.load.image('hosRoom_door', "./assets/images/hospital/hosRoom_door.png");
}
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create () {
    this.scene.start('start');
  }
}
