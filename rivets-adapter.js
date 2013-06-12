// Adapter
(function() {
    var onOff = function(action) {
        return function(o, path, cb) {
            if (o[action])
                o[action](path ? 'change:' + path : 'create remove change', cb);
        }
    };
    var readPublish = function(o, path, value) {
        if (!path)
            return o.get ? o.get() : o;

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

            if (o == undefined)
                return o;
        }

        if (read)
            return o;

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
})();