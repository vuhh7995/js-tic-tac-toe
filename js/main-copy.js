import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCellElementListTest,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplyButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatsus) {
  gameStatus = newGameStatsus;
  const getGameStatus = getGameStatusElement();
  if (getGameStatus) {
    getGameStatus.textContent = newGameStatsus;
  }
}

function showReplyButton() {
  const replyButton = getReplyButtonElement();
  if (replyButton) {
    replyButton.classList.add("show");
    replyButton.addEventListener("click", handleClick);
  }
}

function hideReplyButton() {
  const replyButton = getReplyButtonElement();
  if (replyButton) {
    replyButton.classList.remove("show");
    // replyButton.addEventListener("click", handleClick);
  }
}

function handleClick() {
  // reset temp global var
  // currentTurn = TURN.CROSS;

  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");
  // reset dom element
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);
  // reset current turn
  const currentTurn = getCurrentTurnElement();
  if (currentTurn) {
    currentTurn.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurn.classList.add(TURN.CROSS);
  }
  // reset high ligh
  const cellEList = getCellElementList();
  for (const ce of cellEList) {
    ce.className = "";
  }
  // reset game board
  const cellE = getCellElementList();
  for (const cell of cellE) cell.classList.remove(TURN.CIRCLE, TURN.CROSS);
  // hide replay button
  hideReplyButton();
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("invalid win possition");
  }
  for (const possiton of winPositions) {
    const cell = getCellElementAtIdx(possiton);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;
  // set selected cell
  cell.classList.add(currentTurn);
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
  toggleTurn();
  // toggle turn

  // check game status
  const game = checkGameStatus(cellValues);
  console.log("game", game);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      // updateGameStatus(game.status);
      // show replace button
      showReplyButton();
      // high light win
      highlightWinCells(game.winPositions);
      break;
    }
    case GAME_STATUS.X_WIN: {
      updateGameStatus(game.status);
      showReplyButton();
      highlightWinCells(game.winPositions);
      break;
    }
    case GAME_STATUS.O_WIN: {
      updateGameStatus(game.status);
      showReplyButton();
      highlightWinCells(game.winPositions);
      break;
    }

    default:
    // playing
  }
}
function initCellElementList() {
  const liList = getCellElementList();
  liList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  const ulElement = getCellElementListTest();
  ulElement.addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return;
    const index = Number.parseInt(event.target.dataset.idx);
    handleCellClick(event.target, index);
  });
}

// console.log(getCellElementList());
// console.log(getCellElementAtIdx(4));
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(() => {
  // bind click event for all li element
  getCurrentTurnElement();
  initCellElementList();
  // initReplayButton();
})();
