class BlockScene extends BaseScene {
  constructor(canvas, blocksOfNumber, life) {
    super(canvas)
    this.blocksOfNumber = blocksOfNumber
    this.blockLife = life
    this.bindEvent()
  }

  addBlock = async (id, point) => {
    this.elementDict[`block${id}`] = await Block.new(...point)
    this.elementDict[`block${id}`].life = this.blockLife
  }

  bindEvent = () => {
    this.canvas.addEventListener('click', async event => {
      if (this.status === 'ing') {
        const { offsetX, offsetY } = event
        const index = randomRange(1, 10 * 10000)
        await this.addBlock(index, [offsetX, offsetY])
      }
    })
  }

  paddleInit = async () => {
    const x = config.width / 3
    const y = config.height - 50
    const paddle = await Paddle.new(x, y, config.blockGame.paddle)
    this.elementDict['paddle'] = paddle
  }

  blockInit = async () => {
    for (let i = 0; i < this.blocksOfNumber; i++) {
      const key = 'block' + i
      const paddle = this.elementDict['paddle']
      const h = paddle.height + paddle.y - 10
      await this.addBlock(key, randomCoordinate(null, h))
    }
  }

  loadElement = async () => {
    await this.paddleInit()
    await this.blockInit()
    this.npcDict = {
      ball: await Ball.new(100, 100, config.blockGame.ball)
    }
    this.elementControl()
  }

  elementControl = () => {
    this.registerAction('a', () => {
      const paddle = this.elementDict['paddle']
      paddle.move('x', 'back')
    })
    this.registerAction('d', () => {
      const paddle = this.elementDict['paddle']
      paddle.move('x')
    })
  }

  setBallObstacles = () => {
    if (this.npcDict.ball) {
      this.npcDict.ball.obstacles = Object.values(this.elementDict)
    }
  }

  draw = () => {
    this.drawBase()
    this.setBallObstacles()
    if (this.npcDict.ball.status === 'die') {
      this.status = 'over'
    }
    this.fraction = Object.values(this.elementDict).filter(item => item.status === 'die').length
  }
}
