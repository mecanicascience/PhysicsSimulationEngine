class Text {
    constructor(text, pos = new Vector(), textSize = 1, color = "#FFFFFF", showHitbox = false) {
        if(window.MathJax == undefined)
			console.error('You must import MathJax.js >=3.0.0 in order to use Text and Tex strings.');

        this.textSize = textSize;
        this.color    = color;

        this.pos     = pos;
        this.xOffset = 0;
        this.yOffset = 0;

        this.showHitbox = showHitbox;

        this.setText(text);
    }


    draw() {
        let drawer = _pSimulationInstance.plotter.drawer;
        let pos    = drawer.plotter.computeForXY(this.pos.x, this.pos.y);

        push();
            translate(-this.svgImg.width / 2 + this.xOffset, this.yOffset - this.svgImg.height / 2);

            image(this.svgImg, pos.x, pos.y, this.svgImg.width, this.svgImg.height);

            if(this.showHitbox) {
                let h = this.svgImg.height;
                let w = this.svgImg.width;

                drawer
                    .stroke(this.color)
                    .strokeWeight(1)
                    .noFill();
                line(pos.x    , pos.y    , pos.x + w, pos.y    );
                line(pos.x    , pos.y + h, pos.x + w, pos.y + h);
                line(pos.x    , pos.y + h, pos.x    , pos.y    );
                line(pos.x + w, pos.y + h, pos.x + w, pos.y    );
            }
        pop();
    }


    setText(text) {
        this.text = text;

        let svg = '<svg' + MathJax.tex2svg(this.text,
            { display : true, em : 12, ex : 6, containerWidth : 80 * 6, lineWidth : 100000, scale : 1 }
        ).innerHTML.split('<svg')[1].split('</svg>')[0] + '</svg>';

        svg = svg
            .replace(/<g/g           , '<g color="' + this.color + '"')
            .replace(/width="(.*?)"/ , 'width="'  + parseFloat(/width="(.*?)"/ .exec(svg)[1].split('ex')[0]) * this.textSize + 'ex"')
            .replace(/height="(.*?)"/, 'height="' + parseFloat(/height="(.*?)"/.exec(svg)[1].split('ex')[0]) * this.textSize + 'ex"');

        this.svgImg = loadImage(URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })));

        return this;
    }

    setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        return this;
    }

    setOffset(x, y) {
        this.xOffset = x;
        this.yOffset = y;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }
}

export default Text;
