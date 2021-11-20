class OrenoGameInput {
    /**
     * addeventlistnerを呼ぶ。初期化。
     * @param targetCanvas canvasのエレメントを指定
     */
    static init(targetCanvas) {
        this.keydown = {"A": false};
        targetCanvas.addEventListener("keydown",
            event => {
                this.keydown[event.key] = true;
            }
        );
        targetCanvas.addEventListener("keyup",
            event => {
                this.keydown[event.key] = false;
            }
        );
    }

    /**
     * 引数のcodeが押されているかを取得
     * @param code enumのkeycodeを指定（"A"とかでも動いちゃう）
     * @returns {boolean|*} boolean
     * @constructor
     */
    static GetKey(code) {
        if (this.keydown[code] == undefined) {
            console.log("undefined");
            return false;
        }
        return this.keydown[code];
    }

    /**
     * 引数Axisに対応した、軸の傾き（-1 or 0 or 1）を返す
     * @param keyAxis enum Axisを指定
     * @returns {number}　傾き
     * @constructor
     */
    static GetAxis(keyAxis) {
        switch (keyAxis) {
            case Axis.Horizontal: {
                var Horizontal = 0;
                if (OrenoGameInput.GetKey(keycode.A)) {
                    Horizontal -= 1;
                }
                if (OrenoGameInput.GetKey(keycode.D)) {
                    Horizontal += 1;
                }
                return Horizontal;

            }
            case Axis.Vertical: {
                var Vertical = 0;
                if (OrenoGameInput.GetKey(keycode.W)) {
                    Vertical += 1;
                }
                if (OrenoGameInput.GetKey(keycode.S)) {
                    Vertical -= 1;
                }
                return Vertical;
            }
            default: {
                console.log("GetAxis 想定外のkeyAxisが入力されました");
                return 0;
            }
        }
    }
}

/**
 * keycodeのenum
 * @type {{A: string, S: string, D: string, W: string}}
 */
var keycode = {
    A: "a",
    W: "w",
    S: "s",
    D: "d",
};
/**
 * Axisにenum
 * @type {{Vertical: number, Horizontal: number}}
 */
var Axis = {
    Horizontal: 0, Vertical: 1
};