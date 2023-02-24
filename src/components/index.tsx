import React, { useState } from "react";

class Index extends React.Component<{}, {mousePosX: number, mousePosY: number, nodes: string}> {
    constructor(props: {} | Readonly<{}>) {
        super(props)
        
        this.state = {
            mousePosX: 0,
            mousePosY: 0,
            nodes: ''
        }
    }

    _onMouseMove(e: any) {
        this.setState({
            mousePosX: e.nativeEvent.offsetX,
            mousePosY: e.nativeEvent.offsetY
        })
    }

    _createNode(e: any) {
        this.setState({
            nodes: this.state.nodes.concat(`<div style='width: 50px; height: 50px; background-color: white; 
                left: calc(${this.state.mousePosX}px - 25px); 
                top: calc(${this.state.mousePosY}px - 25px); 
                position: absolute;
                z-index: -1'>
            </div>`) 
        })
        return { __html: this.state.nodes }
    }

    render() {
        const {mousePosX, mousePosY, nodes} = this.state;

        return(
            <div>
                <div className="background" onMouseMove={this._onMouseMove.bind(this)} onClick = {this._createNode.bind(this)}></div>
                <div dangerouslySetInnerHTML={{__html: nodes}}></div>
            </div>
        )
    }

}

export default Index;