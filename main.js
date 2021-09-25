class Sprite {
	constructor(positionX, positionY) {
		this.position = {
			x: positionX,
			y: positionY
		}
	}
	generateElement(itemData, sizeToGridFactor, color) {
		let element = createSprite(itemData.itemSize * 1.5, itemData.itemSize * 1.5, itemData.itemSize / sizeToGridFactor, itemData.itemSize / sizeToGridFactor);;
		element.position.x = this.position.x;
		element.position.y = this.position.y;
		element.shapeColor = color;
		return element;
	}
}


class Snake extends Sprite {
	constructor(positionX, positionY) {
		super(positionX, positionY);
		this.tail = [];
		this.lastPositions = [];
	}

	updateTail() {
		// IF tail is less than 4 units AND IF tail unit is not reapeating.
		if (this.lastPositions.length >= game.getScore() + 1 && !this.tailUnitExists()) {
			this.lastPositions.shift();
		}
		if (this.lastPositions.length < game.getScore() + 1 && !this.tailUnitExists()) {
			// Add the tail unit to the tail
			this.lastPositions.push(Object.assign({}, this.position));
			console.log(this.lastPositions);
		}
	}

	removeTail() {
		this.tail.forEach((item, i) => {
			item.remove();
		});
	}

	tailUnitExists() {
		for (var i = 0; i < this.lastPositions.length; i++) {
			return (this.lastPositions[i].x == this.position.x && this.lastPositions[i].y == this.position.y ? true : false);
		}

	}

	generateTail() {
		this.removeTail();
		this.lastPositions.forEach((item, i) => {
			let tailPiece = new Sprite(item.x, item.y);
			let tailPieceElement = tailPiece.generateElement(canvas.getGridData(), 2.5, (255, 255, 255));
			this.tail.push(tailPieceElement);
		});
	}

	getTail() {
		return this.tail;
	}
}


const canvas = (() => {
	let snakeElement, snake;
	let prizeElement, prize;
	let gridItem;
	let [row, column] = Array(2).fill(0);
	const gridData = {
		itemSize: 70,
		factor: 15,
		margin: 50,
	}

	const getGridData = () => {
		return gridData;
	}

	const getSnake = (element) => {
		if (element) {
			return snakeElement;
		}
		return snake;
	}

	const getPrize = (element) => {
		if (element) {
			return prizeElement;
		}
		return prize;
	}

	const removeSnakeElement = () => {
		snakeElement.remove();
	}

	const generate = () => {
		const canvasElement = createCanvas(gridData.factor * gridData.itemSize + gridData.margin, gridData.factor * gridData.itemSize + gridData.margin);
		_genearteGrid();
	}

	const generateSnake = () => {
		snake = new Snake((0 * gridData.itemSize) + (gridData.itemSize / 2), (0 * gridData.itemSize) + (gridData.itemSize / 2));
		snakeElement = snake.generateElement(getGridData(), 1.5, (255, 255, 255));
	}

	const updateSnake = () => {
		snakeElement.position.x = snake.position.x;
		snakeElement.position.y = snake.position.y;
	}

	const generatePrize = () => {
		prize = new Sprite(_generateRandomLocation(), _generateRandomLocation());
		prizeElement = prize.generateElement(getGridData(), 3, (255, 255, 255));
	}

	const _genearteGrid = () => {
		for (var i = 0; i < gridData.factor * gridData.factor; i++) {
			gridItem = createSprite(_setPositionGridX(i), _setPositionGridY(i), gridData.itemSize, gridData.itemSize);
			gridItem.shapeColor = (0, 0, 0);
		}
	}

	const _setPositionGridX = (i) => {
		if (i % gridData.factor === 0 && i !== 0) {
			row++;
		}
		let positionX = (i * gridData.itemSize) + (gridData.itemSize / 2) - ((gridData.itemSize * gridData.factor) * row);
		return positionX;
	}

	const _setPositionGridY = (i) => {
		if (i % gridData.factor === 0 && i !== 0) {
			column++
		}
		let positionY = (column * gridData.itemSize) + (gridData.itemSize / 2);
		return positionY;
	}

	const _generateRandomLocation = () => {
		let randomNumber = Math.floor(Math.random() * gridData.factor);
		return ((randomNumber * gridData.itemSize) + (gridData.itemSize / 2));
	}

	return {
		generate,
		generateSnake,
		getGridData,
		getPrize,
		getSnake,
		updateSnake,
		removeSnakeElement,
		generatePrize,
	}
})();

const game = (() => {
	let columnCount = 1;
	let rowCount = 1;
	let pressed;
	let _score = 0;

	const step = () => {
		moveSnake(canvas.getGridData(), canvas.getSnake());

		canvas.getSnake().updateTail();
		canvas.getSnake().generateTail();

		canvas.updateSnake();

		checkWin();
		checkLost(canvas.getGridData(), canvas.getSnake());
	}

	const getScore = () => {
		return _score;
	}

	const getPressed = () => {
		return pressed;
	}

	const start = () => {
		canvas.generateSnake();
		canvas.generatePrize();

		window.addEventListener("keypress", function(e) {

			if (e.keyCode === 100) {
				pressed = "d";
			} else if (e.keyCode === 115) {
				pressed = "s";
			} else if (e.keyCode === 97) {
				pressed = "a";
			} else if (e.keyCode === 119) {
				pressed = "w";
			}
		});
	}

	const moveSnake = (gridData, snake) => {
		switch (pressed) {
			case "d":
				snake.position.x = snake.position.x + gridData.itemSize;
				columnCount++;
				break;
			case "a":
				snake.position.x = snake.position.x - gridData.itemSize;
				columnCount--;
				break;
			case "s":
				snake.position.y = snake.position.y + gridData.itemSize;
				rowCount++;
				break;
			case "w":
				snake.position.y = snake.position.y - gridData.itemSize;
				rowCount--;
				break;
		}
	}

	const checkLost = (gridData, snake) => {
		if (snake.position.x > (gridData.itemSize * gridData.factor) || snake.position.y > (gridData.itemSize * gridData.factor) || snake.position.y < 0 || snake.position.x < 0) {
			stop();
		}
	}

	const checkWin = () => {
		canvas.getSnake(true).overlap(canvas.getPrize(true), function() {
			_score++;
			console.log(`Score: ${_score}`);
			canvas.getPrize(true).remove();
			canvas.generatePrize();
		});
	}

	const stop = () => {
		pressed = undefined;
		console.log(`You Lost! Your score is: ${_score}`);
		_score = 0;
		canvas.removeSnakeElement();
		canvas.getSnake().removeTail();
		canvas.generateSnake();
	}

	return {
		start,
		checkLost,
		getPressed,
		moveSnake,
		step,
		getScore,
	}

})();