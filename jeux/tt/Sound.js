export class Sound{
  constructor() {
    this.audio1 = new Audio('page-turn.mp3');
    this.audio2 = new Audio('arcade-ui-4.mp3');
    this.audio3 = new Audio('page-turn.mp3');
  }

  play(sound) {
    switch(sound) {
      case 1:
        this.audio1.play();
        break;
      case 2:
        this.audio2.play();
        break;
      case 3:
        this.audio3.play();
        break;
    }
    
  }
  


}