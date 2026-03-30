function generateBingoCard() {
    const card = Array(5).fill(0).map(() => Array(5).fill(0));
    const ranges = [[1,15], [16,30], [31,45], [46,60], [61,75]];
  
    for (let col = 0; col < 5; col++) {
      let nums = [];
      while (nums.length < 5) {
        const num = Math.floor(Math.random() * (ranges[col][1] - ranges[col][0] + 1)) + ranges[col][0];
        if (!nums.includes(num)) nums.push(num);
      }
      nums.sort((a, b) => a - b);
      for (let row = 0; row < 5; row++) {
        card[row][col] = nums[row];
      }
    }
    card[2][2] = "FREE"; // Center free space
    return card;
  }
  
  module.exports = { generateBingoCard };