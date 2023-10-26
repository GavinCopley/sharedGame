const roadImage = document.getElementById("roadImage");

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

        this.canJump = true;
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
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image

        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image

        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const image = new Image()
image.src = roadImage

const player = new Player()
const platforms = [
    new Platform({
    x: 200, 
    y:100,
    image: roadImage
}), new Platform({
    x: 500,  
    y:200,
    image: roadImage,
}), new Platform({
    x: -1,
    y: 416,
    image: floorImage,
}), new Platform({
    x: 899,
    y: 416,
    image: floorImage,
})
]

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: backgroundImage
    }),
    new GenericObject({
        x: 0,
        y: -50,
        image: buildingImage
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

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    player.update()
    platforms.forEach((platform) => {
        platforms.forEach((platform) => {
            if (
                player.position.y + player.height <= platform.position.y &&
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width
            ) {
                player.velocity.y = 0;
                player.position.y = platform.position.y - player.height; // Ensure the player rests on top of the platform
                player.canJump = true; // Reset the canJump flag when landing on a platform
            }
        });
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
            if (player.canJump) {
                player.velocity.y = -25; // Apply the jump
                player.canJump = false; // Prevent double jumping
            }
            break;
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
            player.velocity.y -= 0
            break
    }
})