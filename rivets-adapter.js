(function(factory) {
    if (typeof exports === 'object')
        module.exports = factory;
    else
        factory(window.rivets, window.Backbone);
})
(function(rivets, Backbone) {

    var onOff = function(action) {
        return function(o, path, cb) {
            if (o instanceof Backbone.Collection)
                o[action]('add remove reset', cb);
            else if (o[action])
                o[action]('change:' + path, cb);
        }
    };

    var readPublish = function(o, path, value) {
        if (o instanceof Backbone.Collection)
            o = o.models;

        if (!path)
            return o;

        var p = path.split('.'),
            model = o,
            read = (arguments.length === 2),
            whiles = read ? 0 : 1;

        while (p.length > whiles) {
            if (o.get) {
                model = o;
                path = p.join('.');
                o = o.get(p.shift());
            }
            else
                o = o[p.shift()];

            if (o instanceof Backbone.Collection)
                o = o.models;
            else if (o == undefined)
                return undefined;
        }

        if (read)
            return o.call ? o.call(model) : o;

        if (o.set)
            value = o.set(p.shift(), value);
        else if (o.call)
            value = o(value);
        else
            o[p.shift()] = value;

        if (model.trigger)
            model.trigger('change:'+path);

        return value;
    };

    rivets.configure({
        adapter: {
            subscribe: onOff('on'),
            unsubscribe: onOff('off'),
            read: readPublish,
            publish: readPublish
        }
    });

});