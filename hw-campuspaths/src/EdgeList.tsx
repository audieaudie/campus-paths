/*
 * Copyright (C) 2022 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2022 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import React, {Component} from 'react';
import {Edge} from "./Edge";
import { USER_INPUT_LENGTH } from "./Constants";

interface EdgeListProps {
    onChange(edges: Edge[]): void;  // called when a new edge list is ready
}
interface EdgeListValue {
    textValue: string;
}

/**
 * A text field that allows the user to enter the list of edges.
 * Also contains the buttons that the user will use to interact with the app.
 */
class EdgeList extends Component<EdgeListProps, EdgeListValue> {
    constructor(props: EdgeListProps) {
        super(props);
        this.state = {textValue: "Type here..."};
    }
    textChange(event: any) {
        this.setState({textValue: event.target.value,})
    }
    /**
     * Gets the shortest path between two buildings and stores it
     * @param s, String of buildings
     */
    async inputData(s: string) {
        if (s == '') {
            alert("Please input buildings!");
            return;
        }
        let str: string[] = s.split(" ");
        if (str.length < USER_INPUT_LENGTH) {
            alert("There needs to be two buildings!");
            return;
        }
        let edge: Edge[] = []
        let url:string = "http://localhost:4567/path?start=" + str[0] + "&end=" + str[1];
        if(str.length===3){
            if(str[1].startsWith("(")){
                url = "http://localhost:4567/path?start=" + str[0] + "+" + str[1] +"&end=" + str[2];
            }
            if(str[2].startsWith("(")){
                url = "http://localhost:4567/path?start=" + str[0] +"&end=" + str[1]+"+"+str[2];
            }
        }
        if(str.length===4){
            if(str[1].startsWith("(") && str[3].startsWith("(")){
                url = "http://localhost:4567/path?start=" + str[0] + "+" + str[1] +"&end=" + str[2]+"+"+str[3];
            }
        }
        try {
            let resp = await fetch(url);
            if (!resp.ok) {
                alert("Error!")
                return;
            }
            let paths = await resp.json();
            let len = paths.path.length;
            for (let i = 0; i < len; i++) {
                edge.push({x1:parseInt(paths.path[i].start.x),x2:parseInt(paths.path[i].end.x),
                    y1:parseInt(paths.path[i].start.y),y2:parseInt(paths.path[i].end.y)});
            }
        } catch (e) {
            alert("Incorrect input! Input must be two building names listed in the drop down above.");
            console.log(e);
        }
        this.props.onChange(edge);
    }

    render() {
        return (
            <div id="edge-list"> Buildings <br/>
                <textarea
                    rows={5}
                    cols={30}
                    onChange={(event) =>
                        this.setState({textValue: event.target.value})}
                    value={this.state.textValue}
                /> <br/>
                <button onClick={() => {
                    this.inputData(this.state.textValue)
                }}>Draw
                </button>
                <button onClick={() => {
                    this.setState({textValue: "",});
                    this.props.onChange([]);
                }}>Clear
                </button>

            </div>
        );
    }
}

export default EdgeList;
