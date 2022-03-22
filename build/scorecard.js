const generateScoreCard = async () => {
    let result = `Tordle Scorecard \n\n`;
    let board = document.getElementById("game-board");
    var rows = board.getElementsByClassName('letter-row');
    for( i=0; i< rows.length; i++ )
    {
     var boxes = rows[i].getElementsByClassName('letter-box filled-box');
     for( i=0; i< boxes.length; i++ )
     {
      var boxColor = boxes[i].backgroundColor;
      switch (boxColor) {
        case 'green':
          result = result + '🟩';
        case 'yellow':
          result = result + '🟨';
        default:
          result = result + '⬛';
      }
      result = result +'\n'
     }
    }
    await navigator.clipboard.writeText(result);
    showMessage("Result is copied to clipboard")
  }
