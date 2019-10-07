/*
    ZONE INTERACTIONS
*/

//Tutorial Zone
instructions(instructBox) {
  this.instructionsText = ["Hey there. I'm glad you're awake. It's me. You. Hahaha. (Press X)", "You can move around with the arrow keys and interact with X.",
  "You should probably explore the area; maybe you'll remember something about yourself.", "But be careful; it looks like that small spirit is angry and might hurt you."];
  this.inter = 0;

  this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
    font: "18px monospace",
    fill: "#fff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#000",
    wordWrap: { width: 300, useAdvancedWrap: true }
  });
  this.inter ++;

  if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
    switch (this.inter)
      {
        case 1:
          this.instructBox.destroy();

          this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 300, useAdvancedWrap: true }
          });
          break;

        case 2:
          this.instructBox.destroy();

          this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 300, useAdvancedWrap: true }
          });
          break;

        case 3:
          this.instructBox.destroy();

          this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 250, useAdvancedWrap: true }
          });
           break;

        case 4:
          this.instructBox.destroy();
          break;
      }
      
      if (this.inter < 4) {
        this.inter++;
      }
  }
}

//Memory Pieces Zone
memsInstruct(memsBox) {
  if (this.score >= 1) {
    switch (this.collectTut)
    {
      case 0:
        this.memsBox.destroy();

        this.memsBox = this.add.text(1110, 2350, "Whoa. Did you feel that? I felt a hazy memory there. A car. Hm.", {
          font: "18px monospace",
          fill: "#fff",
          padding: { x: 20, y: 10 },
          backgroundColor: "#000",
          wordWrap: { width: 300, useAdvancedWrap: true }
        });
        this.collectTut ++;
        break;

      case 1:
        if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
          this.memsBox.destroy();
          this.collectTut ++;
        }
        break;
    }
  } else{
    switch (this.memIntro)
    {
      case 0:
        this.memsBox = this.add.text(1100, 2450, this.MemsText[this.memIntro], {
          font: "18px monospace",
          fill: "#fff",
          padding: { x: 20, y: 10 },
          backgroundColor: "#000",
          wordWrap: { width: 300, useAdvancedWrap: true }
        });
        this.memIntro++;
        break;

      case 1:
        if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
          this.memsBox.destroy();

          this.memsBox = this.add.text(1110, 2350, this.MemsText[this.memIntro], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 300, useAdvancedWrap: true }
          });
          this.memIntro++;
        }
        break;

      case 2:
        if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
          this.memsBox.destroy();
          this.memIntro++;
        }
        break;
    }
  }
}

//Exiting Scene Zone
exitInstruct(exitBox) {
  this.exitBox = this.add.text(50, 150, "This is the exit. Are you sure you want to leave?", {
    font: "18px monospace",
    fill: "#fff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#000",
    wordWrap: { width: 300, useAdvancedWrap: true }
  });
}