import { Ground } from "./Ground";


export class AStar {
    private readonly grid: Ground[][];
    private readonly openSet: Ground[];
    private readonly closedSet: Ground[];
    private readonly startNode: Ground;
    private readonly endNode: Ground;

    constructor(grid: Ground[][], startNode: Ground, endNode: Ground) {
        this.grid = grid;
        this.startNode = startNode;
        this.endNode = endNode;
        this.openSet = [startNode];
        this.closedSet = [];
    }

    private calculateHeuristic(nodeA: Ground, nodeB: Ground): number {
        return Math.abs(nodeB.position.x - nodeA.position.x) + Math.abs(nodeB.position.y - nodeA.position.y);
    }

//   private getNeighbors(node: Ground): Ground[] {
//     const { x, y } = {x: node.getRow(), y: node.getCol()};
//     const neighbors = [];
    
//     if (this.grid[x - 1][y].walkable != null) if (x > 0 && this.grid[x - 1][y].walkable) neighbors.push(this.grid[x - 1][y]);
//     if (this.grid[x + 1][y].walkable != null) if (x < this.grid.length - 1 && this.grid[x + 1][y].walkable) neighbors.push(this.grid[x + 1][y]);
//     if (this.grid[x][y - 1].walkable != null) if (y > 0 && this.grid[x][y - 1].walkable) neighbors.push(this.grid[x][y - 1]);
//     if (this.grid[x][y + 1].walkable != null) if (y < this.grid[x].length - 1 && this.grid[x][y + 1].walkable) neighbors.push(this.grid[x][y + 1]);

//     return neighbors;
//   }

   
//   }

    private getPath(): Ground[] {
        const path = [];
        let current = this.endNode;

        while (current.getParent()) {
            console.log("Inside from getPath() while loop");
            path.unshift(current);
            current = current.getParent();
        }

        path.unshift(this.startNode);
        console.log("Exit from getPath() while loop");
        return path;
    }

    public findPath(): Ground[] {
        while (this.openSet.length > 0) {
            console.log("Inside findPath() while loop");
            // Find the node with the lowest f value in the open set
            let currentNode: Ground = this.openSet[0];

            for (let i = 1; i < this.openSet.length; i++) {
                if (this.openSet[i].getF() < currentNode.getF()) {
                currentNode = this.openSet[i];
                }
            }

            // Remove the current node from the open set and add it to the closed set
            this.openSet.splice(this.openSet.indexOf(currentNode), 1);
            this.closedSet.push(currentNode);

            // Check if we have reached the end node
            if (currentNode === this.endNode) {
                console.log("Exit from findPath() while loop");
                return this.getPath();
            }

            // Get the neighbors of the current node
            const neighbors = currentNode.updateNeighbors(this.grid);

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];

                // Check if the neighbor is already in the closed set
                if (this.closedSet.includes(neighbor)) {
                continue;
                }

                // Calculate the g score for the neighbor
                const tentativeGScore = currentNode.getG() + 1;

                // Check if the neighbor is already in the open set
                if (!this.openSet.includes(neighbor)) {
                this.openSet.push(neighbor);
                } else if (tentativeGScore >= neighbor.getG()) {
                continue;
                }

                // This path is the best until
                // now, so record it
                neighbor.setParent(currentNode);
                neighbor.setG(tentativeGScore);
                neighbor.setH(this.calculateHeuristic(neighbor, this.endNode));
                neighbor.setF(neighbor.getG() + neighbor.getH());
            }
        }

        // No path found
        console.log("Exit from findPath() while loop");
        return [];
    }

    public shutdown(): void {
        console.log("Shutdown AStar class");
        this.shutdown;
    } 
}