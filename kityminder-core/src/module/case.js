/**
 * @fileOverview
 *
 * 用例信息保存
 *
 * @author: weihuifeng
 * @copyright: SR, 2023
 */
define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    Module.register('CaseModule', function() {
        /**
         * @command Case
         * @description 设置节点的用例信息
         * @param {string} caseInfo 要设置的用例信息，json字符串，设置为 null 则移除用例信息
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        var CaseCommand = kity.createClass('CaseCommand', {
            base: Command,

            execute: function(minder, caseInfo) {
                var node = minder.getSelectedNode();
                node.setData('case', caseInfo);
                //暂时不需要渲染其他内容
                // node.render();
                // node.getMinder().layout(300);
            },

            queryState: function(minder) {
                return minder.getSelectedNodes().length === 1 ? 0 : -1;
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                // console.log("get selected node:",node)
                // console.log("caseInfo:",node.getData('case'))
                return node && node.getData('case');
            }
        });

        //暂时没有图标
        // var NoteIcon = kity.createClass('NoteIcon', {
        //     base: kity.Group,

        //     constructor: function() {
        //         this.callBase();
        //         this.width = 16;
        //         this.height = 17;
        //         this.rect = new kity.Rect(16, 17, 0.5, -8.5, 2).fill('transparent');
        //         this.path = new kity.Path().setPathData(NOTE_PATH).setTranslate(2.5, -6.5);
        //         this.addShapes([this.rect, this.path]);

        //         this.on('mouseover', function() {
        //             this.rect.fill('rgba(255, 255, 200, .8)');
        //         }).on('mouseout', function() {
        //             this.rect.fill('transparent');
        //         });

        //         this.setStyle('cursor', 'pointer');
        //     }
        // });

        // var NoteIconRenderer = kity.createClass('NoteIconRenderer', {
        //     base: Renderer,

        //     create: function(node) {
        //         var icon = new NoteIcon();
        //         icon.on('mousedown', function(e) {
        //             e.preventDefault();
        //             node.getMinder().fire('editnoterequest');
        //         });
        //         icon.on('mouseover', function() {
        //             node.getMinder().fire('shownoterequest', {node: node, icon: icon});
        //         });
        //         icon.on('mouseout', function() {
        //             node.getMinder().fire('hidenoterequest', {node: node, icon: icon});
        //         });
        //         return icon;
        //     },

        //     shouldRender: function(node) {
        //         return node.getData('note');
        //     },

        //     update: function(icon, node, box) {
        //         var x = box.right + node.getStyle('space-left');
        //         var y = box.cy;

        //         icon.path.fill(node.getStyle('color'));
        //         icon.setTranslate(x, y);

        //         return new kity.Box(x, Math.round(y - icon.height / 2), icon.width, icon.height);
        //     }

        // });

        return {
            // renderers: {
            //     right: NoteIconRenderer
            // },
            commands: {
                'case': CaseCommand
            }
        };
    });
});