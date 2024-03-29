let MiniJS = {
    Game: {
        Start: function(){},
        Update: function(){}
    },

    Console: {
        Log(str){
           console.log('MiniJS: ' + str);
        },
        Warn(str){
            console.warn('MiniJS: ' + str);
        },
        Error(str){
            console.error('MiniJS: ' + str);
        }
    },

    Loader: {
        total: 0,
        loaded: 0,
        assets: {},
        GetReady(){
            return this.total == this.loaded;
        },
        Load(name, data, type='text'){
            if(this.assets[name] != null) MiniJS.Console.Warn(`Asset with name [${name}] already exists.`);

            type = type.toLowerCase();

            if(type == 'jpeg' || type == 'jpg' || type == 'webp' || type == 'png' || type == 'apng' || type == 'tiff' || type == 'svg' || type == 'pdf' || type == 'xmb' || type == 'bmp' || type == 'ico') type = 'image';
            if(type == 'wav' || type == 'mp3' || type == 'ogg') type = 'audio';

            if(type == 'text'){
                this.assets[name] = { data, type };
                this.total++;
                this.loaded++;
            }else if(type == 'image'){
                let img = new Image();
                img.src = data;

                img.onload = () => this.loaded++;

                this.assets[name] = { data: img, type };

                this.total++;
            }else if(type == 'audio'){
                let aud = new Audio(data);

                this.loaded++;

                this.assets[name] = { data: aud, type };

                this.total++;
            }else{
                MiniJS.Console.Warn(`Asset type [${type}] is not recognized.`);
            }
        },
        Get(name){
            if(!this.assets[name]){
                Console.Error(`Asset with name [${name}] does not exist.`);
                return null;
            }

            return this.assets[name].data;
        }
    },

    ready: false,
    Run(w=600, h=450){
        if(!this.ready || !this.Loader.GetReady()){
            setTimeout(() => { MiniJS.Run(w, h); }, 25);
            return;
        }

        this.Renderer.Setup(w, h);
        this.UI.Setup(w, h);
        this.Input.Setup();
        this.Time.Setup();

        this.Game.Start();

        setInterval(() => {
            this.Renderer.Clear();
            this.Time.Update();
            
            this.Game.Update();

            this.Input.Clear();
        }, 0);
    },

    Renderer: {
        Setup(w, h){
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');

            this.width = w;
            this.height = h;

            document.body.appendChild(this.canvas);

            document.body.style = 'margin:0px;overflow:hidden;background-color:black;';
            this.canvas.style = 'position:absolute;transform:translate(50vw,50vh)translate(-50%,-50%);background-color:white;';

            this.Resize();
            window.onresize = () => this.Resize();
        },
        Resize(){
            if(window.innerWidth / this.width > window.innerHeight / this.height){
                this.canvas.width = window.innerHeight / this.height * this.width;
                this.canvas.height = window.innerHeight;

                this.scale = window.innerHeight / this.height;
            }else{
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerWidth / this.width * this.height;

                this.scale = window.innerWidth / this.width;
            }
        },
        Clear(){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        SetColor(r, g, b, a=255){
            this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a/255})`;
        },
        Rect(x, y, w, h, r=0){
            this.context.save();
            this.context.scale(this.scale, this.scale);
            this.context.translate(x+w/2, y+h/2);
            this.context.rotate(r/180*Math.PI);
            this.context.fillRect(-w/2, -h/2, w, h);
            this.context.restore();
        },
        Circle(x, y, r){
            this.context.save();
            this.context.scale(this.scale, this.scale);
            this.context.translate(x+r, y+r);
            this.context.beginPath();
            this.context.arc(0, 0, r, 0, Math.PI*2);
            this.context.fill();
            this.context.restore();
        },
        Image(img, x, y, w, h, r=0){
            this.context.save();
            this.context.scale(this.scale, this.scale);
            this.context.translate(x+w/2, y+h/2);
            this.context.rotate(r/180*Math.PI);
            this.context.drawImage(img, -w/2, -h/2, w, h);
            this.context.restore();
        }
    },

    UI: {
        Setup(w, h){
            this.context = MiniJS.Renderer.canvas.getContext('2d');

            this.width = w;
            this.height = h;

            this.alignment = { x: 'left', y: 'top' };

            this.SetColor(0, 0, 0);
            this.SetAlignment();
            this.SetFont();
        },
        SetColor(r, g, b, a=255){
            this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a/255})`;
        },
        SetFont(font='Arial', size=50){
            this.context.font = `${size*MiniJS.Renderer.scale}px ${font}`;
        },
        SetAlignment(x='left', y='top'){
            this.context.textAlign = x;
            this.context.textBaseline = (y == 'center' ? 'middle' : y);

            this.alignment = { x, y };
        },
        Text(text, x, y, max_width=-1){
            this.context.save();
            this.context.scale(MiniJS.Renderer.scale, MiniJS.Renderer.scale);
            this.context.translate(x, y);
            if(max_width == -1) this.context.fillText(text, 0, 0);
            else                this.context.fillText(text, 0, 0, max_width);
            this.context.restore();
        },
        Panel(x, y, w, h, r=0){
            if(this.alignment.x == 'left') x -= w;
            else if(this.alignment.x == 'center') x -= w/2.0;

            if(this.alignment.y == 'bottom') y -= h;
            else if(this.alignment.y == 'middle') y -= h/2.0;

            this.context.save();
            this.context.scale(this.scale, this.scale);
            this.context.translate(x+w/2, y+h/2);
            this.context.rotate(r/180*Math.PI);
            this.context.fillRect(-w/2, -h/2, w, h);
            this.context.restore();
        }
    },

    Input: {
        keys: {},
        key_downs: {},
        key_ups: {},
        mouse: {x:0,y:0},
        Setup(){
            document.addEventListener('keydown', (e) => {
                let key = e.key;

                this.keys[key] = true;
                this.key_downs[key] = true;
            });

            document.addEventListener('keyup', (e) => {
                let key = e.key;

                this.keys[key] = false;
                this.key_ups[key] = true;
            });

            document.addEventListener('mousemove' ,(e) => {
                let boundingRect = MiniJS.Renderer.canvas.getBoundingClientRect();
    
                this.mouse.x = (e.clientX - boundingRect.x) / MiniJS.Renderer.scale;
                this.mouse.y = (e.clientY - boundingRect.y) / MiniJS.Renderer.scale;
            });
        },
        Clear(){
            this.key_downs = {};
            this.key_ups = {};
        },
        GetMouseX(){
            return this.mouse.x;
        },
        GetMouseY(){
            return this.mouse.y;
        },
        KeyDown(key){
            if(!this.key_downs[key]) return false;
            return this.key_downs[key];
        },
        KeyUp(key){
            if(!this.key_ups[key]) return false;
            return this.key_ups[key];
        },
        KeyPressed(key){
            if(!this.keys[key]) return false;
            return this.keys[key];
        },
        CreateAxis(min_key, max_key, min_2=null, max_2=null){
            let out = 0;
            if(this.KeyPressed(min_key)) out--;
            if(this.KeyPressed(max_key)) out++;
            if(min_2 && this.KeyPressed(min_2)) out--;
            if(max_2 && this.KeyPressed(max_2)) out++;
            if(out > 1) out = 1;
            if(out < -1) out = -1;
            return out;
        }
    },

    Time: {
        last_time: 0,
        current_time: 0,
        initial_time: 0,
        elapsed_time: 0,
        dt: 0,
        Setup(){
            this.initial_time = (performance.now()) / 1000.0;
            this.last_time = this.initial_time;
        },
        Update(){
            this.current_time = (performance.now()) / 1000.0;

            this.dt = this.current_time - this.last_time;

            this.last_time = this.current_time;

            this.elapsed_time = (performance.now()) / 1000.0 - this.initial_time;
        },
        GetTime(){
            return this.elapsed_time;
        },
        GetDeltaTime(){
            if(this.dt == 0.0) return 0.01;
            return this.dt;
        }
    },

    Math: {
        Vector(x=0, y=0){
            return { x, y };
        },
        Normalize(vec){
            let d = Math.sqrt(vec.x*vec.x+vec.y*vec.y);
            if(d == 0) return { x: 0, y: 0 };
            return { x: vec.x/d, y: vec.y/d };
        },
        Distance(vec1, vec2){
            let dx = vec2.x - vec1.x;
            let dy = vec2.y - vec1.y;
            return Math.sqrt(dx*dx+dy*dy);
        },
        DistanceSquared(vec1, vec2){
            let dx = vec2.x - vec1.x;
            let dy = vec2.y - vec1.y;
            return Math.abs(dx*dx+dy*dy);
        },
        Add(vec, flt){
            if(typeof(flt) == typeof(0.0)) return { x: vec.x+flt, y: vec.y+flt };
            else return { x: vec.x+flt.x, y: vec.y+flt.y };
        },
        Sub(vec, flt){
            if(typeof(flt) == typeof(0.0)) return { x: vec.x-flt, y: vec.y-flt };
            else return { x: vec.x-flt.x, y: vec.y-flt.y };
        },
        Mult(vec, flt){
            if(typeof(flt) == typeof(0.0)) return { x: vec.x*flt, y: vec.y*flt };
            else return { x: vec.x*flt.x, y: vec.y*flt.y };
        },
        Div(vec, flt){
            if(typeof(flt) == typeof(0.0)) return { x: vec.x/flt, y: vec.y/flt };
            else return { x: vec.x/flt.x, y: vec.y/flt.y };
        },
        Dot(vec1, vec2){
            return vec1.x*vec2.x + vec1.y*vec2.y;
        }
    },

    Physics: {
        AABBAABB(x1, y1, w1, h1, x2, y2, w2, h2){
            return x1 < x2 + w2 && y1 < y2 + h2 && x1 + w1 > x2 && y1 + h1 > y2;
        },
        CircleCircle(x1, y1, r1, x2, y2, r2){
            return MiniJS.Math.DistanceSquared({ x: x1, y: y1 }, { x: x2, y: y2 }) < (r1 + r2) * (r1 + r2);
        },
        AABBCircle(x1, y1, w1, h1, x2, y2, r2){
            let testX = x2;
            let testY = y2;

            if(x2 < x1) textX = x1;
            else if(x2 > x1+w1) testX = x1+w1;
            if(y2 < y1) textY = y1;
            else if(y2 > y1+h1) testY = y1+h1;

            let dx = x2-testX;
            let dy = y2-testY;
            let d = dx*dx + dy*dy;

            return d < r2*r2;
        }
    },

    Audio: {
        Play(sound, settings={}){
            sound.loop = settings.loop || false;
            sound.volume = settings.volume || 1.0;
            this.Stop(sound, settings);
            sound.play();
        },
        Pause(sound, settings={}){
            if(sound.paused) return;
            sound.pause();
        },
        Stop(sound, settings={}){
            if(sound.paused) return;
            sound.pause();
            sound.currentTime = 0;
        }
    }
};

window.onload = () => {
    MiniJS.ready = true;
};
