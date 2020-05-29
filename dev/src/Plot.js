class Plot {
    constructor() {
        this.tex = new pSText('\\sum \\sqrt{x^2+1} + 6 x \\text{ with $x \\in \\mathbb{R}$}', new Vector(), 7, 'white');
    }

    update(dt) {

    }

    draw(drawer) {
        this.tex.draw();
    }
}
