function checkWin(card, marked) {
    // marked is a Map or object like "2-3": true
  
    // Check rows
    for (let row = 0; row < 5; row++) {
      let win = true;
      for (let col = 0; col < 5; col++) {
        const key = `${row}-${col}`;
        if (card[row][col] !== "FREE" && !marked.get(key)) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }
  
    // Check columns
    for (let col = 0; col < 5; col++) {
      let win = true;
      for (let row = 0; row < 5; row++) {
        const key = `${row}-${col}`;
        if (card[row][col] !== "FREE" && !marked.get(key)) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }
  
    // Main diagonal
    let win = true;
    for (let i = 0; i < 5; i++) {
      const key = `${i}-${i}`;
      if (card[i][i] !== "FREE" && !marked.get(key)) {
        win = false;
        break;
      }
    }
    if (win) return true;
  
    // Anti-diagonal
    win = true;
    for (let i = 0; i < 5; i++) {
      const key = `${i}-${4-i}`;
      if (card[i][4-i] !== "FREE" && !marked.get(key)) {
        win = false;
        break;
      }
    }
    if (win) return true;
  
    return false;
  }
  
  module.exports = { checkWin };