/**
 * Created by bao on 2018/1/29.
 */
(function ($) {
    var methods = {
        init: function (options) {
            var parent = $(this).parent();
            methods.destory(this);
            parent.css('position','relative');
            var Btn1 = '<button class="jNum_btn" style="position: absolute;top: 2px;left: 16px;height:30px;width: 26px">-</button>';
            var Btn2 = '<button class="jNum_btn" style="position: absolute;top: 2px;right: 16px;height:30px;width: 26px">+</button>';
            parent.append(Btn1);
            parent.append(Btn2);
            var input = this;
            parent.on('click','.jNum_btn',function (e) {
                if($(this).text() == '-'){
                    if(input.val() <= 1){return false;}
                    input.val(parseInt(input.val()) - 1);
                }else {
                    input.val(parseInt(input.val()) + 1);
                }
                options.onChange(input);
                e.preventDefault();
            })
        },
        destory:function (dom) {
            var parent = $(dom).parent();
            parent.find('.jNum_btn').remove();
            parent.off('click','.jNum_btn');
        }
    };
    $.fn.jNum = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist for jQuery.jNum');
        }
    }
}(jQuery));