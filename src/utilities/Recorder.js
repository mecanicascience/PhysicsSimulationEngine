class pSRecorder {
    /** Automatically called @see the instance at _pSimulationInstance.recorder */
    constructor() {
        this.name             = 'Canvas-Recorder';
        this.id               = 0;
        this.pixelDatas       = [];
        this.registeringTimes = [];

        this.setup(30, 120, true);
    }

    /**
    * Automatically called
    * @param drawingFPS FPS of the final video
    * @param updateFPS  FPS for every calculations done on the update() loop
    * @param frameBlocker true by default : will make sure video is really turning at drawingFPS
    */
    setup(drawingFPS, updateFPS, frameBlocker) {
        this.width        = canvas.width;
        this.height       = canvas.height;
        this.pixelDensity = pixelDensity;
        this.frameBlocker = frameBlocker;
        this.drawingFPS   = drawingFPS;
        this.updateFPS    = updateFPS;
        this.running      = false;
        this.pauseMode    = false;
        this.currentRelT  = 0;
        this.lastDrawTime = 0;
    }

    /**
    * Start a new recording session
    * @param drawingFPS FPS of the final video (default 30)
    * @param updateFPS  FPS for every calculations done on the update() loop (default 120)
    * @param frameBlocker will make sure video is really turning at drawingFPS (default true)
    * @param clearPixelArray will clear the last datas of previous recording session (default true)
    */
    start(drawingFPS = 30, updateFPS = 120, frameBlocker = true, clearPixelArray = true) {
        this.setup(drawingFPS, updateFPS, frameBlocker);

        if (clearPixelArray) {
            this.pixelDatas       = [];
            this.registeringTimes = [];
            this.id++;
        }

        this.registeringTimes.push({ t : Date.now() / 1000, cause : 'start' });

        this.running = true;
    }

    /**
    * Automatically called : takes a snap of the current displayed image
    * @param dt Dt of the relative video time
    */
    snapshot(dt) {
        if (!this.running || this.pauseMode)
            return;

        loadPixels();

        if (!this.frameBlocker)
            this.pixelDatas.push({
                time    : Date.now(),
                dt      : dt,
                dataURL : canvas.toDataURL()
            });
        else
            this.pixelDatas.push(canvas.toDataURL());
    }


    /**
    * Stop the current recording session
    * @param downloadDatas   Starts an auto download of the session datas (default true)
    * @param clearPixelArray Will clear the last datas of previous recording session for memory optimization (default true)
    */
    stop(downloadDatas = true, clearPixelArray = true) {
        this.running = false;

        this.registeringTimes.push({ t : Date.now() / 1000 - this.registeringTimes[0].t, cause : 'stop' });

        if (downloadDatas)
            saveJSON(this.getDatasToJSON(), this.name + '-' + this.id + '.json');
        if (clearPixelArray) {
            this.pixelDatas       = [];
            this.registeringTimes = [];
        }
    }

    /** Pause the current recording session */
    pause() {
        this.pauseMode = true;
        this.registeringTimes.push({ t : Date.now() / 1000 - this.registeringTimes[0].t, cause : 'pause' });
    }
    /** Resumes the current recording session */
    resume() {
        this.pauseMode = false;
        this.registeringTimes.push({ t : Date.now() / 1000 - this.registeringTimes[0].t, cause : 'resume' });
    }

    /** @return the datas JSON formatted to be exported to a JSON file */
    getDatasToJSON() {
        return {
            config : {
                width        : this.width,
                height       : this.height,
                pixelDensity : this.pixelDensity,
                // if set to 'variable', pixelDatas includes current Time and DeltaTime dt in every item
                drawFrameCount   : this.frameBlocker ? this.drawingFPS : 'variable',
                updateFrameCount : this.frameBlocker ? this.updateFPS  : 'variable'
            },
            datas : {
                times : {
                    realTimeLength  : this.registeringTimes[this.registeringTimes.length - 1].t,
                    videoTimeLength : this.frameBlocker ? 1/this.drawingFPS * this.pixelDatas.length : 'variable',
                    timeOperations  : this.registeringTimes
                },
                pixels : {
                    pixelDatasSize : this.pixelDatas.length,
                    pixelDatas     : this.pixelDatas
                }
            }
        };
    }
}

export default pSRecorder;
