export { addSceneEventListeners };

function addSceneEventListeners (that) {
  that.input.keyboard.on(
    "keydown_ONE",
      function () {
        that.scene.start('caves');
      }
  );

  that.input.keyboard.on(
    "keydown_TWO",
      function () {
        that.scene.start('Forest');
      }
  );

  that.input.keyboard.on(
    "keydown_THREE",
      function () {
        that.scene.start('Race');
      }
  );

  that.input.keyboard.on(
    "keydown_FOUR",
      function () {
        that.scene.start('Hospital');
      }
  );

  that.input.keyboard.on(
    "keydown_FIVE",
      function () {
        that.scene.start('HosYes');
      }
  );

  that.input.keyboard.on(
    "keydown_SIX",
      function () {
        that.scene.start('HosNo');
      }
  );

  that.input.keyboard.on(
    "keydown_SEVEN",
      function () {
        that.scene.start('fth_video');
      }
  );

  that.input.keyboard.on(
    "keydown_ESC",
      function () {
        that.scene.start('start');
      }
  );
}
