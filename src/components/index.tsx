import React, { useState } from "react";

class Index extends React.Component<{}, {mousePosX: number, mousePosY: number, nodeId: number, nodes: {id: number, node: any} [], 
selectedNode: string}> {
    constructor(props: {} | Readonly<{}>) {
        super(props)
        
        this.state = {
            mousePosX: 0,
            mousePosY: 0,
            nodes: [],
            nodeId: 0,
            selectedNode: ''
        }
    }

    _onMouseMove(e: any) {
        this.setState({
            mousePosX: e.nativeEvent.offsetX,
            mousePosY: e.nativeEvent.offsetY
        })
    }

    _connectTwoStates(id: number) {
        let currButton = document.getElementById(id.toString())
        if (this.state.selectedNode !== '') { // If we already selected a starting state
            // TODO: Draw an edge from selectedNode to the current node.

            console.log(this.state.selectedNode)
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

            console.log("second")

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
            console.log("first")
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
            nodes: [...prevState.nodes, {id: prevState.nodeId, node: node}],
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
                <div className="background" onMouseMove={this._onMouseMove.bind(this)} onClick = {this._createNode.bind(this)}></div>
                {displayNodes}
            </div>
        )
    }

}

export default Index;