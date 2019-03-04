var send = CQC.command(['test'], 'test-2');
CQC.execute(['test'], 'test-1')('test', function (channel) {
    var promise = channel();
    if (promise) {
        promise.then(function (command) {
            console.log(command);
        }, function (error) {
            console.log(error);
        })
    }
});
setInterval(function () {
    send({ type: 'test', time: Date.now() });
}, 500);
