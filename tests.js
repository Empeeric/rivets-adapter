var Backbone = require('backbone'),
    rivets = {
        configure: function(o) {
            adapter = o.adapter;
        }
    },
    adapter;

require('./public/js/rivets-adapter')(rivets, Backbone);

var Model = Backbone.Model,
    Collection = Backbone.Collection;

var o = {
    a: 1,
    fn: function(value) {
        return value ? 'fn('+value+')' : 'fn()'
    },
    model: new Model({
        a: 2,
        b: {
            a: 3,
            object: {
                a: 3.5
            },
            model: new Model({
                a: 4
            })
        },
        fn: function(value) {
            return value ? 'model.fn('+value+')' : 'model.fn()'
        },
        collection: new Collection([
            { a: 8 },
            { a: 9 },
        ])
    }),
    object: {
        object: {
            a: 5
        }
    },
    collection: new Collection([
        { a: 1, b: 2 }
    ])
};

exports.read = function(test) {
    var a = [
        ['a', 1],
        ['model.a', 2],
        ['model.b.a', 3],
        ['model.b.object.a', 3.5],
        ['model.b.model.a', 4],
        ['object.object.a', 5],
        ['collection.0.a', 1],
        ['model.collection.0.a', 8],
        ['fn', 'fn()'],
        ['model.fn', 'model.fn()'],
        ['does not exists', null]
    ];

    a.forEach(function(r) {
        test.equal(adapter.read(o, r[0]), r[1], 'path: ' + r[0]);
    });
    test.done();
};


exports.publish = function(test) {
    var b = [
        ['a', 5],
        ['model.a', 6],
        ['model.b.a', 7],
        ['model.b.object.a', 8],
        ['model.b.model.a', 9],
        ['object.object.a', 10],
        ['collection.0.a', 52],
        ['model.collection.0.a', 13],
        ['fn', 243],
        ['model.fn', 341],
        ['does not exists', 123]
    ];

    b.forEach(function(r) {
        adapter.publish(o, r[0], r[1]);
        test.equal(adapter.read(o, r[0]), r[1], 'path: ' + r[0]);
    });
    test.done();
};