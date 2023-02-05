import {
  getDoc,
  doc,
  runTransaction,
  collection,
  getDocs,
  updateDoc,
} from '@firebase/firestore';
import { db } from '../firebase.js';
import util from 'util';
import { exec as exc } from 'child_process';
const exec = util.promisify(exc);

async function run(input) {
  let inputString = input.join(' ');
  console.log(inputString);
  await exec('javac SimplifyDebts.java')
  let cmd = 'java SimplifyDebts ' + inputString;
  const { stdout, stderr } = await exec(cmd);
  return stdout.trim().split(' ').map((x) => parseInt(x));
}

// simplifyonSplit takes groupId, splitId and add as input to simplify and update graph in database
export const simplifyonSplit = async (data) => {
  const groupId = data.groupId;
  const add = data.add;
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  const graph = groupSnap.data().graph || {};

  const currSplit = await getDoc(
    doc(db, 'groups', groupId, 'splits', data.splitId),
  );
  const involved = currSplit.data().involved;
  let critical;
  for (let key in involved)
    if (involved[key] < 0) {
      critical = key;
      break;
    }

    const newEdges = {};
    for (let key in  involved) {
    if (key == critical) continue;
    if (add) newEdges[key]= { [critical] : involved[key]};
    else newEdges[critical] = {[key] : involved[key]};
  }

  for (let from in newEdges) {
    for(let to in newEdges[from]){
      // if (!graph[from]) graph[from] = {};
      // if (!graph[from][to]) graph[from][to] = 0;
      if(!!graph[from] && !!graph[from][to])
        graph[from][to] += newEdges[from][to];
      else{
        // if(!graph[from]) graph[from] = {};
        graph[from] = {[to] : newEdges[from][to]};
      }

     val;
  }
  simplify({graph, groupId});
};


// simplify takes graph and groupId as input and updates graph in database
export const simplify = async ({graph}) => {
  // Mapping of public address to number
  let gmap = {},
    rgmap = {};
  let counter = 0;

  for(let from in graph){
    for(let to in graph[from]){
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
  // const vertexCount = groupSnap.data().members.length;
  let vertexCount = 6;
  let input = [vertexCount];
  for (let from in graph) {
    for (let to in graph[from]) {
      input.push(gmap[from], gmap[to], graph[from][to]);
    }
  }

  //Make input string from array
  // Run java code
  // var resArray;
  let resArray = await run(input);
  console.log("Response Array: ", resArray);

  // Replicate graph from output
  let resGraph = {};
  for (let i = 0; i < resArray.length; i += 3) {
    resGraph[rgmap[resArray[i]]] = { [rgmap[resArray[i + 1]]] : resArray[i + 2]};
  }

  console.log("Response Graph: ", resGraph);
}

let expGraph = {
  '0x1': {
    '0x2': 40,
    '0x3': 10,
  },
  '0x2': {
    '0x3': 20,
    '0x4': 30,
    '0x5': 10,
  },
  '0x3': {
    '0x4': 50,
    '0x5': 10,
  },
}
const groupId = 'f24j2JcCKkeUch7mauIS';

simplify({graph: expGraph, groupId});
