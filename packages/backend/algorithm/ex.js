import { exec } from 'child_process';

exec(
  'javac SimplifyDebts.java 2> /dev/null && java SimplifyDebts 7 1 2 40 2 3 20 3 4 50 5 1 10 5 2 30 5 3 10 5 4 10 6 1 30 6 3 10',
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    console.log(stdout);

    let array = stdout.split(' ').map(i => parseInt(i))
    console.log(array)
  },
);
