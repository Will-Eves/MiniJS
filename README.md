# MiniJS

**MiniJS** is an ultra-lightweight **Javascript** game framework.

To include **MiniJS** in your project:

1. Download the **mini.min.js** file
2. Move the **mini.min.js** file into your project folder
3. Add the **mini.min.js** script to your **index.html** file like this:

```html
<script src="mini.min.js">
```

## Quick Nav

[Quick Start](#basics)

[The Run Function](#the-run-function)

[The Game Class](#the-game-class)

[The Loader Class](#the-loader-class)

[The Renderer Class](#the-renderer-class)

[The UI Class](#the-ui-class)

[The Input Class](#the-input-class)

[The Time Class](#the-time-class)

[The Math Class](#the-math-class)

[The Physics Class](#the-physics-class)

[The Audio Class](#the-audio-class)

## Quick Start

The basic skeleton of a **MiniJS** Game could look like this:

```javascript
MiniJS.Game.Start = function(){
    // runs once in the start of the game
};

MiniJS.Game.Update = function(){
    // runs once every frame
};

MiniJS.Run(600 /* Window Size X */, 450 /* Window Size Y */);
```

Of course, your game may want more than just a blank window, so basic rendering would look like this:

```javascript
MiniJS.Game.Start = function(){
    // runs once in the start of the game
};

MiniJS.Game.Update = function(){
    // runs once every frame

    MiniJS.Renderer.SetColor(
        255, // Color R Value
        0,   // Color G Value
        0    // Color B Value
    ); // Set Color to Red
    MiniJS.Renderer.Rect(
        10,  // Rectangle X Position
        10,  // Rectangle Y Position
        100, // Rectangle Width
        100  // Rectangle Height
    );
};

MiniJS.Run(600 /* Window Size X */, 450 /* Window Size Y */);
```

Oh, you have some art and sounds that you want to use in your game? No problem.
Loading and using images and audio would look like this:

```javascript
// Load player.png into the game as an image
MiniJS.Loader.Load('My Epic Player Art', 'player.png',    'image');

// Load soundtrack.mp3 into the game as audio
MiniJS.Loader.Load('My Epic Soundtrack',  'soundtrack.mp3', 'audio');

MiniJS.Game.Start = function(){
    // runs once in the start of the game

    const audio_settings = {
        loop: true, // Determines if The Audio will Loop
        volume: 0.3 // Determines the Volume of The Audio (0.0 - 1.0) 
    };

    MiniJS.Audio.Play(
        MiniJS.Loader.Get('My Epic Soundtrack'), // The Audio
        audio_settings                           // The Audio Settings
    );
};

MiniJS.Game.Update = function(){
    // runs once every frame

    MiniJS.Renderer.Image(
        MiniJS.Loader.Get('My Epic Player Art'), // The Sprite
        10,                                      // The Image X Position
        10,                                      // The Image Y Position
        100,                                     // The Image Width
        100                                      // The Image Height
    );
};

// Will only run the game after everything has loaded
MiniJS.Run(600 /* Window Size X */, 450 /* Window Size Y */);
```

Now your game is well on it's way to being a huge hit! Except for the fact that it isn't a game yet, becuase the player can't do anything. Again, that's not a problem, some simple keyboard input would look like this:

```javascript
let player_x = 0;
let player_y = 0;

const player_speed = 5;

MiniJS.Game.Start = function(){
    // runs once in the start of the game
};

MiniJS.Game.Update = function(){
    // runs once every frame

    if(MiniJS.Input.KeyPressed('a')) // Check if The A Key is Pressed
        player_x -= player_speed;    // Change player_x by -player_speed

    if(MiniJS.Input.KeyPressed('d')) // Check if The D Key is Pressed
        player_x += player_speed;    // Change player_x by +player_speed

    if(MiniJS.Input.KeyPressed('s')) // Check if The S Key is Pressed
        player_y += player_speed;    // Change player_y by +player_speed

    if(MiniJS.Input.KeyPressed('w')) // Check if The W Key is Pressed
        player_y -= player_speed;    // Change player_y by -player_speed
    
    MiniJS.Renderer.SetColor(0, 0, 255); // The Player Color
    MiniJS.Renderer.Rect(
        player_x, // The Player X
        player_y, // The Player Y
        100,      // The Player Width
        100       // The Player Height
    );
};

MiniJS.Run(600 /* Window Size X */, 450 /* Window Size Y */);
```

## Full Documentation

### The Run Function

The **Run** function tells **MiniJS** to run the game. It also sets the requested width and height of the game window in pixels. Calling it looks like this:

```javascript
MiniJS.Run(600 /* Window Size X */, 450 /* Window Size Y */);
```

### The Game Class

The **Game** class contains the Start and Update functions that can be used to create your game. These functions are meant to be overrided, like this:

```javascript
MiniJS.Game.Start = function(){
    // runs once in the start of the game
};

MiniJS.Game.Update = function(){
    // runs once every frame
};
```

### The Loader Class

The **Loader** class loads assets into the game. The game won't start until all of the assets in the **Loader** class are loaded.

You can load an asset like this:

```javascript
MiniJS.Loader.Load(
    'My Asset',  // The Asset Name
    'asset.png', // The Asset Filepath
    'image'      // The Asset Type
);
```

And you can get the asset data like this:

```javascript
MiniJS.Loader.Get(
    'My Asset' // The Asset Name
);
```

There are **3** different asset types: **image**, **audio**, and **text**. Other asset types are not supported (yet).

### The Renderer Class

The **Renderer** class is responsible for the game rendering. It can draw rectangles, circles, and images. You can also set the color of what you draw.

You can set the render color like this:

```javascript
MiniJS.Renderer.SetColor(50 /* The Red Value */, 70 /* The Green Value */, 255 /* The Blue Value */);
```

You can draw a rectangle like this:

```javascript
MiniJS.Renderer.Rect(
    10,  // The X Position
    10,  // The Y Position
    100, // The Width
    100, // The Height
    45   // The Rotation in Degrees (Defaults to 0)
);
```

You can draw a circle like this:

```javascript
MiniJS.Renderer.Circle(
    50, // The X Position
    50, // The Y Position
    50  // The Radius
);
```

You can draw an image like this:

```javascript
let img = MiniJS.Loader.Load('My Image');

MiniJS.Renderer.Image(
    img, // The Image
    10,  // The X Position
    10,  // The Y Position
    100, // The Width
    100, // The Height
    60   // The Rotation in Degrees (Defaults to 0)
);
```

### The UI Class

The **UI** class is responsible for the ui rendering. It can draw text and panels. You can also set the color, font, and alignment of what you draw.

You can set the ui color like this:

```javascript
MiniJS.UI.SetColor(50 /* The Red Value */, 70 /* The Green Value */, 255 /* The Blue Value */);
```

You can set the ui font like this:

```javascript
MiniJS.UI.SetFont('Arial' /* The Font */, 50 /* The Fontsize in Pixels */);
```

You can set the ui alignment like this:

```javascript
MiniJS.UI.SetAlignment('center' /* The X Alignment */, 'center' /* The Y Alignment */);
```

There are 3 X alignments and 3 Y alignments. The 3 X alignments are: **left**, **center**, and **right**. The 3 Y alignments are: **top**, **center**, and **bottom**.

You can draw text like this:

```javascript
const text = 'MiniJS is the coolest Javascript Game Framework ever!';

MiniJS.UI.Text(
    text, // The Text,
    50,   // The X Position,
    50,   // The Y Position,
    10    // The Maximum character count before Wrapping (Defaults to Infinity)
);
```

You can draw a panel like this:

```javascript
MiniJS.UI.Panel(
    10,  // The X Position
    10,  // The Y Position
    100, // The Width
    100, // The Height
    45   // The Rotation in Degrees (Defaults to 0)
);
```

### The Input Class

The **Input** class collects keyboard and mouse input.

You can get the mouse position like this:

```javascript
let mouse_x = MiniJS.Input.GetMouseX();
let mouse_y = MiniJS.Input.GetMouseY();
```

You can get when a key goes down like this:

```javascript
let w_key_down = MiniJS.Input.KeyDown('w');
```

You can get when a key is constantly pressed like this:

```javascript
let w_key_pressed = MiniJS.Input.KeyPressed('w');
```

You can get when a key goes up like this:

```javascript
let w_key_up = MiniJS.Input.KeyUp('w');
```

You can also create a custom axis like this:

```javascript
let axis_value = MiniJS.Input.CreateAxis('a', 'd');
```

This function will return a value between **-1.0** and **1.0** depending on the **KeyPressed** value of the two keys.

### The Time Class

The **Time** class is used to tell the time inside of your **MiniJS** game.

You can get the time since the game started like this:

```javascript
let seconds_elapsed = MiniJS.Time.GetTime();
```

This function returns the time in seconds since the game has started.

You can get the time since the last frame like this:

```javascript
let delta_time = MiniJS.Time.GetDeltaTime();
```

This function returns the **DeltaTime** since the last frame.

### The Math Class

The **Math** class contains many useful vector math functions.

You can create a **2D Vector** like this:

```javascript
let vec = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);
```

You can normalize a **2D Vector** like this:

```javascript
let vec = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let normalized_vec = MiniJS.Math.Normalize(vec /* The 2D Vector to Normalize */);
```

You can get the distance between two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let distance = MiniJS.Math.Distance(vec_1, vec_2);
```

You can get the squared distance between two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let distance_squared = MiniJS.Math.DistanceSquared(vec_1, vec_2);
```

You can add two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let final_vec = MiniJS.Math.Add(vec_1, vec_2);
```

You can subtract two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let final_vec = MiniJS.Math.Sub(vec_1, vec_2);
```

You can multiply two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let final_vec = MiniJS.Math.Mult(vec_1, vec_2);
```

You can divide two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let final_vec = MiniJS.Math.Div(vec_1, vec_2);
```

You can get the dot product between two **2D Vectors** like this:

```javascript
let vec_1 = MiniJS.Math.Vector(5 /* The X Coordinate */, -2 /* The Y Coordinate */);

let vec_2 = MiniJS.Math.Vector(1 /* The X Coordinate */,  3 /* The Y Coordinate */);

let dot_product = MiniJS.Math.Dot(vec_1, vec_2);
```

### The Physics Class

The **Physics** class can detect collisions between two objects.

You can detect collision between two **AABB** colliders like this:

```javascript
const x1,y1 = 0;
const w1,h1 = 100;

const x2,y2 = 50;
const w2,h2 = 100;

let collision = MiniJS.Physics.AABBAABB(
    x1, // The X Position of The First AABB
    y1, // The Y Position of The First AABB
    w1, // The Width of The First AABB
    h1, // The Height of The First AABB

    x2, // The X Position of The Second AABB
    y2, // The Y Position of The Second AABB
    w2, // The Width of The Second AABB
    h2  // The Height of The Second AABB
);
```

You can detect collision between two **Circle** colliders like this:

```javascript
const x1,y1 = 0;
const r1 = 50;

const x2,y2 = 50;
const r2 = 75;

let collision = MiniJS.Physics.CircleCircle(
    x1, // The X Position of The First Circle
    y1, // The Y Position of The First Circle
    r1, // The Radius of The First Circle

    x2, // The X Position of The Second Circle
    y2, // The Y Position of The Second Circle
    r2  // The Radius of The Second Circle
);
```

You can detect collision between an **AABB** collider and a **Circle** collider like this:

```javascript
const x1,y1 = 0;
const w,h = 100;

const x2,y2 = 140;
const r = 50;

let collision = MiniJS.Physics.AABBCircle(
    x1, // The X Position of The AABB
    y1, // The Y Position of The AABB
    w,  // The Width of The AABB
    h,  // The Height of The AABB

    x2, // The X Position of The Circle
    y2, // The Y Position of The Circle
    r   // The Radius of The Circle
);
```

### The Audio Class

The **Audio** class can play, pause, and stop audio in your **MiniJS** game.

You can play audio like this:

```javascript
// Get The Audio from The Loader
let sound = MiniJS.Loader.Load('My Sound');

// Create a Settings object
const settings = {
    loop: false, // Determines if the sound loops
    volume: 0.5  // Determines the volume of the sound
};

MiniJS.Audio.Play(sound, settings /* Defaults to: loop = false, volume = 1.0 */);
```

You can pause audio like this:

```javascript
// Get The Audio from The Loader
let sound = MiniJS.Loader.Load('My Sound');

MiniJS.Audio.Pause(sound);
```

You can stop audio like this:

```javascript
// Get The Audio from The Loader
let sound = MiniJS.Loader.Load('My Sound');

MiniJS.Audio.Stop(sound);
```

The reason there is both a **Pause** and **Stop** function is that the pause function does not reset the audio time, and the stop function does reset the audio time.
