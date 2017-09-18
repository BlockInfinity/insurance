const gulp = require('gulp');
const { spawn, exec } = require('child_process');
const sleep = require('sleep');

gulp.task('kill', function(cb) {
    exec('sudo pkill node', function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
});


gulp.task('oracle', function(cb) {
    const child = spawn('nodejs', ['./oracle/oracle.js'], { detached: true, stdio: ['ignore', 'ignore', 'ignore'] });
    child.unref();
});


gulp.task('testrpc', function(cb) {
    const child = spawn('testrpc', ['--mnemonic', '"my test example"', '--accounts', '50'], { detached: true, stdio: ['ignore', 'ignore', 'ignore'] });

    child.unref();
});

gulp.task('truffle', function(cb) {
    exec('truffle deploy --network local', {
        cwd: '/home/mgsgde/insuranceDocker/truffle'
    }, function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
});


gulp.task('start', function(cb) {
    // script.js
    const child = spawn('nodejs', ['app.js']);

    child.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});


gulp.task('default', ["init"]);


gulp.task('init', function(cb) {
    gulp.start("kill");
    sleep.sleep(5);
    gulp.start("testrpc");
    sleep.sleep(5);
    gulp.start("truffle");
    sleep.sleep(5);
    gulp.start("oracle");
});


gulp.task('start', function(cb) {
    gulp.start("kill");
    sleep.sleep(5);
    gulp.start("testrpc");
    sleep.sleep(5);
    gulp.start("truffle");
    sleep.sleep(5);
    gulp.start("oracle");
    sleep.sleep(5);
    gulp.start("start");
});


gulp.task('test', function(cb) {
    gulp.start("kill");
    sleep.sleep(5);
    gulp.start("testrpc");
    sleep.sleep(5);
    gulp.start("truffle");
    sleep.sleep(5);
    gulp.start("oracle");
    exec('mocha tests/app.test.js', function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
});