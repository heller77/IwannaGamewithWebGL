class GameObject {
    constructor(position, scale, programinfo, buffer) {
        this.position = position;
        this.scale = scale;
        this.programinfo = programinfo;
        this.buffer = buffer;
        console.log("gameobjct instance");
    }

    init(gl, vs, fs) {
        this.vsSource = vs;
        this.fsSource = fs;
        const shaderProgram = initShaderProgram(gl, this.vsSource, this.fsSource);
        this.programinfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
    }

    draw(gl) {
        console.log(this.programinfo);
        drawScene(gl, this.programinfo, this.buffer, this.position, this.scale);
    }

    /**
     * @param motion 移動量（要素3つの配列）
     */
    move(motion) {
        this.position[0] += motion[0];
        this.position[1] += motion[1];
        this.position[2] += motion[2];
    }
}