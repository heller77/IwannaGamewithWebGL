window.addEventListener("load", main);

setInterval(loop, 50);
//
// Start here
//
var gl;
var player1Object;
var loopFlag = new loop(true);
var gameobjectList = [];

function main() {
    var startorStopButton = document.getElementById("startORStopButton");
    startorStopButton.addEventListener("click", () => {
            if (loopFlag) {
                loopFlag = false;
            } else {
                loopFlag = true;
            }
        }
    );


    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context
    gl = canvas.getContext("webgl");
    OrenoGameInput.init(canvas);
    OrenoGameInput.GetKey(keycode.A);


    // If we don't have a GL context, give up now
    // Only continue if WebGL is available and working

    if (!gl) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    //頂点シェーダー
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor=aVertexColor;
    }
    `;
    //フラグメントシェーダー
    const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;
    //フラグメントシェーダー
    const fsSource2 = `
    void main() {
      gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
    }
  `;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //シェーダ内の変数との割り当て
    var programInfo = {
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque 塗りつぶし
    gl.clearDepth(1.0);                 //デプスバッファを1で初期化　
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    //buffer
    var buffers = initBuffers(gl);
    var position = [-1.0, 0.0, -3.0];
    var scale = [0.2, 0.2, 1];
    player1Object = new GameObject(position, scale, programInfo, buffers);
    player2Object = new GameObject([1, 0, -3], scale, programInfo, buffers);
    player2Object.init(gl, vsSource, fsSource2);
    // drawScene(gl, programInfo, buffers, position, [0.2, 0.2, 1]);
    gameobjectList.push(player1Object);
    gameobjectList.push(player2Object);
    player1Object.draw(gl);
    player2Object.draw(gl);
    // // クリアカラーを黒に設定し、完全に不透明にします
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // // 指定されたクリアカラーでカラーバッファをクリアします
    // gl.clear(gl.COLOR_BUFFER_BIT);
};

function loop() {
    if (loopFlag) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//背景塗りつぶし
        var Horizontal = OrenoGameInput.GetAxis(Axis.Horizontal);//水平
        var Vertical = OrenoGameInput.GetAxis(Axis.Vertical);//垂直
        player1Object.move([Horizontal * 0.1, Vertical * 0.1, 0]);
        gameobjectList.forEach((i) => {
            i.draw(gl);
        });
        //
        // player1Object.draw(gl);
        // player2Object.draw(gl);
    }
}

function initShaderProgram(gl, vsSource, fsSource) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //頂点シェーダとフラグメントシェーダをまとめてる？
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);


    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

//読み込んだシェーダをシェーダオブジェクトにして返す
function loadShader(gl, type, source) {
    //type型のオブジェクトを作成（多分）
    const shader = gl.createShader(type);
    //シェーダを読み込み
    gl.shaderSource(shader, source);
    //コンパイル
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alaert("error whene shader compile");
        gl.delete(shader);
        return null;
    }
    return shader;
}

function initBuffers(gl) {
    //バッファを作成（頂点データを入れるよう）
    const positionBuffer = gl.createBuffer();

    //頂点データが入るんだぞーといってる
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //position
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var colors = [
        1.0, 1.0, 1.0, 1.0,    // 白
        1.0, 0.0, 0.0, 1.0,    // 赤
        0.0, 1.0, 0.0, 1.0,    // 緑
        0.0, 0.0, 1.0, 1.0     // 青
    ];
    const colorbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorbuffer,

    };


}

function drawScene(gl, programInfo, buffers, move, scale) {

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.scale(modelViewMatrix, modelViewMatrix, scale);
    // mat4.translate(modelViewMatrix,     // destination matrix
    //     modelViewMatrix,     // matrix to translate
    //     [-0.0, 0.0, -3.0]);  // amount to translate
    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        move);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                  // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}