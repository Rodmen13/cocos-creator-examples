declare module cc {

    interface RenderComponent {

        _materials: Material[],

        _assembler: Assembler;

        _vertsDirty: any;

        _resetAssembler(): void;

        __preload(): void;

        setVertsDirty(): void;

        _on3DNodeChanged(): void;

        _validateRender(): void;

        markForValidate(): void;

        markForRender(enable): void;

        disableRender(): void;

        _getDefaultMaterial(): Material;

        _activateMaterial(): void;

        _updateMaterial(): void;

        _updateColor(): void;

        _checkBacth(renderer, cullingMask): void;

    }

    class RenderData {

        vDatas: Float32Array[];

        uintVDatas: Uint32Array[];

        iDatas: Uint16Array[];

        meshCount: number;

        _infos: any[];

        _flexBuffer: any;

        init(assembler: Assembler): void;

        clear(): void;

        updateMesh(index: number, vertices: number, indices: number): void;

        updateMeshRange(verticesCount: number, indicesCount: number): void;

        createData(index: number, verticesFloats: number, indicesCount: number): void;

        createQuadData(index: number, verticesFloats: number, indicesCount: number): void;

        createFlexData(index: number, verticesFloats: number, indicesCount: number, vfmt: gfx.VertexFormat): void;

        initQuadIndices(indices): void;

    }

    class Assembler {

        _renderData: RenderData;

        _renderComp: RenderComponent;

        register(renderCompCtor, assembler): void;

        init(renderComp): void;

        updateRenderData(comp): void;

        fillBuffers(comp, renderer): void;

        getVfmt(): gfx.VertexFormat;

    }
    module gfx {
        /**
         * vertex attribute semantic
         * => a_position
         */
        const ATTR_POSITION: any;
        /**
         * vertex attribute semantic
         * => a_uv0
         */
        const ATTR_UV0: any;
        /**
         * vertex attribute semantic
         * => a_color
         */
        const ATTR_COLOR: any;
        /**
         * vertex attribute type => gl.UNSIGNED_BYTE
         */
        const ATTR_TYPE_UINT8: any;
        /**
         * vertex attribute type => gl.FLOAT
         */
        const ATTR_TYPE_FLOAT32: any;
        class VertexFormat {

            /**
             * @constructor
             * @param {Array} infos
             *
             * @example
             * let vertexFmt = new VertexFormat([
             *   { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
             *   { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
             *   { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4, normalize: true },
             * ])
             */
            constructor(infos);

            /**
             * @method element
             * @param {string} attrName
             * @returns {string}
             */
            element(attrName): string;
            /**
             * @method getHash
             */
            getHash(): string;

        }

        class VertexBuffer {

            /**
             * @constructor
             * @param {Device} device
             * @param {VertexFormat} format
             * @param {USAGE_*} usage
             * @param {ArrayBuffer | Uint8Array} data
             */
            constructor(device, format: VertexFormat, usage, data: ArrayBuffer | Uint8Array);

            /**
            * @method update
            * @param {number} byteOffset
            * @param {ArrayBuffer} data
            */
            update(byteOffset: number, data: ArrayBuffer);

            /**
             *  @method destroy
             */
            destroy();

        }

        class IndexBuffer {
            /**
            * @constructor
            * @param {Device} device
            * @param {INDEX_FMT_*} format
            * @param {USAGE_*} usage
            * @param {ArrayBuffer | Uint8Array} data
            */
            constructor(device, format, usage, data: ArrayBuffer | Uint8Array);

            /**
             * @method update
             * @param {Number} byteOffset
             * @param {ArrayBuffer} data
             */
            update(byteOffset: number, data: ArrayBuffer): void;

            /**
            *  @method destroy
            */
            destroy();

        }

    }
}