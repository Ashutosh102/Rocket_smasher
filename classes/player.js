class Player {
	constructor() {
		this.inventory = { mines: 0, bombs: 0 };
		this.hits = 0;
		this.score = 0;

		this.mineScore = 0;
		this.bombScore = 0;

		this.inventoryFollowsMouse = false;

		this.highscoreKey = 'rockets_highscore';
		try {
			this.highscore = Number(localStorage.getItem(this.highscoreKey));
			if (!this.highscore) {
				localStorage.setItem(this.highscoreKey, 0);
			}
		} catch (err) {
			this.highscore = 0;
			console.log('couldnt get highscore, localstorage failed');
		}
	}

	updateScore(value) {
		this.score += value;
		this.mineScore += value;
		this.bombScore += value;

		this.updateInventory();

		const scoreTip = new ScoreTip(mouseX, mouseY, value, 'score');
		game.addScoreTip(scoreTip);
	}

	getScore() {
		return this.score;
	}

	updateInventory() {
		if (this.mineScore / game.mineLimit > 1) {
			this.inventory.mines++;
			this.mineScore -= game.mineLimit;
			game.addMessage('Gravity Mine');
		}

		if (this.bombScore / game.bombLimit > 1) {
			this.inventory.bombs++;
			this.bombScore -= game.bombLimit;
			game.addMessage('Nuke');
		}
	}
}
