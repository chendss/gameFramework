class BaseGame {
	/**
	 *
	 * @param {object} canvas 实例
	 * @memberof BaseGame
	 */
  constructor(canvas) {
    this.sceneDict = {}
    this.context = canvas.getContext('2d')
    this.canvas = canvas
    this.runPointer = null
    this.sceneKey = 'start'
    this.actions = {}
    this.runStatus = true
    this.context.fillStyle = 'red'
    this.extraTitle = {
      start: '',
      end: ''
    }
    this.createScene()
    this.bindGameControl()
  }

  static new (canvas) {
    const g = new this(canvas)
    g.init()
    g.startAndEndScene()
    return g
  }

  get status () {
    // wait-等待开始,ing-进行中 over-游戏结束 游戏状态
    const dict = {
      start: 'wait',
      end: 'over'
    }
    return dict[this.sceneKey] || 'ing'
  }

  get scene () {
    return this.sceneDict[this.sceneKey]
  }

  get gameSpeed () {
    return 1000 / config.fps
  }

  startAndEndScene = () => {
    log('popop', this)
    this.sceneDict.start = new GameTitle(this.canvas)
    this.sceneDict.start.title = `按k开始游戏${this.extraTitle.start}`
    this.sceneDict.end = new GameTitle(this.canvas)
    this.sceneDict.end.title = `游戏结束，按r重新开始游戏${this.extraTitle.end}`
  }

  bindGameControl = () => {
    bindDown(' ', this.toggleGame)
  }

  changeScene = sceneKey => {
    this.sceneKey = sceneKey
    for (let scene of Object.values(this.sceneDict)) {
      scene.reset()
    }
    this.sceneDict[sceneKey].status = 'ing'
  }

  toggleGame = () => {
    if (config.debug === false) return
    this.runStatus = !this.runStatus
  }

	/**
	 * 注册游戏控制场景的逻辑
	 *
	 * @memberof BaseScene
	 */
  registerAction = (key, callback) => {
    this.actions[key] = callback
  }

  clearReact = () => {
    const context = this.context
    const canvas = this.canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  drawBase = () => {
    if (this.scene == null) return
    if (this.scene.status === 'over') {
      this.changeScene('end')
    }
    this.scene.draw()
  }

  interruptRun = () => {
    const classList = this.canvas.classList
    if (this.canvas == null || classList.contains('none')) {
      return true
    } else if (this.runStatus === false) {
      return true
    }
    return false
  }

  run = () => {
    if (!this.interruptRun()) {
      this.clearReact()
      this.drawBase()
      this.draw && this.draw()
    }
    this.__start()
  }

  __start = () => {
    this.runPointer = setTimeout(this.run, this.gameSpeed)
  }

  loadScene = async () => {
    for (let scene of Object.values(this.sceneDict)) {
      await scene.init()
    }
  }

  init = async () => {
    await this.loadScene()
    this.__start()
  }
}
