
class SimplifyDebts {
  static OFFSET = 1000000000;
  static visitedEdges = null;
  static main(args) {
    SimplifyDebts.createGraphForDebts();
  }
  // *
  //   * This example graph is taken from my Medium blog post.
  //   * Here Alice, Bob, Charlie, David, Ema, Fred and Gabe are represented by vertices from 0 to 6 respectively.
  static createGraphForDebts() {
    //  List of all people in the group
    var person = ["Alice", "Bob", "Charlie", "David", "Ema", "Fred", "Gabe"];
    var n = person.length;
    //  Creating a graph with n vertices
    var solver = new Dinics(n, person);
    //  Adding edges to the graph
    solver = SimplifyDebts.addAllTransactions(solver);
    console.log();
    console.log("Simplifying Debts...");
    console.log("--------------------");
    console.log();
    //  Map to keep track of visited edges
    SimplifyDebts.visitedEdges = new Set();
    var edgePos = null;
    while ((edgePos = SimplifyDebts.getNonVisitedEdge(solver.getEdges())) != null) {
      //  Force recomputation of subsequent flows in the graph
      solver.recompute();
      //  Set source and sink in the flow graph
      var firstEdge = solver.getEdges()[edgePos];
      solver.setSource(firstEdge.from);
      solver.setSink(firstEdge.to);
      //  Initialize the residual graph to be same as the given graph
      var residualGraph = solver.getGraph();
      var newEdges = new Array();
      for (const allEdges of residualGraph) {
        for (const edge of allEdges) {
          var remainingFlow = ((edge.flow < 0) ? edge.capacity : (edge.capacity - edge.flow));
          //  If there is capacity remaining in the graph, then add the remaining capacity as an edge
          //  so that it can be used for optimizing other debts within the graph
          if (remainingFlow > 0) {
            (newEdges.push(new Dinics.Edge(edge.from, edge.to, remainingFlow)) > 0);
          }
        }
      }
      //  Get the maximum flow between the source and sink
      var maxFlow = solver.getMaxFlow();
      //  Mark the edge from source to sink as visited
      var source = solver.getSource();
      var sink = solver.getSink();
      SimplifyDebts.visitedEdges.add(SimplifyDebts.getHashKeyForEdge(source, sink));
      //  Create a new graph
      solver = new Dinics(n, person);
      //  Add edges having remaining capacity
      solver.addEdges(newEdges);
      //  Add an edge from source to sink in the new graph with obtained maximum flow as it's weight
      solver.addEdge(source, sink, maxFlow);
    }
    //  Print the edges in the graph
    solver.printEdges();
    console.log();
  }
  static addAllTransactions(solver) {
    //  Transactions made by Bob
    solver.addEdge(1, 2, 40);
    //  Transactions made by Charlie
    solver.addEdge(2, 3, 20);
    //  Transactions made by David
    solver.addEdge(3, 4, 50);
    //  Transactions made by Fred
    solver.addEdge(5, 1, 10);
    solver.addEdge(5, 2, 30);
    solver.addEdge(5, 3, 10);
    solver.addEdge(5, 4, 10);
    //  Transactions made by Gabe
    solver.addEdge(6, 1, 30);
    solver.addEdge(6, 3, 10);
    return solver;
  }
  // *
  //  * Get any non visited edge in the graph
  //  * @param edges list of all edges in the graph
  //  * @return index of a non visited edge
  static getNonVisitedEdge(edges) {
    var edgePos = null;
    var curEdge = 0;
    for (const edge of edges) {
      if (!SimplifyDebts.visitedEdges.has(SimplifyDebts.getHashKeyForEdge(edge.from, edge.to))) {
        edgePos = curEdge;
      }
      curEdge++;
    }
    return edgePos;
  }
  // *
  //  * Get a unique hash key for a given edge
  //  * @param u the starting vertex in the edge
  //  * @param v the ending vertex in the edge
  //  * @return a unique hash key
  static getHashKeyForEdge(u, v) {
    return u * SimplifyDebts.OFFSET + v;
  }
}
// *
// * Implementation of Dinic's network flow algorithm. The algorithm works by first constructing a
// * level graph using a BFS and then finding augmenting paths on the level graph using multiple DFSs.
// *
// * <p>Time Complexity: O(EV?)
// *
// * @link https://github.com/williamfiset/Algorithms
class Dinics extends NetworkFlowSolverBase {
  level = [];
  // *
  //   * Creates an instance of a flow network solver. Use the {@link addEdge} method to add edges to
  //   * the graph.
  //   *
  //   * @param n - The number of nodes in the graph including source and sink nodes.
  constructor(n, vertexLabels) {
    super(n, vertexLabels);
    this.level = Array(n).fill(0);
  }
  solve() {
    // next[i] indicates the next unused edge index in the adjacency list for node i. This is part
    // of the Shimon Even and Alon Itai optimization of pruning deads ends as part of the DFS phase.
    var next = Array(this.n).fill(0);
    while (this.bfs()) {
      Arrays.fill(next, 0);
      // Find max flow by adding all augmenting path flows.
      for (f; f != 0; f = this.dfs(this.s, next, NetworkFlowSolverBase.INF)) {
        this.maxFlow += f;
      }
    }
    for (i; i < this.n; i++) {
      if (this.level[i] != -1) {
        this.minCut[i] = true;
      }
    }
  }
  // Do a BFS from source to sink and compute the depth/level of each node
  // which is the minimum number of edges from that node to the source.
  bfs() {
    Arrays.fill(this.level, -1);
    this.level[this.s] = 0;
    var q = java.util.ArrayDeque(this.n);
    q.offer(this.s);
    while (!(q.length == 0)) {
      var node = q.poll();
      for (const edge of this.graph[node]) {
        var cap = edge.remainingCapacity();
        if (cap > 0 && this.level[edge.to] == -1) {
          this.level[edge.to] = this.level[node] + 1;
          q.offer(edge.to);
        }
      }
    }
    return this.level[this.t] != -1;
  }
  dfs(at, next, flow) {
    if (at == this.t) {
      return flow;
    }
    var numEdges = this.graph[at].length;
    for (; next[at] < numEdges; next[at]++) {
      var edge = this.graph[at][next[at]];
      var cap = edge.remainingCapacity();
      if (cap > 0 && this.level[edge.to] == this.level[at] + 1) {
        var bottleNeck = this.dfs(edge.to, next, java.lang.Math.min(flow, cap));
        if (bottleNeck > 0) {
          edge.augment(bottleNeck);
          return bottleNeck;
        }
      }
    }
    return 0;
  }
}
class NetworkFlowSolverBase {
  // To avoid overflow, set infinity to a value less than Long.MAX_VALUE;
  static INF = Number.MAX_SAFE_INTEGER / 2;
//     class Edge {
//   from = 0;
//   to = 0;
//   fromLabel = null;
//   toLabel = null;
//   residual = null;
//   flow = 0;
//   cost = 0;
//   capacity = 0;
//   originalCost = 0;
// }
constructor(from, to, capacity) {
  this.this(from, to, capacity, 0);
}
constructor(from, to, capacity, cost) {
  this.from = from;
  this.to = to;
  this.capacity = capacity;
  this.originalCost = this.cost = cost;
}
isResidual() {
  return this.capacity == 0;
}
remainingCapacity() {
  return this.capacity - this.flow;
}
augment(bottleNeck) {
  this.flow += bottleNeck;
  this.residual.flow -= bottleNeck;
}
toString(s, t) {
  var u = (this.from == s) ? "s" : ((this.from == t) ? "t" : new String(this.from).toString());
  var v = (this.to == s) ? "s" : ((this.to == t) ? "t" : new String(this.to).toString());
  return String.format("Edge %s -> %s | flow = %d | capacity = %d | is residual: %s", u, v, this.flow, this.capacity, this.isResidual());
}
}

