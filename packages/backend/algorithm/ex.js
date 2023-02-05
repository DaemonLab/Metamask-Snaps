import util from 'util';
import { exec as exc } from 'child_process';
const exec = util.promisify(exc);
// import { exec } from 'child_process';

async function lsExample() {
  const { stdout, stderr } = await exec('javac SimplifyDebts.java 2> /dev/null && java SimplifyDebts 7 1 2 40 2 3 20 3 4 50 5 1 10 5 2 30 5 3 10 5 4 10 6 1 30 6 3 10');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
  let a= stdout.trim().split(' ').map((x) => parseInt(x));
  return a;
}

lsExample();
