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
    console.log(stdout)

    let obj = JSON.parse(stdout);

    console.log(obj);
    // console.log(`stdout: ${stdout}`);
  },
);

// exec(
//   'javac SimplifyDebts.java 2> /dev/null && java SimplifyDebts 7 3 4 40 5 4 20 5 2 40 6 3 30 6 1 10 1 2 10',
//   (error, stdout, stderr) => {
//     if (error) {
//       console.log(`error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.log(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   },
// );

// data is array of objects
// export const simplify = (data) => {

// }

// balances are present in simplified
// We need balances graph and new splits to generate new graph
data = {
  groupId: '',
  splitId: ''
}

const simplify = async (data)=> {
  const groupId = data.groupId;
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  const graph = groupSnap.data().graph || {};

  const currSplit = await getDoc(doc(db, 'groups', groupId, 'splits', data.splitId));
  const involved = currSplit.data().involved;
  let reciever;
  for(let [key, value] of involved)
  if(value < 0){reciever = key; break;}

  const newEdges = {};
  for(let [key, value] of involved){
    if(key == reciever)continue;
    newEdges[key][reciever] = value;
  }


  for(let [from, [to, val]] of newEdges){
    graph[from][to] += val;
  }
  const newGraph = graph;



// Mapping of public address to number
  let gmap={}, rgmap={};
  let counter = 1;
  for(let [from, [to, val]] of newGraph){
    if(!gmap[from]){
      gmap[from] = counter;
      rgmap[counter] = from;
      counter++;
    }
    if(!gmap[to]){
      gmap[to] = counter;
      rgmap[counter] = to;
      counter++;
    }
  }

  // create input like array
  const vertexCount = groupSnap.data().members.length;
  let input = [vertexCount];
  for(let [from, [to, val]] of newGraph){
    input.push(gmap[from], gmap[to], val);
  }

  //Make input string from array
  let inputString = input.join(' ');

  // Run java code

  // Replicate graph from output
  let resArray;
  let resGraph = {};
  for(let i = 0; i < resArray.length; i+=3){
    resGraph[rgmap[resArray[i]]][rgmap[resArray[i+1]]] = resArray[i+2];
  }

  // Update graph in firestore
  await updateDoc(groupRef, {graph: resGraph});
}


