window.addEventListener("load", main);

function main() {
    var dis = document.getElementById("dis");

    const x = 2;
    const y = 2;
    const z = 2;

    let vec = mat4.create();
    vec = mat4.vectorxyz(vec, x, y, z);
    vec = mat4.create();

    // let mat = mat3.create();
    // mat3.translate(mat, mat, [10, 99]);
    // mat3.transpose(mat, mat);
    // console.log(mat);
    // const displayer = new displayMatrix(dis, 3);
    // displayer.display(mat);
    // const modelViewMatrix = mat4.create();
    //
    // mat4.translate(modelViewMatrix,     // destination matrix
    //     modelViewMatrix,     // matrix to translate
    //     [33, 33, 33]);  // amount to translate
    // mat4.scale(modelViewMatrix, modelViewMatrix, [4, 4, 4]);
    //
    // console.log(modelViewMatrix);
    //
    // const displayer = new displayMatrix(document.getElementById("dis"), 4);
    // displayer.display(modelViewMatrix, "model(view)");
    // const displyer2 = new displayMatrix(document.getElementById("dis2"), 4);
    // displyer2.display(vec, "vec result");

    const mat = mat3.create();
    const vecdisplayer = new displayMatrix(document.getElementById("vec"), 3);
    vecdisplayer.display(mat, "元の行列");

    const move = [9, 9];
    mat3.translate(mat, mat, move);
    {
        const displayer = new displayMatrix(document.getElementById("dis"), 3);
        displayer.display(mat, "[" + move + "] 移動");
    }
    const rad = 30;
    mat3.rotate(mat, mat, rad);
    {
        const displyer2 = new displayMatrix(document.getElementById("dis2"), 3);
        displyer2.display(mat, rad + "度回転");
    }
    const moveRev = [-9, -9];
    mat3.translate(mat, mat, moveRev);
    {
        const displyer3 = new displayMatrix(document.getElementById("dis3"), 3);
        displyer3.display(mat, moveRev + "移動");
    }

}

class displayMatrix {
    constructor(element, size) {
        this.target = element;
        this.size = size;
    }

    display(mat, sentence) {
        let displayString = sentence;
        for (var i = 0; i < mat.length; i++) {
            if (i % this.size === 0) {
                displayString += "<br>";
            }
            displayString += mat[i] + " ";
        }
        this.target.innerHTML = displayString;
    }
}

mat3.all0 = function (out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    return out;
};
mat4.vectorxyz = function (out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 0;
    return out;
};
