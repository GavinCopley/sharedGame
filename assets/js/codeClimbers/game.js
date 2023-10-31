const roadImage = document.getElementById("roadImage");

const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024;
canvas.height = 576;

const gravity = 1

class Player {
    constructor() {
        this.speed = 6
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
        this.image = spriteRight
        this.frames = 0
        this.sprites = {
            right: spriteRight,
            left: spriteLeft
        };

        this.currentSprite = this.sprites.right;
        this.frameDelay = 0;
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            30 * this.frames,
            0,
            30,
            30,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update() {
        this.frameDelay++
        if (this.frameDelay === 10) {
            this.frames++
        }
        if (this.frameDelay > 10) {
            this.frameDelay = 0
        }
        if (this.frames >= 8) {
            this.frames = 0;
        }
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
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

let player = new Player()

let platforms = []
let genericObjects = []

const keys = {
    right: {
        pressed: false
    }  ,
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function init() {
    player = new Player()
    platforms = [
        new Platform({
        x: 200, 
        y:250,
        image: roadImage
    }), new Platform({
        x: 500,  
        y:200,
        image: roadImage,
    }), new Platform({
        x: 800,  
        y: 250,
        image: roadImage,
    }), new Platform({
        x: 900,  
        y: 250,
        image: roadImage,
    }), new Platform({
        x: -1,
        y: 416,
        image: floorImage,
    }), new Platform({
        x: 1300,
        y: 416,
        image: floorImage,
    })
    ]

    genericObjects = [
        new GenericObject({
            x: 0,
            y: 0,
            image: backgroundImage
        }),
        new GenericObject({
            x: 1000,
            y: 0,
            image: backgroundImage
        }),
        new GenericObject({
            x: 0,
            y: -50,
            image: buildingImage
        }),
        new GenericObject({
            x: 1000,
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

    scrollOffset = 0
}

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
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0) 
    ) {
        player.velocity.x = -player.speed
    } else {
    player.velocity.x = 0
        
        if (keys.right.pressed) {
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
                scrollOffset += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
            console.log("rightplat")
        } else if (keys.left.pressed && scrollOffset > 0) {
            platforms.forEach((platform) => {
                platform.position.x += player.speed
                scrollOffset -= player.speed
            })
            console.log("leftplat")
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }
    }

    console.log(scrollOffset + "scrollOffset")

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
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0) 
    ) {
        player.velocity.x = -player.speed
    } else {
    player.velocity.x = 0
        
        if (keys.right.pressed) {
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
                scrollOffset += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
            console.log("rightplat")
        } else if (keys.left.pressed && scrollOffset > 0) {
            platforms.forEach((platform) => {
                platform.position.x += player.speed
                scrollOffset -= player.speed
            })
            console.log("leftplat")
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }
    }

    console.log(scrollOffset + "scrollOffset")

    // win
    if (scrollOffset > 2000) {
        console.log("win")
    }

    // lose
    if (player.position.y > canvas.height) {
        init()
        console.log("lose")
    }
}

init()
animate()

addEventListener("keydown", ({ keyCode }) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = true
            player.currentSprite = player.sprites.left
            break

        case 83:
            console.log("down")
            break

        case 68:
            console.log("right")
            keys.right.pressed = true
            player.currentSprite = player.sprites.right
            break
        
        case 32:
            console.log("up")
            if (player.canJump) {
                player.velocity.y = -25; //Apply the jump
                player.canJump = false; // Prevent double jumping
            }
        case 87:
            console.log("up")
            if (player.canJump) {
                player.velocity.y = -25; // Apply the jump
                player.canJump = false; // Prevent double jumping
                // 2 Jump Keys: W and Space
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
        
        case 32:
            console.log("up")
            player.velocity.y -= 0
            break
            
        case 87:
            console.log("up")
            player.velocity.y -= 0
            break
    }
})