class Plot {
    constructor() {
        this.tex = new pSText('\\sum \\sqrt{x^2+1} + 6 x \\text{ salut}', new Vector(), 2, 'red');
    }

    update(dt) {

    }

    draw(drawer) {
        this.tex.draw();
    }
}
