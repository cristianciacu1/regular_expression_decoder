import React, { useState } from "react";
import { Arrow } from "./arrow";

class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Edge {
    from: Point
    to: Point
    label: string
    constructor(from: Point, to: Point, label: string) {
        this.from = from
        this.to = to
        this.label = label
    }
}

class Index extends React.Component<{}, {mousePosX: number, 
    edges: Edge[], mousePosY: number, nodeId: number, screenWidth: number, screenHeight: number, nodes: {id: number, node: any, x: number, y: number} [], 
selectedNode: string}> {
    constructor(props: {} | Readonly<{}>) {
        super(props)
        
        this.state = {
            mousePosX: 0,
            mousePosY: 0,
            nodes: [],
            nodeId: 0,
            selectedNode: '',
            screenHeight: window.innerHeight,
            screenWidth: window.innerWidth,
            edges: []
        }
    }

    _onMouseMove(e: any) {
        this.setState({
            mousePosX: e.nativeEvent.offsetX,
            mousePosY: e.nativeEvent.offsetY
        })
    }

    redrawStoredLines(ctx: CanvasRenderingContext2D | null, edge: Edge) {
        for (let i = 0; i < this.state.edges.length; i++) {
            const current_edge = this.state.edges[i]
            this.drawLine(ctx, current_edge);
        }
        // Draw the last added edge
        this.drawLine(ctx, edge)
    }

    drawLine(ctx: CanvasRenderingContext2D | null, edge: Edge) {
        const a = edge.from
        const b = edge.to
        ctx?.beginPath();
        ctx?.beginPath();
        ctx!.strokeStyle = "blue";
        ctx?.moveTo(a.x, a.y + 25);

        const controlPointX = (a.x + b.x) / 2;
        const controlPointY = ((a.x - b.x < 0) ? Math.min(a.y, b.y) - 40 : Math.max(a.y, b.y) + 40)

        // Create the curved line between a and b.
        ctx?.quadraticCurveTo(controlPointX, controlPointY, b.x, b.y + 25);
        
        // Add label to the edge
        ctx?.fillText(edge.label, controlPointX, controlPointY + 10)
        
        ctx?.stroke();

    }

    _connectTwoStates(id: number) {
        let currButton = document.getElementById(id.toString())
        if (this.state.selectedNode !== '') { // If we already selected a starting state

            // Start node
            let x1 = this.state.nodes[Number(this.state.selectedNode)].x;
            let y1 = this.state.nodes[Number(this.state.selectedNode)].y;

            // End node
            let x2 = this.state.nodes[id].x;
            let y2 = this.state.nodes[id].y;

            const a = new Point(x1, y1);
            const b = new Point(x2, y2);

            const edge = new Edge(a, b, "test_label");

            const canvas = document.getElementById("canvas") as HTMLCanvasElement
            const ctx = canvas?.getContext("2d");
            canvas.height = this.state.screenHeight
            canvas.width = this.state.screenWidth

            this.redrawStoredLines(ctx, edge);

            this.setState(prevState => ({
                edges: [...prevState.edges, edge],
            }))

            // console.log(this.state.selectedNode)
            // Color the current node and wait one second.
            // After that second revert the colors of both nodes
            currButton?.classList.remove("unpressedButton")
            currButton?.classList.add("pressedButton")
            let selectedState = document.getElementById(this.state.selectedNode)

            setTimeout(() => {
                // Revert to the original colors of both nodes
                selectedState?.classList.remove("pressedButton")
                currButton?.classList.remove("pressedButton")
                selectedState?.classList.add("unpressedButton")
                currButton?.classList.add("unpressedButton")
            }, 1000)

            // Now, we need to delete the old selected node
            this.setState({
                selectedNode: ''
            })

        } else {
            currButton?.classList.remove("unpressedButton")
            currButton?.classList.add("pressedButton")
            this.setState({
                selectedNode: id.toString()
            })
        }
    }

    _createNode(e: any) {
        let node = 
        <button style={{width: '50px', height: '50px',
                left: this.state.mousePosX - 25,
                top: this.state.mousePosY - 25,
                position: 'absolute', zIndex: -1}} 
            id={this.state.nodeId.toString()} 
            onClick={this._connectTwoStates.bind(this, this.state.nodeId)}
            className={"unpressedButton"}>
        </button>;

        const newLocal = this;
        newLocal.setState(prevState => ({
            nodes: [...prevState.nodes, {id: prevState.nodeId, node: node, x: this.state.mousePosX - 25, y: this.state.mousePosY - 25}],
            nodeId: prevState.nodeId + 1
        }))
    }

    render() {
        const {mousePosX, mousePosY, nodes} = this.state;

        const displayNodes = nodes.map((node) => 
            <div key = {node.id}>
                {node.node}
            </div>
        );

        return(
            <div>
                <canvas id="canvas" className="background" onMouseMove={this._onMouseMove.bind(this)} onClick = {this._createNode.bind(this)}></canvas>
                {displayNodes}
            </div>
        )
    }

}

export default Index;