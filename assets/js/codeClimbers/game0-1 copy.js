const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
    }
}

class Platform {
    constructor({ x, y }) {
        this.position = {
            x,
            y
        }

        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle = "blue"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
const platforms = [
    new Platform({
    x: 200, 
    y:100,
}), new Platform({
    x: 500,  
    y: 200,
}), new Platform({
    x: -1,
    y: 416,
}), new Platform({
    x: 899,
    y: 416,
})
]

const keys = {
    right: {
        pressed: false
    }  ,
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    platforms.forEach((platform) => {
        platform.draw()
    })

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
    player.velocity.x = 0
        
        if (keys.right.pressed) {
            platforms.forEach((platform) => {
                platform.position.x -= 5
                scrollOffset += 5
            })
            console.log("rightplat")
        } else if (keys.left.pressed) {
            platforms.forEach((platform) => {
                platform.position.x += 5
                scrollOffset -= 5
            })
            console.log("leftplat")
        }
    }

    console.log(scrollOffset)

    //platform collision
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y && 
            player.position.x + player.width >= platform.position.x && 
            player.position.x <= platform.position.x + platform.width
        ){
            player.velocity.y = 0
            console.log("stop")
        }
    })

    if (scrollOffset > 2000) {
        console.log("win")
    }
}

animate()

addEventListener("keydown", ({ keyCode }) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = true
            break

        case 83:
            console.log("down")
            break

        case 68:
            console.log("right")
            keys.right.pressed = true
            break
        
        case 87:
            console.log("up")
            player.velocity.y -= 15
            break
    }
})

addEventListener("keyup", ({ keyCode }) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = false
            break

        case 83:
            console.log("down")
            break

        case 68:
            console.log("right")
            keys.right.pressed = false
            break
        
        case 87:
            console.log("up")
            player.velocity.y -= 20
            break


    }
})