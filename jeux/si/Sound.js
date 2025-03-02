export class Sound{
  constructor() {
    this.audio1 = new Audio('sound_1.mp3');
    this.audio2 = new Audio('sound_2.mp3');
    this.audio3 = new Audio('sound_3.mp3');
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