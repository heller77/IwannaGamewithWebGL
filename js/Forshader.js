window.addEventListener("load", main2);

setInterval(loop2, 50);
//
// Start here
//
var gl2;
var player1Object;
var loopFlag = new Boolean(true);
var gameobjectList = [];


var cubeRotation = 0.0;

function main2() {


    const canvas = document.querySelector("#shadercanvas");
    // Initialize the GL context
    gl = canvas.getContext("webgl2");
    OrenoGameInput.init(canvas);


    // If we don't have a GL context, give up now
    // Only continue if WebGL is available and working

    if (!gl) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }
    var reader = new FileReader();

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
      gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
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

    gl.clearColor(0.1, 0.1, 0.1, 1.0);  // Clear to black, fully opaque 塗りつぶし
    gl.clearDepth(1.0);                 //デプスバッファを1で初期化　
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    //buffer
    var buffers = initBuffers(gl);
    var position = [-1.0, 0.0, -3.0];
    var scale = [0.2, 0.2, 0.2];
    player1Object = new GameObject(position, scale, programInfo, buffers);
    player2Object = new GameObject([1, 0, -3], scale, programInfo, buffers);


    yuka = new GameObject([0, -1, -3], [1.2, 0.2, 0.4], programInfo, buffers);
    player2Object.init(gl, vsSource, fsSource2);


    // drawScene(gl, programInfo, buffers, position, [0.2, 0.2, 1]);
    gameobjectList.push(player1Object);
    gameobjectList.push(player2Object);
    gameobjectList.push(yuka);


    // // クリアカラーを黒に設定し、完全に不透明にします
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // // 指定されたクリアカラーでカラーバッファをクリアします
    // gl.clear(gl.COLOR_BUFFER_BIT);
}

function loop2() {

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