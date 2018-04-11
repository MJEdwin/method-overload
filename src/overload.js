(function (window) {
    "use strict";
    /**
     * 函数重载
     * @returns {Overload}
     */
    function Overload() {
        this.overloadSet = [];
        return this;
    }

    /**
     * 获取方法(类)名称
     * @param {Function} type 
     */
    // Overload.getTypeName = function (type) {
    //     //获取方法名称,兼容做法,针对无function.name做出兼容
    //     return type.name || type.toString().match(/function\s+([^(]+)/)[1];
    // }

    // Overload.getType = function (arg) {
    //     return {}.toString.call(arg).match(/\s([a-zA-Z]+)/)[1];
    // }

    /**
     * 检查参数
     * @param {any[]} types
     * @param {any[]} args
     * @returns {boolean}
     */
    Overload.matchType = function (types, args) {
        if (types.length !== args.length) return false;
        for (var i = 0; i < types.length; i++) {
            if ((args[i]).constructor !== types[i]) return false;
        }

        return true;
    }

    /**
     * 添加重载函数
     * @param {Function[]} types 
     * @param {Function} func 
     * @returns {void}
     */
    Overload.prototype.add = function (types, func) {
        this.overloadSet.push({
            types: types,
            func: func
        });

        return this;
    };
    /**
     * 返回重载方法
     * @returns {Function}
     */
    Overload.prototype.create = function () {
        var load = this;
        return function () {
            for (var i = 0; i < load.overloadSet.length; i++) {
                if (Overload.matchType(load.overloadSet[i].types, arguments)) {
                    return load.overloadSet[i].func.apply(this, arguments);
                }
            }
            throw new Error("Function is Not Found");
        };
    };

    window.Overload = Overload;

    window.overload = function () {
        var overloadObj = new Overload();

        var overloadMethod = overloadObj.create();

        overloadMethod.add = function (types, func) {
            overloadObj.add(types, func);
            return overloadMethod;
        };

        return overloadMethod;
    };

})(this);