

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class MeshTextureFlag extends cc.Component {
    @property(cc.Vec2)
    private _offset: cc.Vec2 = new cc.Vec2(0, 0);
    @property(cc.Vec2)
    public get offset(): cc.Vec2 {
        return this._offset;
    }
    public set offset(value: cc.Vec2) {
        this._offset = value;
        this._applyVertexes();
    }

    @property(cc.SpriteFrame)
    /**
    * !#en The sprite frame of the sprite.
    * !#zh 精靈的精靈幀
    * @property spriteFrame
    * @type {SpriteFrame}
    * @example
    * sprite.spriteFrame = newSpriteFrame;
    */
    private _spriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    public get spriteFrame(): cc.SpriteFrame {
        return this._spriteFrame;
    }
    public set spriteFrame(value: cc.SpriteFrame) {
        this._spriteFrame = value;
        this._applySpriteFrame();
    }

    @property({step:1,min:1})
    private _row = 10;
    /**
     * !#zh 網格列數
     * @property cell_size
     * @type {Number}
     */
     @property({step:1,min:1})
    public get row(): number {
        return this._row;
    }
    public set row(value: number) {
        value <= 0 ? value = 1 : '';
        if (this._row !== value) {
            this._row = value;
            this._updateMesh();
            this._applyVertexes();
        }
    }
    @property({step:1,min:1})
    /**
     * !#zh 網格欄數
     * @property cell_size
     * @type {number}
     */
    private _col = 20;
    @property({step:1,min:1})
    public get col():number{
        return this._col;
    }
    public set col(value:number){
        value <= 0 ? value = 1 : '';
        if (this._col !== value) {
            this._col = value;
            this._updateMesh();
            this._applyVertexes();
        }
    }

    @property({min:0.1,step:0.1})
    /**
     * !#zh 速度
     * @property cell_size
     * @type {number}
     */
    private _speed=10;
    @property
    public get speed():number{
        return this._speed;
    }
    public set speed(value:number){
        value <= 0 ? value = 0.1 : '';
        if (this._speed !== value) {
            this._speed = value;
            this._updateMaterial();
        }
    }

    /**
     * !#zh 振幅
     * @property amplitude
     * @type {number}
     */
    @property({min:0.1,step:1})
    private _amplitude=5;
    @property
    public get amplitude():number{
        return this._amplitude;
    }
    public set amplitude(value:number){
        value <= 0 ? value = 0.1 : '';
        if (this._amplitude !== value) {
            this._amplitude = value;
            this._updateMaterial();
        }
    }

    @property({min:0,step:1})
    /**
     * !#zh 波浪週期
     * @property 波浪週期
     * @type {number}
     */
    private _wave=5;
    @property
    public get wave():number{
        return this._wave;
    }
    public set wave(value:number){
        value <= 0 ? value = 0 : '';
        if (this._wave !== value) {
            this._wave = value;
            this._updateMaterial();
        }
    }

    private _meshCache:object={};
    private _vertexes:Array<cc.Vec2>=[];

    private renderer:cc.MeshRenderer=null;

    private mesh:cc.Mesh;

    private texture:cc.Texture2D;

    onLoad():void{

        // 添加 MeshRenderer
        let renderer = this.node.getComponent(cc.MeshRenderer);
        if (!renderer) {
            renderer = this.node.addComponent(cc.MeshRenderer);
        }
        renderer.mesh = null;
        this.renderer=renderer;
        //加載材質
        cc.loader.loadRes('mat/sprite-flag',cc.Material,(err:any,mat:cc.Material)=>{
            if (err) {
                cc.error(err.message || err);
                return;
            }
            //拷貝一份
            let matt = cc.MaterialVariant.create(mat,null) 
            this.renderer.setMaterial(0, matt);
            this._updateMaterial();
        })

        this._updateMesh();
        this._applySpriteFrame();
        this._applyVertexes();

        this.node.on('size-changed', () => {
            this._updateMesh();
            this._applyVertexes();
        }, this);
        this.node.on('anchor-changed', () => {
            this._updateMesh();
            this._applyVertexes();
        }, this);
    }

    _updateMesh(): void {
        // 計算出頂點座標
        this._vertexes = [];
        const _width = this.node.width;
        const _height = this.node.height;
        for (let _row = 0; _row < this._row + 1; _row++) {
            for (let _col = 0; _col < this._col + 1; _col++) {
                const x = (_col - this._col * this.node.anchorX) * _width / this._col;
                const y = (_row - this._row * this.node.anchorY) * _height / this._row;
                this._vertexes.push(cc.v2(x, y));
            }
        };

        //綁訂網格
        let mesh = this._meshCache[this._vertexes.length];
        if (!mesh) {
            mesh = new cc.Mesh();
            mesh.init(new cc.gfx.VertexFormat([
                { name: cc.gfx.ATTR_POSITION, type: cc.gfx.ATTR_TYPE_FLOAT32, num: 2 },
                { name: cc.gfx.ATTR_UV0, type: cc.gfx.ATTR_TYPE_FLOAT32, num: 2 },
            ]), this._vertexes.length, true);
            this._meshCache[this._vertexes.length] = mesh;
        }
        this.mesh = mesh;

        this._updateMaterial();
    }

    _applyVertexes(): void {
        //設置頂點座標
        const mesh = this.mesh;
        mesh.setVertices(cc.gfx.ATTR_POSITION, this._vertexes);
        if (this.texture) {
            let uvs = [];
            // 計算uv座標
            for (const pt of this._vertexes) {
                const u = (pt.x + this.texture.width * this.node.anchorX + this.offset.x) / this.texture.width;
                const v = 1.0 - (pt.y + this.texture.height * this.node.anchorY + this.offset.y) / this.texture.height;
                uvs.push(cc.v2(u, v));
            }
            mesh.setVertices(cc.gfx.ATTR_UV0, uvs);
        }

        if (this._vertexes.length >= 3) {
            // 計算頂點索引
            let ids = [];
            let getIndexByRowCol = (_row, _col) => {
                return _row * (this._col + 1) + _col;
            }
            for (let _row = 0; _row < this._row; _row++) {
                for (let _col = 0; _col < this._col; _col++) {
                    ids.push(getIndexByRowCol(_row, _col), getIndexByRowCol(_row, _col + 1), getIndexByRowCol(_row + 1, _col));
                    ids.push(getIndexByRowCol(_row + 1, _col), getIndexByRowCol(_row + 1, _col + 1), getIndexByRowCol(_row, _col + 1));
                }
            };
            mesh.setIndices(ids);
            if (this.renderer.mesh != mesh) {
                // mesh 完成后再赋值给 MeshRenderer , 否则模拟器(mac)会跳出
                this.renderer.mesh = mesh;
            }
        } else {

        }
    }

    _applySpriteFrame(): void {
        if (this.spriteFrame) {
            let texture = this.spriteFrame.getTexture();
            this.texture = texture;
            this._updateMaterial();
        }
    }
    /**
     * 更新材質
     */
    _updateMaterial():void{
        // Reset material
        let material = this.renderer._materials[0];
        if (material) {
            if (this.texture) {
                // 设置 texture 
                material.define("USE_TEXTURE", true);
                material.setProperty('texture', this.texture);
            }

            // 设置着色器 uniform 参数
            material.setProperty('textureWidth', this.node.width);
            material.setProperty('speed', this.speed);
            material.setProperty('amplitude', this.amplitude);
            material.setProperty('wave', this.wave);
            if (this._vertexes.length > 0)
                material.setProperty('startPos', this._vertexes[0]);
        }
    }

    

}
