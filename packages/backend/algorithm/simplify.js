// const { exec } = require("child_process");
import {
  getDoc,
  doc,
  runTransaction,
  collection,
  getDocs,
  updateDoc,
} from '@firebase/firestore';
import { db } from '../firebase.js';
import { exec } from 'child_process';

async function run(input) {
  let inputString = input.join(' ');
  console.log(inputString);
  // await exec(`javac SimplifyDebts.java`, {cwd : process.cwd()+'/algorithm'});
  let cmd = 'java SimplifyDebts ' + inputString;
  const { stdout, stderr } = await exec(cmd, {cwd : process.cwd()+'/algorithm'});
  return stdout
    .trim()
    .split(' ')
    .map((x) => parseInt(x));
}

// simplifyonSplit takes groupId, splitId and add as input to simplify and update graph in database
export const simplifyonSplit = async (data) => {
  const graph = data.graph;
  const involved = data.involved;
  const add = data.add;

  console.log('Involved from simplify', involved);
  let critical;
  for (let key in involved)
    if (involved[key] < 0) {
      critical = key;
      break;
    }

  const newEdges = {};
  for (let key in involved) {
    if (key == critical) continue;
    if (add) newEdges[key] = { [critical]: involved[key] };
    else newEdges[critical] = { ...newEdges[critical], [key]: involved[key] };
  }

  console.log("New Edges",newEdges);

  for (let from in newEdges) {
    for (let to in newEdges[from]) {
      if (!!graph[from] && !!graph[from][to]) {
        graph[from][to] += newEdges[from][to];
      } else {
        graph[from] = { [to]: newEdges[from][to] };
      }
    }
  }
  return simplify( graph );
};

// simplify takes graph and groupId as input and updates graph in database
export const simplify = async ( graph ) => {
  // Mapping of public address to number
  let gmap = {},
    rgmap = {};
  let counter = 0;

  for (let from in graph) {
    for (let to in graph[from]) {
      if (!gmap[from]) {
        gmap[from] = counter;
        rgmap[counter] = from;
        counter++;
      }
      if (!gmap[to]) {
        gmap[to] = counter;
        rgmap[counter] = to;
        counter++;
      }
    }
  }

  // create input like array
  // const vertexCount = groupSnap.data().members.length;;
  let input = [counter];
  for (let from in graph) {
    for (let to in graph[from]) {
      input.push(gmap[from], gmap[to], graph[from][to]);
    }
  }

  let resArray = await run(input);

  // Replicate graph from output
  let resGraph = {};
  for (let i = 0; i < resArray.length; i += 3) {
    resGraph[rgmap[resArray[i]]] = {
      [rgmap[resArray[i + 1]]]: resArray[i + 2],
    };
  }
  console.log('Response Graph: ', resGraph);
  return resGraph;
};
