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
    //this.endReached = data.endReached;
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

    //if (this.endReached) {
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
        var text = this.add.text(this.centerX - 300, this.centerY - 150, "You wake up! You were in a coma, caused by a car accident. Your child... He was also in car! Let's go see him.", {
          font: "18px monospace",
          fill: "#fff",
          wordWrap: {width: 600, useAdvancedWrap: true},
          align: "center"
        });

        if (this.kidTalked) {
          var text = this.add.text(this.centerX - 200, this.centerY, "--- is awake! He leaps from his bed and hugs you.", {
            font: "18px monospace",
            fill: "#fff",
            wordWrap: {width: 600, useAdvancedWrap: true},
            align: "center"
          });
        } else {
          var text = this.add.text(this.centerX - 220, this.centerY, "--- is still unconscious... What should you do? ...What can you do?", {
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
    /*} else {
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
    }*/
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}