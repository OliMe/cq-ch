const send = CQC.command(['test'], 'test-2');
CQC.execute(['test'], 'test-1')('test', async (channel) => {
    const command = await channel();
    console.log(command);
});
setInterval(() => {
    send({ type: 'test', time: Date.now() });
}, 500);