NetworkFlowSolverBase.Edge =  class {
  from = 0;
  to = 0;
  fromLabel = null;
  toLabel = null;
  residual = null;
  flow = 0;
  cost = 0;
  capacity = 0;
  originalCost = 0;
}

// Inputs: n = number of nodes, s = source, t = sink
n = 0;
s = 0;
t = 0;
maxFlow = 0;
minCost = 0;
minCut = [];
graph = [];
vertexLabels = [];
edges = null;
// 'visited' and 'visitedToken' are variables used for graph sub-routines to
// track whether a node has been visited or not. In particular, node 'i' was
// recently visited if visited[i] == visitedToken is true. This is handy
// because to mark all nodes as unvisited simply increment the visitedToken.
visitedToken = 1;
visited = [];
// Indicates whether the network flow algorithm has ran. We should not need to
// run the solver multiple times, because it always yields the same result.
solved = false;
// *
//   * Creates an instance of a flow network solver. Use the {@link addEdge} method to add edges to
//   * the graph.
//   *
//   * @param n - The number of nodes in the graph including source and sink nodes.
constructor(n, vertexLabels)
{
  this.n = n;
  this.initializeGraph();
  this.assignLabelsToVertices(vertexLabels);
  this.minCut = Array(n).fill(false);
  this.visited = Array(n).fill(0);
  this.edges = new Array();
}
// Construct an empty graph with n nodes including the source and sink nodes.
initializeGraph()
{
  this.graph = Array(this.n).fill(null);
  for (i; i < this.n; i++) {
    this.graph[i] = new Array();
  }
}
// Add labels to vertices in the graph.
assignLabelsToVertices(vertexLabels)
{
  if (vertexLabels.length != this.n) {
    throw new Error(String.format("You must pass %s number of labels", this.n));
  }
  this.vertexLabels = vertexLabels;
}
// *
//   * Adds a list of directed edges (and residual edges) to the flow graph.
//   *
//   * @param edges - A list of all edges to be added to the flow graph.
addEdges(edges)
{
  if (edges == null) {
    throw new Error("Edges cannot be null");
  }
  for (const edge of edges) {
    this.addEdge(edge.from, edge.to, edge.capacity);
  }
}
// *
//   * Adds a directed edge (and residual edge) to the flow graph.
//   *
//   * @param from - The index of the node the directed edge starts at.
//   * @param to - The index of the node the directed edge ends at.
//   * @param capacity - The capacity of the edge.
addEdge(from, to, capacity)
{
  if (capacity < 0) {
    throw new Error("Capacity < 0");
  }
  var e1 = new NetworkFlowSolverBase.Edge(from, to, capacity);
  var e2 = new NetworkFlowSolverBase.Edge(to, from, 0);
  e1.residual = e2;
  e2.residual = e1;
  (this.graph[from].push(e1) > 0);
  (this.graph[to].push(e2) > 0);
  (this.edges.push(e1) > 0);
}
// * Cost variant of {@link addEdge(int, int, int)} for min-cost max-flow
addEdge(from, to, capacity, cost)
{
  var e1 = new NetworkFlowSolverBase.Edge(from, to, capacity, cost);
  var e2 = new NetworkFlowSolverBase.Edge(to, from, 0, -cost);
  e1.residual = e2;
  e2.residual = e1;
  (this.graph[from].push(e1) > 0);
  (this.graph[to].push(e2) > 0);
  (this.edges.push(e1) > 0);
}
// Marks node 'i' as visited.
visit(i)
{
  this.visited[i] = this.visitedToken;
}
// Returns whether or not node 'i' has been visited.
visited(i)
{
  return this.visited[i] == this.visitedToken;
}
// Resets all nodes as unvisited. This is especially useful to do
// between iterations of finding augmenting paths, O(1)
markAllNodesAsUnvisited()
{
  this.visitedToken++;
}
// *
//   * Returns the graph after the solver has been executed. This allow you to inspect the {@link
//   * Edgeflow} compared to the {@link Edgecapacity} in each edge. This is useful if you want to
//   * figure out which edges were used during the max flow.
getGraph()
{
  this.execute();
  return this.graph;
}
// *
//   * Returns all edges in this flow network
getEdges()
{
  return this.edges;
}
// Returns the maximum flow from the source to the sink.
getMaxFlow()
{
  this.execute();
  return this.maxFlow;
}
// Returns the min cost from the source to the sink.
// NOTE: This method only applies to min-cost max-flow algorithms.
getMinCost()
{
  this.execute();
  return this.minCost;
}
// Returns the min-cut of this flow network in which the nodes on the "left side"
// of the cut with the source are marked as true and those on the "right side"
// of the cut with the sink are marked as false.
getMinCut()
{
  this.execute();
  return this.minCut;
}
// *
//   * Used to set the source for this flow network
setSource(s)
{
  this.s = s;
}
// *
//   * Used to set the sink for this flow network
setSink(t)
{
  this.t = t;
}
// *
//   * Get source for this flow network
getSource()
{
  return this.s;
}
// *
//   * Get sink for this flow network
getSink()
{
  return this.t;
}
// *
//   * Set 'solved' flag to false to force recomputation of subsequent flows.
recompute()
{
  this.solved = false;
}
// *
//   * Print all edges.
printEdges()
{
  for (const edge of this.edges) {
    console.log(String.format("%s ----%s----> %s", this.vertexLabels[edge.from], edge.capacity, this.vertexLabels[edge.to]));
  }
}
// Wrapper method that ensures we only call solve() once
execute()
{
  if (this.solved) {
    return;
  }
  this.solved = true;
  this.solve();
}
// Method to implement which solves the network flow problem.
solve();
}
SimplifyDebts.main([]);
