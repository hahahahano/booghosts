

export default class drag extends Phaser.Scene {
	constructor(dragObj) {
		this.dragObj = dragObj;
		game.input.onDown.add(this.onDown, this);
	}

	onDown() {
		//set canDrag to false
    this.canDrag = false;
    //check if the mouse is in bounds
    //since my dragObject is the full width of the game
    //I only need to check the y position
    //The top of the drag object is the y position
    //and the bottom is the top plus the height

    if (game.input.y > this.dragObj.y && game.input.y < (this.dragObj.y + this.dragObj.height)) {
      //set the canDrag to true;
      this.canDrag = true;
      //get the start position of the dragObject
      //so we may compare it to the current position
      //when dragging
      this.startY = this.dragObj.y;
      //the offset is how far down on the grid the 
      //mouse is when the user started dragging
      //without this line the grid will jump when 
      //the drag starts
      this.offSet = this.dragObj.y - game.input.y;
    }
  }
  update() {
    if (game.input.mousePointer.isDown) {
      if (this.canDrag == true) {
        //calculate the difference between the startY
        //and the current mouse y position
        //and add in the offSet
        var diff = game.input.y - this.startY + this.offSet;
        //update the start position
        //by adding the difference to the start position
        this.dragObj.y = this.startY + diff;
    	}
  	}
  }
}