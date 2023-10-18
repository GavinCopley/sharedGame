import GameEnv from './GameEnv.js';
import Character from './Character.js';

const RobotAnimation = {
    // Sprite properties
    scale: 2,
    width: 49,
    height: 44,
	d: { row: 0, frames: 7, idleFrame: { column: 1, frames: 0 } }, // Walk right with 'd' key
	a: { row: 1, frames: 7, idleFrame: { column: 1, frames: 0 } }, // Walk left with 'a' key
}

export class CharacterRobot extends Character{
    // constructors sets up Character object 
    constructor(robotCanvas, image, speedRatio){
        super(robotCanvas, 
            image, 
            speedRatio,
            RobotAnimation.width, 
            RobotAnimation.height, 
            RobotAnimation.scale
        );
        this.isIdle = true;
    }

    // Robot perform a unique update
    update() {
        if (this.frameY === RobotAnimation.a.row && !this.isIdle) {
            this.x -= this.speed;  // Move the robot to the left
        }
        else if (this.frameY === RobotAnimation.d.row && !this.isIdle){
            this.x += this.speed;
        }

        // Update animation frameX of the object
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }
    }
}

// Can add specific initialization parameters for the robot here
// In this case the robot is following the default character initialization
export function initRobot(canvasId, image, gameSpeed, speedRatio){
    // Create the Robot character
    var robot = new CharacterRobot(canvasId, image, gameSpeed, speedRatio);

    // Robot Frame position and Frame extents
    robot.setFrameY(RobotAnimation['a'].row);
    robot.setFrameX(RobotAnimation['a'].idleFrame.column)
    robot.setMaxFrame(RobotAnimation['a'].idleFrame.frames);

    // Robot Screen Position
    robot.setX(GameEnv.innerWidth);
    robot.setY(GameEnv.innerHeight / 1.5);

    /* Robot Control 
    * changes y value, the row in sprite
    * which changes animation to either idle, bark, walk
    * change number of frames in row
    */
    document.addEventListener('keydown', function (event) {
        if (RobotAnimation.hasOwnProperty(event.key)) {
            const selectedAnimation = event.key;
            robot.setFrameY(RobotAnimation[selectedAnimation].row);
            robot.setMaxFrame(RobotAnimation[selectedAnimation].frames);
            robot.isIdle = false;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (RobotAnimation.hasOwnProperty(event.key)) {
            // If no button is pressed then idle
            const selectedAnimation = event.key;
            robot.setFrameY(RobotAnimation[selectedAnimation].row);
            robot.setFrameX(RobotAnimation[selectedAnimation].idleFrame.column)
            robot.setMaxFrame(RobotAnimation[selectedAnimation].idleFrame.frames);
            robot.isIdle = true;
        }
    });

    // Robot Object
    return robot;
}

export default CharacterRobot;