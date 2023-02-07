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
  // await exec(`javac SimplifyDebts.java`, {cwd : process.cwd()+'/algorithm'});
  let cmd = 'java SimplifyDebts ' + inputString;
  console.log("Cmd is ", cmd);
  const stdout = await new Promise((resolve, reject) => {
    exec(cmd, {cwd : process.cwd()+'/algorithm'}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
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
    if (add){
      if(!newEdges[key]) newEdges[key] = {};
      newEdges[key][critical] = involved[key];
    }
    else
    {
      if(!newEdges[critical]) newEdges[critical] = {};
      newEdges[critical][key] = involved[key];
    }
  }

  console.log("New Edges",newEdges);

  for (let from in newEdges) {
    for (let to in newEdges[from]) {
      if(!graph[from]) graph[from] = {};
      if(!graph[from][to]) graph[from][to] = 0;
      graph[from][to] += newEdges[from][to];
      }
  }
  console.log("Graph Sent for simplified ",graph)
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
  console.log('Response Array: ', resArray);
  // Replicate graph from output
  let resGraph = {};
  for (let i = 0; i < resArray.length; i += 3) {
    resGraph[rgmap[resArray[i]]] = {...resGraph[rgmap[resArray[i]]],
      [rgmap[resArray[i + 1]]]: resArray[i + 2],
    };
  }
  console.log('Response Graph: ', resGraph);
  return resGraph;
};
