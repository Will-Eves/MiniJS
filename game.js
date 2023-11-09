MiniJS.Loader.Load('little', 'littlepew.wav', 'audio');
MiniJS.Loader.Load('big', 'bigpew.wav', 'audio');

let px = 600/2-15;
let py = 450/2-15;
let pspeed = 175;
let plives = 3;
let pdead = false;

let bullets = [];
let bullet_time = 0;
let bullet_spacing = 1.5;
let bullet_speed = 275;

let lasers = [];
let laser_time = 0;
let laser_spacing = 3.0;
let laser_speed = 2.0;

let game_time = 0;

// if time is greater than wave, set wave to that index
let waves = [-1, 15, 30, 45, 60, 75, 90];
let wave = 0; // waves go from 0-7

MiniJS.Game.Start = function(){
    // runs once in the start of the game
};

MiniJS.Game.Update = function(){
    // show current game time
    if(!pdead){
        game_time = MiniJS.Time.GetTime();

        MiniJS.UI.SetColor(0, 0, 0, 100);
        MiniJS.UI.SetFont('Arial', 35);
        MiniJS.UI.SetAlignment('center', 'center');
        MiniJS.UI.Text('Wave ' + wave, 600/2, 450/2);

        MiniJS.UI.SetColor(0, 0, 0, 100);
        MiniJS.UI.SetFont('Arial', 20);
        MiniJS.UI.SetAlignment('center', 'top');
        MiniJS.UI.Text(game_time.toFixed(2), 600/2, 450/2 + 35/2);

        MiniJS.UI.SetAlignment('center', 'bottom');
        MiniJS.UI.Text('Lives: ' + plives, 600/2, 450/2 - 35/2);
    }

    // wave management
    for(let i = 0; i < waves.length; i++){
        if(game_time > waves[i]) wave = i+1;
    }

    if(wave == 1){
        laser_time = 0;
        bullet_spacing = 1.0;
    }else if(wave == 3){
        bullet_spacing = 0.7;
        laser_spacing = 2.0;
    }else if(wave == 4){
        bullet_spacing = 0.6;
        laser_spacing = 1.5;
    }else if(wave == 5){
        bullet_speed = 325;
        laser_speed = 1.25;
        laser_spacing = 1.0;
    }else if(wave == 6){
        bullet_spacing = 0.45;
        laser_spacing = 0.8;
    }else if(wave == 7){
        bullet_spacing = 0.3;
        laser_spacing = 0.6;
    }

    // move player
    let axis = MiniJS.Math.Vector(
        MiniJS.Input.CreateAxis('a', 'd', 'ArrowLeft', 'ArrowRight'),
        MiniJS.Input.CreateAxis('s', 'w', 'ArrowDown', 'ArrowUp')
    );
    axis = MiniJS.Math.Normalize(axis);
    axis = MiniJS.Math.Mult(axis, pspeed * MiniJS.Time.GetDeltaTime());

    px += axis.x;
    py -= axis.y;

    if(px < 0) px = 0;
    if(px > 570) px = 570;
    if(py < 0) py = 0;
    if(py > 420) py = 420;

    px = MiniJS.Input.GetMouseX();
    py = MiniJS.Input.GetMouseY();

    // update bullets
    bullet_time += MiniJS.Time.GetDeltaTime();
    if(bullet_time > bullet_spacing){
        bullet_time = 0;

        if(Math.random() < 0.5){
            if(Math.random() < 0.5) bullets.push([ Math.random() * 585, -15, 0, bullet_speed, 0 ]);
            else bullets.push([ Math.random() * 585, 450, 0, -bullet_speed, 0 ]);
        }else{
            if(Math.random() < 0.5) bullets.push([ -15, Math.random() * 435, bullet_speed, 0, 0 ]);
            else bullets.push([ 600, Math.random() * 435, -bullet_speed, 0, 0 ]);
        }

        MiniJS.Audio.Play(MiniJS.Loader.Get('little'));
    }

    for(let i = 0; i < bullets.length; i++){
        let bullet = bullets[i];

        bullet[0] += bullet[2] * MiniJS.Time.GetDeltaTime();
        bullet[1] += bullet[3] * MiniJS.Time.GetDeltaTime();

        bullet[4] += MiniJS.Time.GetDeltaTime();

        if(bullet[4] > 650 / bullet_speed){
            bullets.splice(i, 1);
            i--;
            continue;
        }

        if(MiniJS.Physics.AABBAABB(px, py, 30, 30, bullet[0], bullet[1], 15, 15)){
            // collide with player
            plives--;
            if(plives <= 0) pdead = true;

            bullets.splice(i, 1);
            i--;
            continue;
        }

        MiniJS.Renderer.SetColor(255, 0, 0);
        MiniJS.Renderer.Rect(bullet[0], bullet[1], 15, 15);
    }

    // update lasers
    laser_time += MiniJS.Time.GetDeltaTime();
    if(laser_time > laser_spacing){
        laser_time = 0;

        if(Math.random() < 0.5) lasers.push([ Math.random() * 585, 0, 15, 450, 0, false ]);
        else lasers.push([ 0, Math.random() * 435, 600, 15, 0, false ]);
    }

    for(let i = 0; i < lasers.length; i++){
        let laser = lasers[i];

        laser[4] += MiniJS.Time.GetDeltaTime();

        if(laser[4] > laser_speed+0.75){
            lasers.splice(i, 1);
            i--;
            continue;
        }else if(laser[4] > laser_speed){
            // pew pew

            if(!laser[5]){
                MiniJS.Audio.Play(MiniJS.Loader.Get('big'));
            }

            laser[5] = true;

            MiniJS.Renderer.SetColor(255, 0, 0);
            MiniJS.Renderer.Rect(laser[0], laser[1], laser[2], laser[3]);

            if(MiniJS.Physics.AABBAABB(px, py, 30, 30, laser[0], laser[1], laser[2], laser[3])){
                // collide with player
                plives--;
                if(plives <= 0) pdead = true;

                lasers.splice(i, 1);
                i--;
                continue;
            }
        }else{
            // draw outline

            MiniJS.Renderer.SetColor(255, 0, 0, 100);
            MiniJS.Renderer.Rect(laser[0], laser[1], laser[2], laser[3]);
        }
    }

    // draw player
    if(!pdead){
        MiniJS.Renderer.SetColor(0, 50, 255);
        MiniJS.Renderer.Rect(px, py, 30, 30);
    }

    // draw UI
    if(pdead){
        MiniJS.UI.SetColor(0, 0, 0);
        MiniJS.UI.SetFont('Arial', 50);
        MiniJS.UI.SetAlignment('center', 'center');
        MiniJS.UI.Text('Dead', 600/2, 450/2);

        MiniJS.UI.SetFont('Arial', 30);
        MiniJS.UI.SetAlignment('center', 'top');
        MiniJS.UI.Text('Wave ' + wave, 600/2, 450/2+25);
    }
};

MiniJS.Run(600, 450);