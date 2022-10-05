// let CustomRender = cc.Class({
//     // 所有渲染组件需要继承自 cc.RenderComponent
//     extends: cc.RenderComponent,

//     ctor () {
//         // 顶点数据装配器
//         this._assembler = null;
//         // 材质
//         this._spriteMaterial = null;
//         // 纹理 UV 数据
//         this.uv = [];
//     },

//     properties: {
//         // 渲染组件使用的 Texture
//         _texture: {
//             default: null,
//             type: cc.Texture2D
//         },

//         texture: {
//             get: function () {
//                 return this._texture;
//             },
//             set: function (value) {
//                 this._texture = value;
//             },
//             type: cc.Texture2D,
//         },
//     },
// })