/*
  GAME OVER
*/
import * as changeScene from './changeScene.js';

export default class GameOverScene extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('GameOverScene');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.score = this.registry.get("score");
    this.kidTalked = this.registry.get("talked");
    this.endReached = data.endReached;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload () {
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    //this.score = 0;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create (data) {
    //Add change scene event listeners
    changeScene.addSceneEventListeners(this);

    if (this.endReached) {
      if (this.score <= 5) {
        var text = this.add.text(this.centerX - 215, this.centerY - 150, "You wake up, but you don't seem to remember anything... What happened?", {
          font: "18px monospace",
          fill: "#fff",
          wordWrap: {width: 600, useAdvancedWrap: true},
          align: "center"
        });

        if (this.kidTalked) {
          var text = this.add.text(this.centerX - 280, this.centerY, "You see a child next to you. He leaps from his bed and hugs you... But who is he?", {
            font: "18px monospace",
            fill: "#fff",
            wordWrap: {width: 600, useAdvancedWrap: true},
            align: "center"
          });
        }

        var score = this.add.text(this.centerX - 100, this.centerY + 150, 'Memories Collected: ' + this.score, {
          font: "18px monospace",
          fill: "#fff",
          wordWrap: {width: 600, useAdvancedWrap: true},
          align: "center"
        });
      } else {
        var text = this.add.text(this.centerX - 275, this.centerY - 150, "You wake up! You were in a coma, caused by a car accident. Your child... He was also in car! Let's go see him.", {
          font: "18px monospace",
          fill: "#fff",
          wordWrap: {width: 600, useAdvancedWrap: true},
          align: "center"
        });

        if (this.kidTalked) {
          var text = this.add.text(this.centerX - 220, this.centerY, "--- is awake! He leaps from his bed and hugs you.", {
            font: "18px monospace",
            fill: "#fff",
            wordWrap: {width: 600, useAdvancedWrap: true},
            align: "center"
          });
        } else {
          var text = this.add.text(this.centerX - 250, this.centerY, "--- is still unconscious... What should you do? ...What can you do?", {
            font: "18px monospace",
            fill: "#fff",
            wordWrap: {width: 600, useAdvancedWrap: true},
            align: "center"
          });
        }

        var score = this.add.text(this.centerX-100, this.centerY + 150, 'Memories Collected: ' + this.score, {
          font: "18px monospace",
          fill: "#fff",
          wordWrap: {width: 600, useAdvancedWrap: true},
          align: "center"
        });
      }
    } else {
      var text = this.add.text(this.centerX - 280, this.centerY, "You didn't make it to your body in time. You never wake up from your coma, stuck as a spirit...", {
        font: "18px monospace",
        fill: "#fff",
        wordWrap: {width: 600, useAdvancedWrap: true},
        align: "center"
      });
      var score = this.add.text(this.centerX-100, this.centerY + 150, 'Memories Collected: ' + this.score, {
        font: "18px monospace",
        fill: "#fff",
        wordWrap: {width: 600, useAdvancedWrap: true},
        align: "center"
      });
    }

    var sound = this.sound.add('pops');
    sound.addMarker({
      name: 'low',
      start: 0.15,
      duration: 0.5
    });
    sound.addMarker({
      name: 'high',
      start: 1.1,
      duration: 1.5
    });

    var b1 = this.add.sprite(this.centerX + 10,this.centerY + 250, 'replaybutton', 0).setInteractive();
    b1.setScale(.75);
    b1.setFrame(0);
    b1.on('pointerover', function() {
      this.setFrame(1);
      sound.play('low');
    });

    b1.on('pointerout', function() {
      this.setFrame(0);
    });

    b1.on("pointerup", function() {
        sound.play('high');

        this.registry.remove("score");
        this.registry.remove("inventory");
        this.registry.remove("timerGlobal");
        this.registry.remove("talked");
        this.registry.remove("hospitalCheck");

        this.scene.start('start');
      }, this
    );
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}