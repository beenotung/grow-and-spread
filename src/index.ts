const { random, floor, abs } = Math

const R = 0
const G = 1
const B = 2
const A = 3

const FULL = 255

let win = window as any
win.batch = 50000
win.pixel = 2

let main = document.querySelector('main') as HTMLElement
let canvas = document.querySelector('canvas') as HTMLCanvasElement

let currentVersion = 0
function init() {
  currentVersion++
  const selfVersion = currentVersion
  const PIXEL: number = win.pixel
  const rect = canvas.getBoundingClientRect()
  const W = (canvas.width = floor(rect.width / PIXEL))
  const H = (canvas.height = floor(rect.height / PIXEL))
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  if (!context) {
    main.textContent = '2D canvas is not supported'
    return
  }
  main.textContent = ''
  const imageData = context.getImageData(0, 0, W, H)

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + A] = FULL
  }

  function xy2i(x: number, y: number) {
    return (x + y * W) * 4
  }

  function forEachPeer(
    x: number,
    y: number,
    eachFn: (x: number, y: number) => void,
  ) {
    for (let dy of [-1, 0, 1]) {
      let yPeer = y + dy
      if (yPeer < 0 || yPeer >= H) continue
      for (let dx of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue
        let xPeer = x + dx
        if (xPeer < 0 || xPeer >= W) continue
        eachFn(xPeer, yPeer)
      }
    }
  }

  canvas.onclick = e => {
    let x = floor(e.clientX / PIXEL)
    let y = floor(e.clientY / PIXEL)
    let i = xy2i(x, y)
    imageData.data[i + R] = FULL
    imageData.data[i + G] = 0
  }

  function tick(): 'break' | void {
    let x = floor(random() * W)
    let y = floor(random() * H)
    let i = xy2i(x, y)
    let r = imageData.data[i + R]
    let g = imageData.data[i + G]

    // light fire
    // if (g === FULL) {
    //   imageData.data[i + R] = FULL
    //   imageData.data[i + G] = 0
    //   return
    // }

    // spread fire
    if (r > FULL * 0.7) {
      forEachPeer(x, y, (x, y) => {
        let i = xy2i(x, y)
        // burn peer
        if (imageData.data[i + G] > FULL * 0.8) {
          imageData.data[i + R] = FULL
          imageData.data[i + G] = 0
        }
      })
    }

    // grow grass
    if (g < FULL) {
      g = floor((g + 1) * 1.1)
      if (g >= FULL) g = FULL
      imageData.data[i + G] = g
    }

    // lim fire
    if (r > 0) {
      r = floor(r * 0.95)
      imageData.data[i + R] = r
    }
  }

  function render() {
    if (selfVersion !== currentVersion) return

    if (win.pixel !== PIXEL) {
      init()
      return
    }

    for (let i = 0; i < win.batch; i++) {
      let res = tick()
      if (res === 'break') {
        break
      }
    }

    context.putImageData(imageData, 0, 0)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
init()
window.addEventListener('resize', init)
