import './style.css'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

var animationFrameID = null

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

//puntacion
let score = document.querySelector('#puntuacion')

const COLORS = [
  'red',
  'green',
  'blue',
  'yellow',
]

const pieces = {
  position: { x: 5, y: 1 },
  shape: [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
  ]
}

let piece = {}

function setPiece(){
  const numberRand = Math.floor(Math.random() * pieces.shape.length)
  const selectedPiece = pieces.shape[numberRand]
  piece = {
    position: { x: 5, y: 1 },
    shape: selectedPiece,
    color: COLORS[numberRand]
  }
}

//create board
const BOARD = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(0))

const BOARD_PIECES_COLORS = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(0))

function drawBoard(){
  BOARD.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        ctx.fillStyle = COLORS[BOARD_PIECES_COLORS[y][x]]
        ctx.fillRect(x, y, 1, 1)
      }
    })
  })
}

function drawPiece(){
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        ctx.fillStyle = piece.color
        ctx.fillRect(piece.position.x + x, piece.position.y + y, 1, 1)
      }
    })
  })
}

function solifyPiece(){
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        BOARD[piece.position.y + y][piece.position.x + x] = 1
        const color = COLORS.indexOf(piece.color)
        BOARD_PIECES_COLORS[piece.position.y + y][piece.position.x + x] = color
        }
    })
  })
}

function pieceCollision(){
  let collision = false
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0 && BOARD[y + piece.position.y]?.[x + piece.position.x] !== 0) {
        collision = true
      }
    })
  })
  return collision
}

function removeRows(){
  let rowsToRemove = []
  BOARD.forEach((row, y) => {
    let remove = true
    row.forEach((value, x) => {
      if (value === 0) {
        remove = false
      }
    })
    if (remove) {
      score.innerHTML = Number(score.innerHTML) + 10
      rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach((rowToRemove) => {
    BOARD.splice(rowToRemove, 1)
    BOARD.unshift(new Array(BOARD_WIDTH).fill(0))
  })
}

function rotate(){
  let rotatedPiece = []
  for(let i = 0; i < piece.shape[0].length; i++){
    const row = []
    for(let j = piece.shape.length - 1; j >= 0; j--){
      row.push(piece.shape[j][i])
    }
    rotatedPiece.push(row)
  }
  piece.shape = rotatedPiece
  if(pieceCollision()) rotate()
}

function resetPiece(){
  setPiece()
  piece.position.x = Math.floor(Math.random() * 10)
  piece.position.y = 1
  if(pieceCollision()){

    window.cancelAnimationFrame(animationFrameID)

    BOARD.forEach((row, y) => {
      setTimeout(() => {
      row.forEach((value, x) => {
            if (value > 0) {
              ctx.fillStyle = 'gray'
              ctx.fillRect(x, y, 1, 1)
            }
          }, 1500)
      })
    })
    setTimeout(() => {
      window.alert('Game Over')
      location.reload()
    }, 1500)
  }
}

let frameSpeed = 30
let time = 0

setPiece()

function update(){

  time += frameSpeed / 100

  if(time > 20){
    piece.position.y ++
    time = 0
    if(pieceCollision()) {
      piece.position.y -= 1
      solifyPiece()
      resetPiece()
      removeRows()
    }
  }

  draw()
  drawBoard()
  drawPiece()
  animationFrameID = window.requestAnimationFrame(update)
}

function draw(){
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

update()

//listeners
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    piece.position.x -= 1
    if(pieceCollision()) piece.position.x += 1
  } else if (event.key === 'ArrowUp') {
    rotate()
  } else if (event.key === 'ArrowRight') {
    piece.position.x += 1
    if(pieceCollision()) piece.position.x -= 1
  } else if (event.key === 'ArrowDown') {
    piece.position.y += 1
    if(pieceCollision()) {
      piece.position.y -= 1
      solifyPiece()
      resetPiece()
      removeRows()
    }
  }
})